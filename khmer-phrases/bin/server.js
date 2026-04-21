const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const ROOT = path.join(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.csv':  'text/csv; charset=utf-8',
  '.mp3':  'audio/mpeg',
};

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.join(ROOT, urlPath === '/' ? '/index.html' : urlPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end(); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Khmer filter running at http://localhost:${PORT}`);
});
