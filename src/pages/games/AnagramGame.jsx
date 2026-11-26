import { useCallback, useEffect, useRef, useState } from 'react';

import { DIFFICULTIES, WORDS_BY_LENGTH } from '../../data/words';
import { isCorrectGuess, pickWord, revealNextLetter, scrambleWord } from '../../lib/anagram';
import './AnagramGame.css';

const AnagramGame = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [word, setWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const startRound = useCallback((nextDifficulty = difficulty) => {
    const nextWord = pickWord(WORDS_BY_LENGTH[DIFFICULTIES[nextDifficulty]]);

    setWord(nextWord);
    setScrambledWord(scrambleWord(nextWord));
    setGuess('');
    setResult(null);
    inputRef.current?.focus();
  }, [difficulty]);

  useEffect(() => {
    startRound();
    // Start a fresh round whenever the difficulty changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  useEffect(() => {
    if (!word || guess.length !== word.length) {
      setResult(null);
      return;
    }

    setResult(isCorrectGuess(guess, word) ? 'correct' : 'incorrect');
  }, [guess, word]);

  const handleDifficulty = (event) => setDifficulty(event.target.value);

  const handleHint = () => {
    setGuess((current) => revealNextLetter(current, word));
    inputRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (result === 'correct') startRound();
  };

  return (
    <div className="container container-anagram">
      <h1>Guess the Word!</h1>

      <div className="difficulty-buttons">
        {Object.keys(DIFFICULTIES).map((level) => (
          <button
            key={level}
            type="button"
            value={level}
            onClick={handleDifficulty}
            aria-pressed={difficulty === level}
          >
            {level}
          </button>
        ))}
      </div>

      <p>Unscramble the word below:</p>
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
          onChange={(event) => setGuess(event.target.value)}
          placeholder="Guess here"
          autoComplete="off"
          spellCheck="false"
        />
        <div className="container-additional">
          <button type="button" onClick={handleHint}>
            Hint
          </button>
          <button type="button" onClick={() => startRound()}>
            Play again
          </button>
        </div>
      </form>

      <div className="anagram-answer" role="status">
        {result === 'correct' && <p className="anagram-correct">Correct! Press Enter for a new word.</p>}
        {result === 'incorrect' && <p className="anagram-incorrect">Incorrect. Try again.</p>}
      </div>
    </div>
  );
};

export default AnagramGame;
