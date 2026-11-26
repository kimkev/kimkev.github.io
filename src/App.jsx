import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Apps from './pages/Apps';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import { trackPageview } from './services/analytics';
import './App.css';
const TicTacToe = lazy(() => import('./pages/games/TicTacToe'));
const TypingGame = lazy(() => import('./pages/games/TypingGame'));
const AnagramGame = lazy(() => import('./pages/games/AnagramGame'));
const CardGame = lazy(() => import('./pages/games/CardGame'));
const ListApp = lazy(() => import('./pages/data/ListApp'));
const Chart = lazy(() => import('./pages/data/Chart'));
const Admin = lazy(() => import('./pages/Admin'));

const titles = {
  '/': 'Kevin Kim — Web Developer',
  '/apps': 'Apps — Kevin Kim',
  '/games/tic-tac-toe': 'Tic-Tac-Toe — Kevin Kim',
  '/games/typing': 'Typing Test — Kevin Kim',
  '/games/anagram': 'Anagram — Kevin Kim',
  '/games/mulligan': 'Mulligan — Kevin Kim',
  '/data/lists': 'Lists — Kevin Kim',
  '/data/chart': 'Housing Chart — Kevin Kim',
  '/admin': 'Admin — Kevin Kim',
};

const Loading = () => <p className="page-loading">Loading…</p>;

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    trackPageview(location.pathname + location.search);
    document.title = titles[location.pathname] ?? 'Kevin Kim';
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <div className="main-container">
      <div className="content">
        <Navigation />
        <main>
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
        </main>
      </div>
      <Footer isHomePage={isHomePage} />
    </div>
  );
};

export default App;
