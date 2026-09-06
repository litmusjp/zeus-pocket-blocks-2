const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createServer, resolveRequestPath } = require('../server');

function request(port, path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request({ port, path, method }, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error', reject);
    req.end();
  });
}

test('path resolver rejects malformed encodings and traversal', () => {
  assert.equal(resolveRequestPath(__dirname, '/%E0%A4%A').error, 400);
  assert.equal(resolveRequestPath(__dirname, '/../server.js').error, 403);
  assert.equal(resolveRequestPath(__dirname, '/..\\server.js').error, 403);
});

test('server exposes health and static page safely', async t => {
  const server = createServer({ root: __dirname + '/..' });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const port = server.address().port;
  const health = await request(port, '/health');
  assert.equal(health.status, 200);
  assert.deepEqual(JSON.parse(health.body), { status: 'ok' });
  const page = await request(port, '/?cache=1');
  assert.equal(page.status, 200);
  assert.match(page.body, /Pocket Blocks 2\.0/);
  const malformed = await request(port, '/%E0%A4%A');
  assert.equal(malformed.status, 400);
  const head = await request(port, '/', 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(head.body, '');
  const method = await request(port, '/', 'POST');
  assert.equal(method.status, 405);
});
