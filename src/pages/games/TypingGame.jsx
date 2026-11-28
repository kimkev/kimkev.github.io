import { useEffect, useRef, useState } from 'react';

import ProjectHeader from '../../components/ProjectHeader';
import { PASSAGES } from '../../data/passages';
import './TypingGame.css';

const DURATIONS = [15, 30, 60];

const pickPassage = () => PASSAGES[Math.floor(Math.random() * PASSAGES.length)];

const TypingGame = () => {
  const [duration, setDuration] = useState(30);
  const [passage, setPassage] = useState(pickPassage);
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(duration);
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

  useEffect(() => {
    if (isRunning) inputRef.current?.focus();
  }, [isRunning]);

  const startGame = () => {
    setPassage(pickPassage());
    setTyped('');
    setTimeLeft(duration);
    setIsRunning(true);
  };

  const resetGame = () => {
    setTyped('');
    setTimeLeft(duration);
    setIsRunning(false);
  };

  const changeDuration = (nextDuration) => {
    setDuration(nextDuration);
    setTyped('');
    setTimeLeft(nextDuration);
    setIsRunning(false);
  };

  const elapsedSeconds = duration - timeLeft;
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
        description={`Type the passage below. You have ${duration} seconds — speed and accuracy update live.`}
        tags={['Timers', 'Refs']}
        source="https://github.com/kimkev/kimkev.github.io/blob/master/src/pages/games/TypingGame.jsx"
      />

      <div className="typing-durations" role="group" aria-label="Test length">
        {DURATIONS.map((seconds) => (
          <button
            key={seconds}
            type="button"
            aria-pressed={duration === seconds}
            onClick={() => changeDuration(seconds)}
            disabled={isRunning}
          >
            {seconds}s
          </button>
        ))}
      </div>

      <p id="typing-passage" className="visually-hidden">
        {passage}
      </p>

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
        aria-describedby="typing-passage"
        autoComplete="off"
        spellCheck="false"
      />

      {finished ? (
        <div className="typing-result-card" role="status">
          <h2>Time&apos;s up</h2>
          <p className="typing-result-score">
            {wpm} WPM · {accuracy}% accuracy
          </p>
          <p className="typing-result-detail">
            You typed {wordsTyped} {wordsTyped === 1 ? 'word' : 'words'} in {duration} seconds.
          </p>
        </div>
      ) : (
        <div className="typing-stats">
          <span>Time: {timeLeft}s</span>
          <span>WPM: {wpm}</span>
          <span>Accuracy: {accuracy}%</span>
        </div>
      )}

      <div className="buttons">
        <button type="button" onClick={startGame} disabled={isRunning}>
          {finished ? 'Start again' : 'Start'}
        </button>
        <button type="button" className="button-quiet" onClick={resetGame}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default TypingGame;
