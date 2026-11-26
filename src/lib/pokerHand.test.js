import { describe, expect, it } from 'vitest';

import { compareHands, describeHand, evaluateHand } from './pokerHand';

const card = (value, suit) => ({ value, suit });

const HAND = (values, suits = ['HEARTS', 'SPADES', 'CLUBS', 'DIAMONDS', 'HEARTS']) =>
  values.map((value, index) => card(value, suits[index]));

describe('poker hand evaluation', () => {
  it('recognises a royal flush', () => {
    const result = evaluateHand(HAND(['ACE', 'KING', 'QUEEN', 'JACK', '10'], ['SPADES', 'SPADES', 'SPADES', 'SPADES', 'SPADES']));

    expect(result.name).toBe('Royal Flush');
  });

  it('recognises the wheel straight', () => {
    const result = evaluateHand(HAND(['ACE', '2', '3', '4', '5']));

    expect(result.name).toBe('Straight');
    expect(result.tiebreak).toEqual([5]);
  });

  it('ranks a full house above a flush', () => {
    const fullHouse = evaluateHand(HAND(['KING', 'KING', 'KING', '4', '4']));
    const flush = evaluateHand(
      HAND(['2', '6', '9', 'JACK', '3'], ['SPADES', 'SPADES', 'SPADES', 'SPADES', 'SPADES']),
    );

    expect(compareHands(fullHouse, flush)).toBe(1);
  });

  it('breaks a pair tie with the kicker', () => {
    const pairOfKingsWithAce = evaluateHand(HAND(['KING', 'KING', 'ACE', '4', '2']));
    const pairOfKingsWithQueen = evaluateHand(HAND(['KING', 'KING', 'QUEEN', '4', '2']));

    expect(compareHands(pairOfKingsWithAce, pairOfKingsWithQueen)).toBe(1);
  });

  it('compares high cards instead of returning undefined', () => {
    const aceHigh = evaluateHand(HAND(['ACE', '9', '7', '4', '2'], ['SPADES', 'HEARTS', 'CLUBS', 'DIAMONDS', 'SPADES']));
    const kingHigh = evaluateHand(HAND(['KING', '9', '7', '4', '2'], ['SPADES', 'HEARTS', 'CLUBS', 'DIAMONDS', 'HEARTS']));

    expect(compareHands(aceHigh, kingHigh)).toBe(1);
    expect(
      describeHand(HAND(['ACE', '9', '7', '4', '2'], ['SPADES', 'HEARTS', 'CLUBS', 'DIAMONDS', 'SPADES'])),
    ).toBe('High Card (Ace high)');
  });

  it('reports identical hands as a tie', () => {
    const first = evaluateHand(HAND(['ACE', '9', '7', '4', '2'], ['HEARTS', 'SPADES', 'CLUBS', 'DIAMONDS', 'HEARTS']));
    const second = evaluateHand(HAND(['ACE', '9', '7', '4', '2'], ['SPADES', 'CLUBS', 'DIAMONDS', 'HEARTS', 'SPADES']));

    expect(compareHands(first, second)).toBe(0);
  });
});
