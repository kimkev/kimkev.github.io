import { Link } from 'react-router-dom';

import resume from '../assets/Kevin_Kim_Resume.pdf';
import './Home.css';

const Home = () => (
  <div className="home-container">
    <section className="hero">
      <p className="hero-eyebrow">Web developer · Ontario, Canada</p>
      <h1>Kevin Kim</h1>
      <p className="hero-lead">
        I build fast, accessible interfaces for the web. This site collects the small apps and games
        I&apos;ve built to practice state, timing, and data handling.
      </p>
      <div className="hero-actions">
        <Link className="button-primary" to="/apps">
          See my work
        </Link>
        <a className="button-secondary" href={resume} target="_blank" rel="noreferrer">
          Resume (PDF)
        </a>
        <a className="hero-email" href="mailto:k6yk07@gmail.com">
          k6yk07@gmail.com
        </a>
      </div>
    </section>

    <section className="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading">Selected work</h2>
      <ul className="project-grid">
        <li className="project-card">
          <h3>
            <Link to="/apps">Client-side web apps</Link>
          </h3>
          <p>
            Four mini-games and two data experiments built with React and Chart.js. No backend, no
            accounts, everything runs in the browser.
          </p>
          <p className="project-tags">React · Vite · Chart.js</p>
          <Link className="project-link" to="/apps">
            Browse six demos <span aria-hidden="true">→</span>
          </Link>
        </li>

        <li className="project-card">
          <h3>
            <a
              href="https://play.google.com/store/apps/details?id=com.kimkev.dailydew"
              target="_blank"
              rel="noreferrer"
            >
              DailyDew
            </a>
          </h3>
          <p>
            A calm plant-watering reminder for Android. Custom schedules, grouped notifications, and
            an offline garden that grows as you keep your plants alive.
          </p>
          <p className="project-tags">Android · Offline-first · 10 languages</p>
          <a
            className="project-link"
            href="https://play.google.com/store/apps/details?id=com.kimkev.dailydew"
            target="_blank"
            rel="noreferrer"
          >
            View on Google Play <span aria-hidden="true">→</span>
          </a>
        </li>

        <li className="project-card">
          <h3>
            <a href="https://kimkev.itch.io/" target="_blank" rel="noreferrer">
              Unity game projects
            </a>
          </h3>
          <p>
            Four browser-playable 3D games from a game programming course, including a 3D platformer
            and a racing capstone.
          </p>
          <p className="project-tags">Unity · C# · WebGL</p>
          <a className="project-link" href="https://kimkev.itch.io/" target="_blank" rel="noreferrer">
            Play on itch.io <span aria-hidden="true">→</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
);

export default Home;
