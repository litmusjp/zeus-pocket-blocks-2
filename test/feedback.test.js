const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');

test('Pocket Blocks 2.0 exposes live feedback and distinct identity', () => {
  assert.match(html, /<title>Pocket Blocks 2\.0<\/title>/);
  assert.match(html, /<h1>Pocket Blocks 2\.0<\/h1>/);
  assert.match(html, /id="overTitle">Pocket Blocks 2\.0/);
  assert.match(html, /meta name="description" content="Pocket Blocks 2\.0/);
  assert.doesNotMatch(html, /Signal Garden/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /Pocket Blocks 2\.0/);
  assert.match(html, /NEW BEST|new-best/);
  assert.match(html, /<script src="\/src\/game\.js"><\/script>/);
  assert.match(html, /<script src="\/src\/storage\.js"><\/script>/);
  assert.match(html, /SignalGame/);
  assert.match(html, /SignalStorage/);
  for (const api of ['createGameState','collides','rotateWithKicks','lockPiece','clearLines','step']) assert.match(html, new RegExp(`rules\\.${api}`));
});

test('feedback states announce pause, drops, clears, combos, levels, and completion', () => {
  for (const phrase of ['Paused', 'Resume', 'SLAM', 'Row cleared', 'COMBO', 'LEVEL UP', 'Run complete', 'NEW BEST']) assert.match(html, new RegExp(phrase));
});

test('toggle and pause controls expose stateful ARIA semantics', () => {
  assert.match(html, /id="sound"[^>]*aria-pressed="true"/);
  assert.match(html, /id="theme"[^>]*aria-pressed="false"/);
  assert.match(html, /data-a="pause"[^>]*aria-pressed="false"/);
  assert.match(html, /setAttribute\('aria-pressed'/);
});
