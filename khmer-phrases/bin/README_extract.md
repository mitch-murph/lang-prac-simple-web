# Khmer Audio Phrase Extractor

This script extracts English, Khmer, and phonetic transcriptions from the HTML file, downloads the English audio files, and creates a CSV mapping all fields, retaining the category.

## Usage

1. Install dependencies:

    npm install axios cheerio

2. Run the script:

    node extract_khmer_audio.js

- Audio files will be saved in the `audio/` folder, named after the English translation.
- The CSV will be saved as `khmer_phrases.csv`.

---

If you want to re-run or change the HTML file name, update the `htmlFile` variable in the script.
