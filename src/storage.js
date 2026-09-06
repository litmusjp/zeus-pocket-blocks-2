'use strict';
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SignalStorage = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {

const STORAGE_KEY = 'signal-garden';
const STORAGE_VERSION = 1;
const DEFAULT_RECORD = Object.freeze({
  version: STORAGE_VERSION,
  preferences: { theme: 'dark', speed: 'normal', soundEnabled: true, hapticsEnabled: true, reducedMotion: false },
  bests: {
    classic: { score: 0, lines: 0, level: 1, achievedAt: null },
    sprint: { score: 0, lines: 0, level: 1, achievedAt: null },
    daily: { score: 0, lines: 0, level: 1, achievedAt: null },
  },
  dailyRuns: {},
});

function copy(value) { return JSON.parse(JSON.stringify(value)); }
function validBest(value) { return value && typeof value === 'object' && Number.isFinite(Number(value.score)) && Number.isFinite(Number(value.lines)) && Number.isFinite(Number(value.level)); }
function validRecord(value) { return value && typeof value === 'object' && value.version === STORAGE_VERSION && value.bests && typeof value.bests === 'object' && ['classic', 'sprint', 'daily'].every(key => validBest(value.bests[key])) && value.preferences && typeof value.preferences === 'object'; }
function normalizeRecord(value) {
  const record = copy(DEFAULT_RECORD);
  if (!value || typeof value !== 'object') return record;
  if (value.preferences && typeof value.preferences === 'object') record.preferences = { ...record.preferences, ...value.preferences };
  if (value.bests && typeof value.bests === 'object') {
    for (const key of Object.keys(record.bests)) {
      const source = value.bests[key];
      if (validBest(source)) record.bests[key] = { ...record.bests[key], score: Math.max(0, Number(source.score)), lines: Math.max(0, Number(source.lines)), level: Math.max(1, Number(source.level)), achievedAt: typeof source.achievedAt === 'string' ? source.achievedAt : null };
    }
  }
  if (value.dailyRuns && typeof value.dailyRuns === 'object' && !Array.isArray(value.dailyRuns)) record.dailyRuns = value.dailyRuns;
  return record;
}
function createStore(storage = globalThis.localStorage) {
  function readRaw() {
    try { return storage && typeof storage.getItem === 'function' ? storage.getItem(STORAGE_KEY) : storage?.get(STORAGE_KEY); } catch { return null; }
  }
  function writeRaw(value) {
    try { if (typeof storage?.setItem === 'function') storage.setItem(STORAGE_KEY, value); else storage?.set(STORAGE_KEY, value); } catch { /* storage is optional */ }
  }
  function load() {
    let parsed;
    try { parsed = JSON.parse(readRaw() || 'null'); } catch { parsed = null; }
    if (validRecord(parsed)) return parsed;
    const migrated = copy(DEFAULT_RECORD);
    if (parsed && Number.isFinite(Number(parsed.best))) migrated.bests.classic.score = Number(parsed.best);
    try { const legacy = Number(storage?.getItem?.('pb2-best') ?? storage?.get?.('pb2-best')); if (legacy > migrated.bests.classic.score) migrated.bests.classic.score = legacy; } catch { /* ignore */ }
    writeRaw(JSON.stringify(migrated));
    return migrated;
  }
  function updateBest(mode, result) {
    const record = load();
    const key = ['classic', 'sprint', 'daily'].includes(mode) ? mode : 'classic';
    const current = record.bests[key];
    if (Number(result.score) > current.score) record.bests[key] = { score: Number(result.score) || 0, lines: Number(result.lines) || 0, level: Number(result.level) || 1, achievedAt: new Date().toISOString() };
    writeRaw(JSON.stringify(record));
    return record;
  }
  function savePreferences(preferences) { const record = load(); record.preferences = { ...record.preferences, ...preferences }; writeRaw(JSON.stringify(record)); return record; }
  return { load, updateBest, savePreferences };
}

return { STORAGE_KEY, STORAGE_VERSION, DEFAULT_RECORD, createStore };
});
