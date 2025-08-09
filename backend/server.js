const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DATA_DIR = path.join(__dirname, 'data');
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

function sendJSON(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res) {
  let filePath = url.parse(req.url).pathname;
  if (filePath === '/') filePath = '/index.html';
  const fullPath = path.join(FRONTEND_DIR, filePath);
  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(fullPath);
    const type = ext === '.html' ? 'text/html' : 'text/javascript';
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });
}

function handleApi(req, res) {
  const segments = req.url.split('/').filter(Boolean); // [ 'api', 'de', 'flashcards' ]
  if (segments.length < 3) {
    return sendJSON(res, { error: 'Bad Request' }, 400);
  }
  const country = segments[1];
  const resource = segments[2];
  if (req.method === 'GET') {
    const file = path.join(DATA_DIR, `${resource}_${country}.json`);
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return sendJSON(res, { error: 'Not Found' }, 404);
      sendJSON(res, JSON.parse(data));
    });
  } else if (req.method === 'POST' && resource === 'anamnesis') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let input;
      try { input = JSON.parse(body); } catch { return sendJSON(res, { error: 'Invalid JSON' }, 400); }
      const response = {
        message: 'Análise simulada',
        receivedText: input.text || null
      };
      sendJSON(res, response);
    });
  } else {
    sendJSON(res, { error: 'Method Not Allowed' }, 405);
  }
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    handleApi(req, res);
  } else {
    serveStatic(req, res);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
