import { Link } from 'react-router-dom';

import './Home.css';

const Home = () => (
  <div className="home-container">
    <div className="profile">
      <div className="Intro">
        <h1>Welcome</h1>
        <p>My name is Kevin Kim, a web developer based in Ontario, Canada.</p>
      </div>

      <div className="Projects">
        <h1>Projects</h1>
        <ul>
          <li>
            <Link to="/apps">Client-side Web Apps</Link>
          </li>
          <li>
            <a
              href="https://play.google.com/store/apps/details?id=com.kimkev.dailydew"
              target="_blank"
              rel="noreferrer"
            >
              DailyDew - Android App
            </a>
          </li>
          <li>
            <a href="https://kimkev.itch.io/" target="_blank" rel="noreferrer">
              Game Development in Unity
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default Home;
