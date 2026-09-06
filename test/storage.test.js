const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, DEFAULT_RECORD, STORAGE_VERSION } = require('../src/storage');

test('storage restores defaults when data is missing or corrupt', () => {
  const memory = new Map([['signal-garden', '{bad json']]);
  const store = createStore(memory);
  assert.deepEqual(store.load(), DEFAULT_RECORD);
});

test('storage migrates legacy best score and writes versioned records', () => {
  const memory = new Map([['signal-garden', JSON.stringify({ best: 1200 })]]);
  const store = createStore(memory);
  const loaded = store.load();
  assert.equal(loaded.version, STORAGE_VERSION);
  assert.equal(loaded.bests.classic.score, 1200);
  const saved = store.updateBest('classic', { score: 1800, lines: 7, level: 2 });
  assert.equal(saved.bests.classic.score, 1800);
  assert.deepEqual(JSON.parse(memory.get('signal-garden')).bests.classic, saved.bests.classic);
});

test('storage replaces partial nested records with safe defaults', () => {
  const memory = new Map([['signal-garden', JSON.stringify({ version: 1, bests: {}, preferences: {} })]]);
  const store = createStore(memory);
  const loaded = store.load();
  assert.deepEqual(loaded.bests, DEFAULT_RECORD.bests);
  assert.doesNotThrow(() => store.updateBest('classic', { score: 25, lines: 1, level: 1 }));
  assert.equal(store.load().bests.classic.score, 25);
});

test('storage never replaces a higher personal best', () => {
  const memory = new Map();
  const store = createStore(memory);
  store.updateBest('classic', { score: 200, lines: 2, level: 1 });
  const unchanged = store.updateBest('classic', { score: 100, lines: 9, level: 4 });
  assert.equal(unchanged.bests.classic.score, 200);
  assert.equal(unchanged.bests.classic.lines, 2);
});
