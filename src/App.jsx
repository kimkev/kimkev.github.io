import { lazy, Suspense, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Apps from './pages/Apps';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import { trackPageview } from './services/analytics';
import { applyPageMeta } from './services/seo';
import './App.css';
const TicTacToe = lazy(() => import('./pages/games/TicTacToe'));
const TypingGame = lazy(() => import('./pages/games/TypingGame'));
const AnagramGame = lazy(() => import('./pages/games/AnagramGame'));
const CardGame = lazy(() => import('./pages/games/CardGame'));
const ListApp = lazy(() => import('./pages/data/ListApp'));
const Chart = lazy(() => import('./pages/data/Chart'));
const Admin = lazy(() => import('./pages/Admin'));

const pages = {
  '/': {
    title: 'Kevin Kim — Web Developer',
    description:
      'Kevin Kim is a web developer in Ontario, Canada. Client-side web apps, mini-games, and data experiments.',
  },
  '/apps': {
    title: 'Apps — Kevin Kim',
    description:
      'Browser mini-games and data experiments built by Kevin Kim with React, React Router, and Chart.js.',
  },
  '/games/tic-tac-toe': {
    title: 'Tic-Tac-Toe — Kevin Kim',
    description:
      'A two-player tic-tac-toe game with a winning-line highlight, built with React state.',
  },
  '/games/typing': {
    title: 'Typing Test — Kevin Kim',
    description:
      'A 30-second typing test with live words-per-minute and accuracy tracking, built with React timers.',
  },
  '/games/anagram': {
    title: 'Anagram — Kevin Kim',
    description:
      'Unscramble four, six, or eight letter words with progressive hints and three difficulty levels.',
  },
  '/games/mulligan': {
    title: 'Mulligan — Kevin Kim',
    description:
      'Five-card poker against the computer. Select cards, take one mulligan, and compare hands.',
  },
  '/data/lists': {
    title: 'Lists — Kevin Kim',
    description:
      'One sortable table rendering Canadian holidays, trivia, programming quotes, and sample users.',
  },
  '/data/chart': {
    title: 'Housing Chart — Kevin Kim',
    description:
      "Canada's new housing price index from 2000 to today, charted from Statistics Canada data.",
  },
  '/admin': {
    title: 'Admin — Kevin Kim',
    description: 'Private analytics dashboard.',
    noindex: true,
  },
};

const notFoundPage = {
  title: 'Page not found — Kevin Kim',
  description: 'The page you requested does not exist.',
  noindex: true,
};

const Loading = () => (
  <p className="page-loading" role="status">
    Loading…
  </p>
);

const App = () => {
  const location = useLocation();
  const mainRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const page = pages[location.pathname] ?? notFoundPage;

    trackPageview(location.pathname + location.search);
    applyPageMeta(location.pathname, page);
    window.scrollTo(0, 0);

    // Move focus to the routed content so keyboard and screen reader users
    // start at the new page instead of staying on the clicked link.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    mainRef.current?.focus();
  }, [location.pathname, location.search]);

  return (
    <div className="main-container">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="content">
        <Navigation />
        <main id="main-content" ref={mainRef} tabIndex={-1}>
          <ErrorBoundary key={location.pathname}>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route index element={<Home />} />
                <Route path="apps" element={<Apps />} />
                <Route path="games/tic-tac-toe" element={<TicTacToe />} />
                <Route path="games/typing" element={<TypingGame />} />
                <Route path="games/anagram" element={<AnagramGame />} />
                <Route path="games/mulligan" element={<CardGame />} />
                <Route path="data/lists" element={<ListApp />} />
                <Route path="data/chart" element={<Chart />} />
                <Route path="admin" element={<Admin />} />
                <Route path="*" element={<NoPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
