import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4';
import { createBrowserHistory } from 'history';
import { HashRouter } from 'react-router-dom';
import { initGA, trackPageview } from './components/Analytics';

const measurementId = 'G-52N2K9V12M';
initGA(measurementId);

const browserHistory = createBrowserHistory();
browserHistory.listen(location => {
  if (measurementId) {
    ReactGA.send({ hitType: "pageview", page: location.location.pathname });
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter
      onUpdate={() => {
        trackPageview();
      }}
    >
      <App />
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
