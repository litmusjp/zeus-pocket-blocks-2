const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');

test('responsive shell declares mobile-safe viewport and Pocket Blocks 2.0 identity', () => {
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /Pocket Blocks 2\.0/);
  assert.match(html, /touch-action:none/);
});

test('interactive controls meet thumb target and expose keyboard parity', () => {
  assert.match(html, /min-height:48px/);
  assert.match(html, /ArrowLeft/);
  assert.match(html, /toLowerCase\(\)==='c'/);
  assert.match(html, /aria-label="Move left"/);
});

test('reduced motion and responsive narrow-phone rules are present', () => {
  assert.match(html, /prefers-reduced-motion/);
  assert.match(html, /max-width:460px/);
  assert.match(html, /env\(safe-area-inset-bottom/);
});

test('narrow-phone shell keeps the essential loop above the fold', () => {
  assert.match(html, /@media\(max-width:460px\)/);
  assert.match(html, /\.hint\{display:none\}/);
});
