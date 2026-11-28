import { useEffect, useRef, useState } from 'react';

import { PASSAGES } from '../../data/passages';
import ProjectHeader from '../../components/ProjectHeader';
import './TypingGame.css';

const TIME_LIMIT = 30;

const pickPassage = () => PASSAGES[Math.floor(Math.random() * PASSAGES.length)];

const TypingGame = () => {
  const [passage, setPassage] = useState(pickPassage);
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isRunning, setIsRunning] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const startGame = () => {
    setPassage(pickPassage());
    setTyped('');
    setTimeLeft(TIME_LIMIT);
    setIsRunning(true);
  };

  const resetGame = () => {
    setTyped('');
    setTimeLeft(TIME_LIMIT);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning) inputRef.current?.focus();
  }, [isRunning]);

  const elapsedSeconds = TIME_LIMIT - timeLeft;
  const wordsTyped = typed.trim() ? typed.trim().split(/\s+/).length : 0;
  const wpm = elapsedSeconds > 0 ? Math.round(wordsTyped / (elapsedSeconds / 60)) : 0;
  const finished = timeLeft === 0;

  let correctCharacters = 0;
  for (let index = 0; index < typed.length; index += 1) {
    if (typed[index] === passage[index]) correctCharacters += 1;
  }
  const accuracy = typed.length ? Math.round((correctCharacters / typed.length) * 100) : 100;

  return (
    <div className="container container-typinggame">
      <ProjectHeader
        title="Typing test"
        description={`Type the passage below. You have ${TIME_LIMIT} seconds — speed and accuracy update live.`}
        tags={['Timers', 'Refs']}
        source="https://github.com/kimkev/kimkev.github.io/blob/master/src/pages/games/TypingGame.jsx"
      />

      <div className="randomText" aria-hidden="true">
        {passage.split('').map((character, index) => {
          let stateClass = 'pending';
          if (index < typed.length) {
            stateClass = typed[index] === character ? 'correct' : 'incorrect';
          }

          return (
            <span
              key={`${index}-${character}`}
              className={`${stateClass}${index === typed.length ? ' current' : ''}`}
            >
              {character}
            </span>
          );
        })}
      </div>

      <label className="visually-hidden" htmlFor="typing-input">
        Type the passage here
      </label>
      <textarea
        id="typing-input"
        className="input"
        ref={inputRef}
        rows={2}
        value={typed}
        onChange={(event) => {
          if (!isRunning) return;
          setTyped(event.target.value.slice(0, passage.length));
        }}
        disabled={!isRunning}
        placeholder={isRunning ? '' : 'Press Start to begin'}
        autoComplete="off"
        spellCheck="false"
      />

      <div className="typing-stats" role="status">
        <span>Time: {timeLeft}s</span>
        <span>WPM: {wpm}</span>
        <span>Accuracy: {accuracy}%</span>
      </div>

      {finished && <p className="typing-result">Time is up. Start again for a new passage.</p>}

      <div className="buttons">
        <button type="button" className="start-button" onClick={startGame}>
          {finished ? 'Start again' : 'Start'}
        </button>
        <button type="button" className="reset-button" onClick={resetGame}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default TypingGame;
