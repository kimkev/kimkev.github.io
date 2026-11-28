import { lazy, Suspense, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
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

const pageTitleFor = (pathname) => titles[pathname] ?? 'Page not found — Kevin Kim';

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
    trackPageview(location.pathname + location.search);
    document.title = pageTitleFor(location.pathname);
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
