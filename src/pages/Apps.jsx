import { Link } from 'react-router-dom';

import './Apps.css';

const Apps = () => (
  <div className="apps-container">
    <h1>Apps</h1>
    <div className="col">
      <h2>Mini-Games</h2>
      <ul className="home-list col-A">
        <li>
          <Link to="/games/tic-tac-toe">Tic-Tac-Toe</Link>
        </li>
        <li>
          <Link to="/games/anagram">Anagram</Link>
        </li>
        <li>
          <Link to="/games/typing">Typing</Link>
        </li>
        <li>
          <Link to="/games/mulligan">Mulligan</Link>
        </li>
      </ul>
    </div>
    <div className="col">
      <h2>Data</h2>
      <ul className="home-list col-B">
        <li>
          <Link to="/data/lists">Lists</Link>
        </li>
        <li>
          <Link to="/data/chart">Chart</Link>
        </li>
      </ul>
    </div>
  </div>
);

export default Apps;
