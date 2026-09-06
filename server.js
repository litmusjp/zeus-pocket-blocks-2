const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

function response(res, status, body, headers = {}) {
  const payload = Buffer.from(body);
  res.writeHead(status, {
    'Content-Length': payload.length,
    ...headers,
  });
  res.end(payload);
}

function resolveRequestPath(root, requestUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent((requestUrl || '/').split('?')[0]);
  } catch {
    return { error: 400 };
  }

  // Treat backslashes as separators too, preventing traversal on Windows.
  const normalizedRequest = pathname.replaceAll('\\', '/');
  const relative = normalizedRequest === '/' ? 'index.html' : normalizedRequest.replace(/^\/+/, '');
  const rootPath = path.resolve(root);
  const filePath = path.resolve(rootPath, relative);
  const relativeToRoot = path.relative(rootPath, filePath);
  if (relativeToRoot.startsWith('..' + path.sep) || relativeToRoot === '..' || path.isAbsolute(relativeToRoot)) {
    return { error: 403 };
  }
  return { filePath };
}

function createServer(options = {}) {
  const root = path.resolve(options.root || __dirname);
  return http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return response(res, 405, 'Method not allowed', { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    }
    if (req.url === '/health' || (req.url || '').startsWith('/health?')) {
      return response(res, 200, JSON.stringify({ status: 'ok' }), {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      });
    }

    const resolved = resolveRequestPath(root, req.url);
    if (resolved.error) {
      return response(res, resolved.error, resolved.error === 400 ? 'Bad request' : 'Forbidden', {
        'Content-Type': 'text/plain; charset=utf-8',
      });
    }

    fs.stat(resolved.filePath, (statError, stat) => {
      if (statError || !stat.isFile()) {
        return response(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      }
      fs.readFile(resolved.filePath, (readError, data) => {
        if (readError) {
          return response(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
        }
        const extension = path.extname(resolved.filePath).toLowerCase();
        const isHtml = extension === '.html';
        const headers = {
          'Content-Type': CONTENT_TYPES[extension] || 'application/octet-stream',
          'Cache-Control': isHtml ? 'no-cache' : 'public, max-age=31536000, immutable',
        };
        if (req.method === 'HEAD') {
          res.writeHead(200, { ...headers, 'Content-Length': data.length });
          return res.end();
        }
        res.writeHead(200, { ...headers, 'Content-Length': data.length });
        res.end(data);
      });
    });
  });
}

if (require.main === module) {
  createServer().listen(DEFAULT_PORT, '0.0.0.0', () => {
    console.log(`Pocket Blocks 2 listening on ${DEFAULT_PORT}`);
  });
}

module.exports = { createServer, resolveRequestPath };
