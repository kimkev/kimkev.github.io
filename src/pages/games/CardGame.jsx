import { useCallback, useEffect, useState } from 'react';

import ProjectHeader from '../../components/ProjectHeader';
import { compareHands, describeHand, evaluateHand } from '../../lib/pokerHand';
import './CardGame.css';

const API = 'https://deckofcardsapi.com/api/deck';
const HAND_SIZE = 5;
const REQUEST_TIMEOUT_MS = 10000;

const requestJson = async (url) => {
  const signal =
    typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      : undefined;
  const response = await fetch(url, { signal });

  if (!response.ok) throw new Error(`Card service responded with ${response.status}.`);

  return response.json();
};

const drawCards = async (deckId, count) => {
  if (count === 0) return { cards: [], remaining: null };

  return requestJson(`${API}/${deckId}/draw/?count=${count}`);
};

const randomIndices = (length, count) => {
  const indices = Array.from({ length }, (_, index) => index);

  for (let index = indices.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [indices[index], indices[swap]] = [indices[swap], indices[index]];
  }

  return indices.slice(0, count);
};

const CardGame = () => {
  const [deckId, setDeckId] = useState('');
  const [remaining, setRemaining] = useState(52);
  const [userCards, setUserCards] = useState([]);
  const [computerCards, setComputerCards] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const [status, setStatus] = useState('Shuffling a new deck…');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMulliganed, setHasMulliganed] = useState(false);

  const startGame = useCallback(async () => {
    setLoading(true);
    setError('');
    setHasMulliganed(false);
    setSelected(new Set());
    setDeckId('');
    setStatus('Shuffling a new deck…');

    try {
      const deck = await requestJson(`${API}/new/shuffle/?deck_count=1`);

      const [userDraw, computerDraw] = await Promise.all([
        drawCards(deck.deck_id, HAND_SIZE),
        drawCards(deck.deck_id, HAND_SIZE),
      ]);

      setDeckId(deck.deck_id);
      setUserCards(userDraw.cards);
      setComputerCards(computerDraw.cards);
      setRemaining(computerDraw.remaining ?? deck.remaining - HAND_SIZE * 2);
      setStatus('Select any cards, then mulligan once to replace them.');
    } catch (startError) {
      setError(startError.message);
      setStatus('Could not start the game.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const toggleCard = (index) => {
    if (hasMulliganed || loading) return;

    setSelected((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const mulligan = async () => {
    if (loading || hasMulliganed || !deckId) return;

    setLoading(true);
    setError('');

    try {
      const replaceCount = Math.min(selected.size, userCards.length);
      const computerReplacements = Math.min(replaceCount, computerCards.length);

      const [userDraw, computerDraw] = await Promise.all([
        drawCards(deckId, replaceCount),
        drawCards(deckId, computerReplacements),
      ]);

      const nextUserCards = [...userCards.filter((_, index) => !selected.has(index)), ...userDraw.cards];

      const discarded = new Set(randomIndices(computerCards.length, computerReplacements));
      const nextComputerCards = [
        ...computerCards.filter((_, index) => !discarded.has(index)),
        ...computerDraw.cards,
      ];

      const userHand = evaluateHand(nextUserCards);
      const computerHand = evaluateHand(nextComputerCards);
      const verdict = compareHands(userHand, computerHand);

      setUserCards(nextUserCards);
      setComputerCards(nextComputerCards);
      setSelected(new Set());
      setHasMulliganed(true);
      setRemaining((current) => Math.max(0, current - replaceCount - computerReplacements));

      if (verdict > 0) setStatus(`You win with ${describeHand(nextUserCards)}.`);
      else if (verdict < 0) setStatus(`Computer wins with ${describeHand(nextComputerCards)}.`);
      else setStatus(`Tie: both have ${describeHand(nextUserCards)}.`);
    } catch (mulliganError) {
      setError(mulliganError.message);
    } finally {
      setLoading(false);
    }
  };

  const yourHand = userCards.length === HAND_SIZE ? describeHand(userCards) : '';
  const computerHand =
    hasMulliganed && computerCards.length === HAND_SIZE ? describeHand(computerCards) : '';

  return (
    <div className="container container-cardgame">
      <ProjectHeader
        title="Mulligan"
        description="Five-card poker against the computer. Select any cards, then mulligan once to replace them and compare hands."
        tags={['REST API', 'Async']}
        source="https://github.com/kimkev/kimkev.github.io/blob/master/src/pages/games/CardGame.jsx"
      />

      <p className="instructions-message" role="status">
        {status}
      </p>

      {error && (
        <div className="card-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={startGame} disabled={loading}>
            Try again
          </button>
        </div>
      )}

      <details className="card-rules">
        <summary>How to play</summary>
        <ul>
          <li>Each side is dealt five cards from a shuffled deck.</li>
          <li>Select any of your cards and press Mulligan once to replace them.</li>
          <li>The stronger poker hand wins; equal hands are a draw.</li>
        </ul>
      </details>

      <div className="card-game-container">
        <div className="left-section">
          <h2>Deck</h2>
          <button
            type="button"
            className="deck"
            onClick={startGame}
            disabled={loading}
            aria-label="Shuffle a new deck and deal again"
          >
            {remaining}
          </button>
          <p className="deck-label">cards left</p>
        </div>

        <div className="hand-container">
          <div className="player-container">
            <h2>Computer&apos;s Cards</h2>
            <div className="card-container">
              {computerCards.map((card, index) => (
                <div
                  className={hasMulliganed ? 'card computer-card' : 'card computer-card face-down'}
                  key={`${card.code}-${index}`}
                  role="img"
                  aria-label={
                    hasMulliganed ? `${card.value} of ${card.suit}` : 'Face-down card'
                  }
                >
                  {hasMulliganed ? <img src={card.image} alt="" /> : <span aria-hidden="true">?</span>}
                </div>
              ))}
            </div>
            {computerHand && <p className="hand-name">{computerHand}</p>}
          </div>

          <div className="player-container">
            <h2>Your Cards</h2>
            <div className="card-container">
              {userCards.map((card, index) => (
                <button
                  type="button"
                  className={`card user-card ${selected.has(index) ? 'selected' : ''}`}
                  key={`${card.code}-${index}`}
                  onClick={() => toggleCard(index)}
                  aria-pressed={selected.has(index)}
                  aria-label={`${card.value} of ${card.suit}`}
                  disabled={hasMulliganed || loading}
                >
                  <img src={card.image} alt="" />
                </button>
              ))}
            </div>
            {yourHand && <p className="hand-name">{yourHand}</p>}
          </div>

          <div className="card-actions">
            <button
              type="button"
              className="mulligan-button"
              onClick={mulligan}
              disabled={loading || hasMulliganed}
            >
              Mulligan {selected.size > 0 ? `(${selected.size})` : ''}
            </button>
            {hasMulliganed && (
              <button type="button" className="button-quiet" onClick={startGame} disabled={loading}>
                Play again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGame;
