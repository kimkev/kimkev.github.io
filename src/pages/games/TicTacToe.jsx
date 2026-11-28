import { useState } from 'react';

import ProjectHeader from '../../components/ProjectHeader';
import { createBoard, getWinner, isDraw, otherPlayer } from '../../lib/ticTacToe';
import './TicTacToe.css';

const EMPTY_SCORES = { X: 0, O: 0, draws: 0 };

const TicTacToe = () => {
  const [board, setBoard] = useState(createBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [scores, setScores] = useState(EMPTY_SCORES);

  const result = getWinner(board);
  const draw = !result && isDraw(board);
  const gameOver = Boolean(result) || draw;

  const handleClick = (index) => {
    if (gameOver || board[index]) return;

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    const nextResult = getWinner(nextBoard);
    const nextDraw = !nextResult && isDraw(nextBoard);

    setBoard(nextBoard);

    if (nextResult) {
      setScores((current) => ({ ...current, [nextResult.winner]: current[nextResult.winner] + 1 }));
    } else if (nextDraw) {
      setScores((current) => ({ ...current, draws: current.draws + 1 }));
    }

    setCurrentPlayer(otherPlayer(currentPlayer));
  };

  const resetBoard = () => {
    setBoard(createBoard());
    setCurrentPlayer('X');
  };

  const resetScores = () => {
    setScores(EMPTY_SCORES);
    resetBoard();
  };

  let status = `Next player: ${currentPlayer}`;
  if (result) status = `Winner: ${result.winner}`;
  else if (draw) status = "It's a tie!";

  return (
    <div className="container container-tictactoe">
      <ProjectHeader
        title="Tic-Tac-Toe"
        description="Two players share the keyboard. Take turns until someone lines up three in a row."
        tags={['React state', 'Two-player']}
        source="https://github.com/kimkev/kimkev.github.io/blob/master/src/pages/games/TicTacToe.jsx"
      />

      <dl className="scoreboard" aria-label="Score">
        <div>
          <dt>X</dt>
          <dd>{scores.X}</dd>
        </div>
        <div>
          <dt>O</dt>
          <dd>{scores.O}</dd>
        </div>
        <div>
          <dt>Draws</dt>
          <dd>{scores.draws}</dd>
        </div>
      </dl>

      <p className="status" role="status">
        {status}
      </p>

      <div className="board">
        {board.map((square, index) => {
          const isWinningSquare = Boolean(result?.line.includes(index));

          return (
            <button
              key={index}
              type="button"
              className={isWinningSquare ? 'square winning' : 'square'}
              onClick={() => handleClick(index)}
              disabled={Boolean(square) || gameOver}
              aria-label={`Square ${index + 1}: ${square ?? 'empty'}`}
            >
              {square}
            </button>
          );
        })}
      </div>

      <div className="board-actions">
        <button type="button" onClick={resetBoard}>
          New game
        </button>
        <button type="button" className="button-quiet" onClick={resetScores}>
          Reset scores
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
