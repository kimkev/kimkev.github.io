import { Link } from 'react-router-dom';

import './Apps.css';

const APP_GROUPS = [
  {
    id: 'games',
    title: 'Mini-games',
    items: [
      {
        to: '/games/tic-tac-toe',
        title: 'Tic-Tac-Toe',
        blurb: 'Two players, one board, with the winning line highlighted when someone wins.',
        tags: 'React state · Two-player',
      },
      {
        to: '/games/anagram',
        title: 'Anagram',
        blurb: 'Unscramble words of four, six, or eight letters, with hints and a difficulty switch.',
        tags: 'Hooks · Unit-tested logic',
      },
      {
        to: '/games/typing',
        title: 'Typing test',
        blurb: 'A 30-second passage with live words-per-minute and character accuracy.',
        tags: 'Timers · Refs',
      },
      {
        to: '/games/mulligan',
        title: 'Mulligan',
        blurb: 'Five-card poker against the computer, with one mulligan to replace bad cards.',
        tags: 'REST API · Async',
      },
    ],
  },
  {
    id: 'data',
    title: 'Data experiments',
    items: [
      {
        to: '/data/lists',
        title: 'Lists',
        blurb: 'One sortable table rendering holidays, trivia, quotes, and sample users from live APIs.',
        tags: 'Fetch · Sorting',
      },
      {
        to: '/data/chart',
        title: 'Housing chart',
        blurb: "Canada's new housing price index since 2000, with an accessible data table.",
        tags: 'Chart.js · Statistics Canada',
      },
    ],
  },
];

const Apps = () => (
  <div className="apps-container">
    <header className="apps-header">
      <h1>Apps</h1>
      <p>
        Six small browser demos, each built to practise a different part of front-end work: state,
        timing, async data, and charts.
      </p>
    </header>

    {APP_GROUPS.map((group) => (
      <section key={group.id} className="apps-group" aria-labelledby={`${group.id}-heading`}>
        <h2 id={`${group.id}-heading`}>{group.title}</h2>
        <ul className="app-grid">
          {group.items.map((item) => (
            <li key={item.to}>
              <Link className="app-card" to={item.to}>
                <h3>{item.title}</h3>
                <p>{item.blurb}</p>
                <span className="app-tags">{item.tags}</span>
                <span className="app-card-link">
                  Open <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
);

export default Apps;
