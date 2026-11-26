import { useCallback, useEffect, useState } from 'react';

import { compareHands, describeHand, evaluateHand } from '../../lib/pokerHand';
import './CardGame.css';

const API = 'https://deckofcardsapi.com/api/deck';
const HAND_SIZE = 5;

const drawCards = async (deckId, count) => {
  if (count === 0) return { cards: [], remaining: null };

  const response = await fetch(`${API}/${deckId}/draw/?count=${count}`);
  if (!response.ok) throw new Error(`Card draw failed (${response.status})`);

  return response.json();
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
    setStatus('Shuffling a new deck…');

    try {
      const deckResponse = await fetch(`${API}/new/shuffle/?deck_count=1`);
      if (!deckResponse.ok) throw new Error(`Deck request failed (${deckResponse.status})`);
      const deck = await deckResponse.json();

      const [userDraw, computerDraw] = await Promise.all([
        drawCards(deck.deck_id, HAND_SIZE),
        drawCards(deck.deck_id, HAND_SIZE),
      ]);

      setDeckId(deck.deck_id);
      setUserCards(userDraw.cards);
      setComputerCards(computerDraw.cards);
      setRemaining(computerDraw.remaining ?? deck.remaining - HAND_SIZE * 2);
      setStatus('Tap cards to select them, then mulligan once to replace them.');
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
    if (loading || hasMulliganed) return;

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
  const computerHand = computerCards.length === HAND_SIZE ? describeHand(computerCards) : '';

  return (
    <div className="container container-cardgame">
      <h1>Mulligan</h1>

      <div className="instructions-container">
        <p className="instructions-message">{status}</p>
        {error && <p className="card-error">{error}</p>}
      </div>

      <div className="card-game-container">
        <div className="left-section">
          <h2>Deck</h2>
          <button
            type="button"
            className="deck"
            onClick={startGame}
            aria-label="Shuffle a new deck and deal again"
          >
            {remaining}
          </button>
        </div>

        <div className="hand-container">
          <div className="player-container">
            <h2>Computer&apos;s Cards</h2>
            <div className="card-container">
              {computerCards.map((card, index) => (
                <div className="card computer-card" key={`${card.code}-${index}`}>
                  <img src={card.image} alt={`${card.value} of ${card.suit}`} />
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

          <button type="button" className="mulligan-button" onClick={mulligan} disabled={loading}>
            Mulligan {selected.size > 0 ? `(${selected.size})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardGame;
