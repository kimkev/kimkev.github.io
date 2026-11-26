export const pickWord = (words, random = Math.random) => words[Math.floor(random() * words.length)];

/**
 * Shuffles the letters of a word. Guarantees a different arrangement when the
 * word has at least two distinct letters, and always terminates (the old
 * implementation could loop forever on words like "aaaa").
 */
export const scrambleWord = (word, random = Math.random) => {
  const letters = word.split('');

  for (let attempt = 0; attempt < 25; attempt += 1) {
    for (let i = letters.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    const candidate = letters.join('');
    if (candidate !== word) return candidate;
  }

  return letters.reverse().join('');
};

export const isCorrectGuess = (guess, word) =>
  guess.trim().toLowerCase() === word.toLowerCase();

export const revealNextLetter = (guess, word) => {
  if (guess.length >= word.length) return guess;
  return guess + word[guess.length];
};
