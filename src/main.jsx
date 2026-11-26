import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { initAnalytics } from './services/analytics';
import './index.css';

initAnalytics();

// A cached HTML shell can reference hashed chunks that a newer deploy removed.
// Reload once to pick up the current shell instead of showing a blank route.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();

  const lastReload = Number(sessionStorage.getItem('chunk-reload-at') ?? 0);
  if (Date.now() - lastReload < 10_000) return;

  sessionStorage.setItem('chunk-reload-at', String(Date.now()));
  window.location.reload();
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
