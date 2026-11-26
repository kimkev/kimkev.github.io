const CARD_VALUES = {
  ACE: 14,
  KING: 13,
  QUEEN: 12,
  JACK: 11,
  '10': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
};

const NAMES = {
  14: 'Ace',
  13: 'King',
  12: 'Queen',
  11: 'Jack',
  10: 'Ten',
  9: 'Nine',
  8: 'Eight',
  7: 'Seven',
  6: 'Six',
  5: 'Five',
  4: 'Four',
  3: 'Three',
  2: 'Two',
};

const hand = (name, rank, tiebreak) => ({ name, rank, tiebreak });

const descending = (values) => [...values].sort((a, b) => b - a);

const kickers = (values, excluded) =>
  descending(values.filter((value) => !excluded.includes(value)));

/**
 * Scores a five-card hand. Rank order matches standard poker so hands can be
 * compared directly; tiebreak holds the card values that break equal ranks.
 */
export const evaluateHand = (cards) => {
  const values = cards.map((card) => CARD_VALUES[card.value]).filter(Boolean);
  const suits = cards.map((card) => card.suit);

  const flush = suits.length === 5 && suits.every((suit) => suit === suits[0]);

  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const groups = [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || b.value - a.value);

  const unique = [...new Set(values)].sort((a, b) => b - a);
  const isWheel = unique.join(',') === '14,5,4,3,2';
  const straight = isWheel || (unique.length === 5 && unique[0] - unique[4] === 4);
  const straightHigh = isWheel ? 5 : unique[0];

  if (straight && flush && straightHigh === 14) return hand('Royal Flush', 10, [14]);
  if (straight && flush) return hand('Straight Flush', 9, [straightHigh]);

  if (groups[0].count === 4) {
    return hand('Four of a Kind', 8, [groups[0].value, ...kickers(values, [groups[0].value])]);
  }

  if (groups[0].count === 3 && groups[1]?.count === 2) {
    return hand('Full House', 7, [groups[0].value, groups[1].value]);
  }

  if (flush) return hand('Flush', 6, descending(values));
  if (straight) return hand('Straight', 5, [straightHigh]);

  if (groups[0].count === 3) {
    return hand('Three of a Kind', 4, [groups[0].value, ...kickers(values, [groups[0].value])]);
  }

  const pairs = groups
    .filter((group) => group.count === 2)
    .map((group) => group.value)
    .sort((a, b) => b - a);

  if (pairs.length === 2) {
    return hand('Two Pair', 3, [pairs[0], pairs[1], kickers(values, pairs)[0]]);
  }

  if (pairs.length === 1) {
    return hand('One Pair', 2, [pairs[0], ...kickers(values, pairs)]);
  }

  return hand('High Card', 1, descending(values));
};

export const compareHands = (first, second) => {
  if (first.rank !== second.rank) return Math.sign(first.rank - second.rank);

  const length = Math.max(first.tiebreak.length, second.tiebreak.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (first.tiebreak[index] ?? 0) - (second.tiebreak[index] ?? 0);
    if (difference !== 0) return Math.sign(difference);
  }

  return 0;
};

export const describeHand = (cards) => {
  const result = evaluateHand(cards);
  if (result.name !== 'High Card') return result.name;

  return `${result.name} (${NAMES[result.tiebreak[0]]} high)`;
};
