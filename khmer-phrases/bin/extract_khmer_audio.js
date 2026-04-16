const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const NodeID3 = require('node-id3');

const htmlFile = path.join(__dirname, 'Khmer travel vocabulary with audio, mp3 and PDF.html');
const outputCsv = path.join(__dirname, 'khmer_phrases.csv');
const audioDir = path.join(__dirname, 'audio');
const audioBaseUrl = 'https://www.loecsen.com/OrizonFlash_V2/ressources/son/';

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir);
}

const html = fs.readFileSync(htmlFile, 'utf8');
const $ = cheerio.load(html);

// Build grouped structure: { category, catIndex, rows: [{english, khmer, phonetic, audio}] }
const groups = [];
const listT = $('#list_t');
const catEls = listT.children('.topr');
catEls.each((i, el) => {
    const catRaw = $(el).find('.colonnes span').first().text().trim();
    const catIndex = parseInt(catRaw.match(/^(\d+)/)?.[1] || (i + 1), 10);
    const cat = catRaw.replace(/^\d+\s*-\s*/, '').trim();
    const rows = [];
    $(el).find('table.marges_t tr').each((j, row) => {
        const tds = $(row).find('td');
        if (tds.length < 3) return;
        const engTd = $(tds[0]);
        const khmTd = $(tds[1]);
        const phoTd = $(tds[2]);
        const engAudio = engTd.attr('data-id');
        const khmAudio = khmTd.attr('data-id');
        const eng = engTd.text().replace(/^🔊\s*/, '').trim();
        const khm = khmTd.text().replace(/^🔊\s*/, '').trim();
        const pho = phoTd.text().replace(/\s+/g, ' ').trim();
        if (!khmAudio || !eng) return;
        rows.push({ english: eng, khmer: khm, phonetic: pho, audio: khmAudio });
    });
    if (rows.length) groups.push({ category: cat, catIndex, rows });
});

// Pre-scan to guard against identical english+phonetic combos
const usedFilenames = {};

async function downloadAudio({ audio, english, khmer, phonetic, category, catIndex, trackNum, trackTotal }) {
    const url = audioBaseUrl + audio;
    const baseEng = english.replace(/[\/\\:*?"<>|]/g, '').trim();
    const safePhonetic = phonetic.replace(/[\/\\:*?"<>|]/g, '').trim();
    const paddedIndex = String(catIndex).padStart(2, '0');
    const catDirName = `${paddedIndex} ${category}`;
    const catDir = path.join(audioDir, catDirName);
    if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });

    // Always include phonetic; append counter if still colliding
    let baseName = `${baseEng} (${safePhonetic})`;
    const fileKey = catDirName + '/' + baseName;
    if (!usedFilenames[fileKey]) {
        usedFilenames[fileKey] = 1;
    } else {
        usedFilenames[fileKey]++;
    }
    const safeName = usedFilenames[fileKey] === 1
        ? baseName + '.mp3'
        : `${baseName} ${usedFilenames[fileKey]}.mp3`;

    const dest = path.join(catDir, safeName);
    const relPath = path.join(catDirName, safeName);

    if (!fs.existsSync(dest)) {
        try {
            const res = await axios({ url, responseType: 'stream' });
            await new Promise((resolve, reject) => {
                const stream = res.data.pipe(fs.createWriteStream(dest));
                stream.on('finish', resolve);
                stream.on('error', reject);
            });
        } catch (e) {
            console.error('Failed to download', url);
            return '';
        }
    }

    // Write ID3 tags
    const tags = {
        title: english,
        album: `Khmer Travel Vocabulary - ${paddedIndex} ${category}`,
        artist: 'Loecsen',
        genre: 'Language Learning',
        trackNumber: `${trackNum}/${trackTotal}`,
        partOfSet: `${catIndex}`,
        comment: { language: 'eng', text: `${khmer}  [${phonetic}]` },
    };
    NodeID3.write(tags, dest);

    return relPath;
}

(async () => {
    const csvRows = [['Category','English','Khmer','Phonetic','AudioFile']];
    for (const group of groups) {
        const { category, catIndex, rows } = group;
        console.log(`Downloading category: ${category} (${rows.length} tracks)`);
        for (let t = 0; t < rows.length; t++) {
            const row = rows[t];
            const audioFile = await downloadAudio({
                ...row,
                category,
                catIndex,
                trackNum: t + 1,
                trackTotal: rows.length,
            });
            csvRows.push([category, row.english, row.khmer, row.phonetic, audioFile]);
        }
    }
    fs.writeFileSync(outputCsv, csvRows.map(r => r.map(f => '"'+String(f).replace(/"/g,'""')+'"').join(',')).join('\n'), 'utf8');
    console.log('Done! CSV and audio files saved.');
})();
