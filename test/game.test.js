const test = require('node:test');
const assert = require('node:assert/strict');
const {
  BOARD_WIDTH, BOARD_HEIGHT, SHAPES, createSeededRandom,
  createGameState, collides, rotateWithKicks, clearLines,
  lockPiece, scoreClear, dailySeed, step,
} = require('../src/game');

test('seeded random streams and daily seeds are deterministic in UTC', () => {
  const a = createSeededRandom('2026-09-06');
  const b = createSeededRandom('2026-09-06');
  assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
  assert.equal(dailySeed(new Date('2026-09-06T23:59:00-07:00')), '2026-09-07');
  assert.equal(dailySeed(new Date('2026-09-06T00:01:00+14:00')), '2026-09-05');
});

test('new state has the documented shape and valid seeded pieces', () => {
  const state = createGameState({ mode: 'daily', seed: '2026-09-06' });
  assert.equal(state.board.length, BOARD_HEIGHT);
  assert.equal(state.board[0].length, BOARD_WIDTH);
  assert.equal(state.mode, 'daily');
  assert.ok(SHAPES.some(shape => shape.kind === state.activePiece.kind));
  assert.equal(state.status, 'ready');
});

test('collision detects walls, floor, and occupied cells', () => {
  const state = createGameState({ seed: 'x' });
  const piece = { ...state.activePiece, x: -1, y: 0 };
  assert.equal(collides(state.board, piece), true);
  piece.x = 3; piece.y = BOARD_HEIGHT;
  assert.equal(collides(state.board, piece), true);
  const occupied = state.board.map(row => row.slice()); occupied[5][4] = '#fff';
  assert.equal(collides(occupied, { ...state.activePiece, x: 3, y: 4 }), true);
});

test('rotation applies a wall kick without mutating the source piece', () => {
  const state = createGameState({ seed: 'rotation' });
  const source = { ...state.activePiece, x: -1, rotation: 0 };
  const result = rotateWithKicks(state.board, source);
  assert.equal(result.ok, true);
  assert.notEqual(result.piece, source);
  assert.equal(source.rotation, 0);
  assert.equal(collides(state.board, result.piece), false);
});

test('line clearing removes complete rows and preserves partial rows', () => {
  const board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
  board[BOARD_HEIGHT - 1].fill('#48d7e8');
  board[BOARD_HEIGHT - 2][0] = '#9d8cff';
  const result = clearLines(board);
  assert.equal(result.cleared, 1);
  assert.equal(result.board.length, BOARD_HEIGHT);
  assert.equal(result.board[BOARD_HEIGHT - 1][0], '#9d8cff');
});

test('locking, combo scoring, and level progression are explicit', () => {
  const state = createGameState({ seed: 'score' });
  const board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
  const piece = { kind: 'I', rotation: 0, x: 3, y: BOARD_HEIGHT - 1, color: '#48d7e8', cells: [[1, 1, 1, 1]] };
  const locked = lockPiece(board, piece);
  assert.equal(locked[BOARD_HEIGHT - 1][3], '#48d7e8');
  assert.equal(scoreClear(2, 3, 2), 660);
  const advanced = step({ ...state, status: 'active', lines: 7, level: 1 }, { type: 'line-clear', count: 1 });
  assert.equal(advanced.level, 2);
  assert.equal(advanced.combo, 1);
});
