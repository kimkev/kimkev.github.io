import { describe, expect, it } from 'vitest';

import { createBoard, getWinner, isDraw, otherPlayer } from './ticTacToe';

describe('ticTacToe', () => {
  it('finds a row win', () => {
    const board = ['X', 'X', 'X', null, 'O', null, 'O', null, null];

    expect(getWinner(board)).toEqual({ winner: 'X', line: [0, 1, 2] });
  });

  it('finds a diagonal win', () => {
    const board = ['O', 'X', 'X', null, 'O', null, null, null, 'O'];

    expect(getWinner(board)).toEqual({ winner: 'O', line: [0, 4, 8] });
  });

  it('ignores a line with mixed symbols', () => {
    const board = ['X', 'O', 'X', null, null, null, null, null, null];

    expect(getWinner(board)).toBeNull();
  });

  it('detects a full board without a winner', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];

    expect(getWinner(board)).toBeNull();
    expect(isDraw(board)).toBe(true);
  });

  it('reports an empty board as playable', () => {
    expect(isDraw(createBoard())).toBe(false);
  });

  it('alternates players', () => {
    expect(otherPlayer('X')).toBe('O');
    expect(otherPlayer('O')).toBe('X');
  });
});
