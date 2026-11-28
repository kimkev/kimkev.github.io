import { useState } from 'react';

import { createBoard, getWinner, isDraw, otherPlayer } from '../../lib/ticTacToe';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(createBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const result = getWinner(board);
  const draw = !result && isDraw(board);
  const gameOver = Boolean(result) || draw;

  const handleClick = (index) => {
    if (gameOver || board[index]) return;

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);
    setCurrentPlayer(otherPlayer(currentPlayer));
  };

  const resetBoard = () => {
    setBoard(createBoard());
    setCurrentPlayer(Math.random() < 0.5 ? 'X' : 'O');
  };

  let status = `Next player: ${currentPlayer}`;
  if (result) status = `Winner: ${result.winner}`;
  else if (draw) status = "It's a tie!";

  return (
    <div className="container container-tictactoe">
      <h1>Tic-Tac-Toe</h1>
      <div className="status" role="status">
        {status}
      </div>

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

      <button type="button" onClick={resetBoard}>
        Reset
      </button>
    </div>
  );
};

export default TicTacToe;
