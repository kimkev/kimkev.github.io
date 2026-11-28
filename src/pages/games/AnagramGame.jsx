import { useCallback, useEffect, useRef, useState } from 'react';

import ProjectHeader from '../../components/ProjectHeader';
import { DIFFICULTIES, WORDS_BY_LENGTH } from '../../data/words';
import { isCorrectGuess, pickWord, revealNextLetter, scrambleWord } from '../../lib/anagram';
import './AnagramGame.css';

const labelFor = (level) => level[0].toUpperCase() + level.slice(1);

const AnagramGame = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [word, setWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [solved, setSolved] = useState(0);
  const inputRef = useRef(null);
  const scoredWord = useRef('');

  const startRound = useCallback((nextDifficulty = difficulty) => {
    const nextWord = pickWord(WORDS_BY_LENGTH[DIFFICULTIES[nextDifficulty]]);

    scoredWord.current = '';
    setWord(nextWord);
    setScrambledWord(scrambleWord(nextWord));
    setGuess('');
    setResult(null);
    setHintsUsed(0);
    inputRef.current?.focus();
  }, [difficulty]);

  useEffect(() => {
    startRound();
    // Start a fresh round whenever the difficulty changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  useEffect(() => {
    if (word && isCorrectGuess(guess, word)) setResult('correct');
  }, [guess, word]);

  useEffect(() => {
    if (result !== 'correct' || scoredWord.current === word) return;

    scoredWord.current = word;
    setStreak((current) => current + 1);
    setSolved((current) => current + 1);
  }, [result, word]);

  const hintsLeft = Math.max(0, word.length - 1 - hintsUsed);

  const handleGuess = (event) => {
    setGuess(event.target.value);
    setResult(null);
  };

  const handleDifficulty = (event) => setDifficulty(event.target.value);

  const handleHint = () => {
    if (hintsLeft === 0) return;

    setGuess((current) => revealNextLetter(current, word));
    setHintsUsed((current) => current + 1);
    setResult(null);
    inputRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (result === 'correct') {
      startRound();
      return;
    }

    if (!guess.trim()) return;

    if (isCorrectGuess(guess, word)) {
      startRound();
      return;
    }

    setResult('incorrect');
    setStreak(0);
  };

  return (
    <div className="container container-anagram">
      <ProjectHeader
        title="Anagram"
        description="Unscramble the word below. Hints fill in the next letter, and you can change difficulty at any time."
        tags={['Hooks', 'Unit-tested logic']}
        source="https://github.com/kimkev/kimkev.github.io/blob/master/src/pages/games/AnagramGame.jsx"
      />

      <div className="anagram-toolbar">
        <div className="difficulty-buttons" role="group" aria-label="Difficulty">
          {Object.keys(DIFFICULTIES).map((level) => (
            <button
              key={level}
              type="button"
              value={level}
              onClick={handleDifficulty}
              aria-pressed={difficulty === level}
            >
              {labelFor(level)}
            </button>
          ))}
        </div>

        <p className="anagram-stats" aria-live="polite">
          Streak: {streak} · Solved: {solved}
        </p>
      </div>

      <p className="scrambled-word">{scrambledWord}</p>

      <form className="container-input" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="anagram-guess">
          Your guess
        </label>
        <input
          id="anagram-guess"
          ref={inputRef}
          className="input"
          type="text"
          value={guess}
          onChange={handleGuess}
          placeholder="Guess here"
          autoComplete="off"
          spellCheck="false"
        />
        <div className="container-additional">
          <button type="button" onClick={handleHint} disabled={hintsLeft === 0}>
            Hint ({hintsLeft})
          </button>
          <button type="button" onClick={() => startRound()}>
            New word
          </button>
        </div>
      </form>

      <div className="anagram-answer" role="status">
        {result === 'correct' && <p className="anagram-correct">Correct! Press Enter for a new word.</p>}
        {result === 'incorrect' && <p className="anagram-incorrect">Not quite. Try again.</p>}
      </div>
    </div>
  );
};

export default AnagramGame;
