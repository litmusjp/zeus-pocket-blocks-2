'use strict';
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SignalGame = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const SHAPES = [
  { kind: 'I', color: '#48d7e8', cells: [[1, 1, 1, 1]] },
  { kind: 'O', color: '#ffc857', cells: [[1, 1], [1, 1]] },
  { kind: 'T', color: '#9d8cff', cells: [[0, 1, 0], [1, 1, 1]] },
  { kind: 'J', color: '#73a8ff', cells: [[1, 0, 0], [1, 1, 1]] },
  { kind: 'L', color: '#ff8f70', cells: [[0, 0, 1], [1, 1, 1]] },
  { kind: 'S', color: '#c7f36b', cells: [[0, 1, 1], [1, 1, 0]] },
  { kind: 'Z', color: '#f78bd2', cells: [[1, 1, 0], [0, 1, 1]] },
];

function cloneCells(cells) { return cells.map(row => row.slice()); }
function emptyBoard() { return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null)); }
function hashSeed(value) {
  let hash = 2166136261;
  for (const char of String(value)) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}
function createSeededRandom(seed = Date.now()) {
  let value = hashSeed(seed) || 1;
  return () => { value = Math.imul(value ^ value >>> 15, 1 | value); value ^= value + Math.imul(value ^ value >>> 7, 61 | value); return ((value ^ value >>> 14) >>> 0) / 4294967296; };
}
function dailySeed(date = new Date()) { return date.toISOString().slice(0, 10); }
function pieceFrom(random, kind) {
  const template = kind ? SHAPES.find(shape => shape.kind === kind) : SHAPES[Math.floor(random() * SHAPES.length)];
  return { kind: template.kind, rotation: 0, x: Math.floor((BOARD_WIDTH - template.cells[0].length) / 2), y: 0, color: template.color, cells: cloneCells(template.cells) };
}
function createGameState(options = {}) {
  const seed = options.seed || dailySeed();
  const random = createSeededRandom(seed);
  const activePiece = pieceFrom(random, options.activeKind);
  return { status: 'ready', mode: options.mode || 'classic', board: emptyBoard(), activePiece, nextPiece: pieceFrom(random), heldPiece: null, canHold: true, score: 0, lines: 0, level: 1, combo: 0, dropTimer: 0, seed };
}
function collides(board, piece, dx = 0, dy = 0, cells = piece.cells) {
  for (let y = 0; y < cells.length; y++) for (let x = 0; x < cells[y].length; x++) {
    if (!cells[y][x]) continue;
    const bx = piece.x + x + dx, by = piece.y + y + dy;
    if (bx < 0 || bx >= BOARD_WIDTH || by >= BOARD_HEIGHT) return true;
    if (by >= 0 && board[by][bx]) return true;
  }
  return false;
}
function rotateMatrix(cells) { return cells[0].map((_, x) => cells.map(row => row[x]).reverse()); }
function rotateWithKicks(board, piece) {
  const cells = rotateMatrix(piece.cells);
  for (const dx of [0, -1, 1, -2, 2]) {
    const candidate = { ...piece, x: piece.x + dx, rotation: (piece.rotation + 1) % 4, cells: cloneCells(cells) };
    if (!collides(board, candidate)) return { ok: true, piece: candidate };
  }
  return { ok: false, piece: { ...piece, cells: cloneCells(piece.cells) } };
}
function lockPiece(board, piece) {
  const next = board.map(row => row.slice());
  piece.cells.forEach((row, y) => row.forEach((filled, x) => { if (filled && piece.y + y >= 0) next[piece.y + y][piece.x + x] = piece.color; }));
  return next;
}
function clearLines(board) {
  const kept = board.filter(row => !row.every(Boolean));
  const cleared = BOARD_HEIGHT - kept.length;
  return { board: [...Array.from({ length: cleared }, () => Array(BOARD_WIDTH).fill(null)), ...kept], cleared };
}
function scoreClear(lines, level, combo) { return lines * 100 * level + Math.max(0, combo) * 30; }
function step(state, event) {
  if (event.type !== 'line-clear') return state;
  const count = Math.max(0, Number(event.count) || 0);
  if (!count) return { ...state, combo: 0 };
  const lines = state.lines + count;
  const combo = state.combo + 1;
  const level = 1 + Math.floor(lines / 8);
  return { ...state, lines, combo, level, score: state.score + scoreClear(count, level, combo) };
}

return { BOARD_WIDTH, BOARD_HEIGHT, SHAPES, createSeededRandom, dailySeed, createGameState, collides, rotateWithKicks, lockPiece, clearLines, scoreClear, step };
});
