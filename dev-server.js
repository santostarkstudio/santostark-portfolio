const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, 'public');
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
};

function resolveFile(urlPath) {
  const cleanPath = urlPath.split('?')[0].split('#')[0];
  if (cleanPath === '/' || cleanPath === '') {
    return path.join(PUBLIC_DIR, 'index.html');
  }

  // Check in public first
  const publicPath = path.join(PUBLIC_DIR, cleanPath);
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    return publicPath;
  }

  // Check in root
  const rootPath = path.join(ROOT_DIR, cleanPath);
  if (fs.existsSync(rootPath) && fs.statSync(rootPath).isFile()) {
    return rootPath;
  }

  // SPA fallback for HTML routes (e.g. /about, /projects)
  return path.join(PUBLIC_DIR, 'index.html');
}

function handleRequest(req, res) {
  // CORS & caching headers for local testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');

  const filePath = resolveFile(req.url);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // Support Video Streaming (HTTP 206 Range requests for bg-video.mp4)
    if (ext === '.mp4') {
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        });
        file.pipe(res);
        return;
      }
    }

    res.writeHead(200, {
      'Content-Length': stats.size,
      'Content-Type': contentType,
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function startServer(port, callback) {
  const server = http.createServer(handleRequest);
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying next port...`);
      startServer(port + 1, callback);
    } else {
      console.error('Server error:', err);
    }
  });
  server.listen(port, () => {
    callback(port);
  });
}

startServer(3000, (actualPort) => {
  const url = `http://localhost:${actualPort}`;
  console.log(`\n======================================================`);
  console.log(`  Santo Stark Studio is LIVE at: ${url}`);
  console.log(`======================================================\n`);

  // Automatically trigger the default browser to open
  exec(`start ${url}`, (err) => {
    if (!err) {
      console.log(`Browser automatically opened to ${url}`);
    }
  });
});
