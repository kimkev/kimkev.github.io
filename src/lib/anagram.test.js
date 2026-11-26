import { describe, expect, it } from 'vitest';

import { isCorrectGuess, pickWord, revealNextLetter, scrambleWord } from './anagram';

describe('anagram helpers', () => {
  it('scrambles into a different arrangement', () => {
    const scrambled = scrambleWord('planet', () => 0.42);

    expect(scrambled).not.toBe('planet');
    expect([...scrambled].sort()).toEqual([...'planet'].sort());
  });

  it('terminates for words made of one repeated letter', () => {
    expect(scrambleWord('aaaa')).toBe('aaaa');
  });

  it('compares guesses case-insensitively', () => {
    expect(isCorrectGuess(' Planet ', 'planet')).toBe(true);
    expect(isCorrectGuess('plants', 'planet')).toBe(false);
  });

  it('reveals letters in order and stops at the end', () => {
    expect(revealNextLetter('pl', 'planet')).toBe('pla');
    expect(revealNextLetter('planet', 'planet')).toBe('planet');
  });

  it('picks a word from the provided list', () => {
    expect(pickWord(['one', 'two'], () => 0)).toBe('one');
  });
});
