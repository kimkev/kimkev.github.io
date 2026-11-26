import { useEffect, useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import resume from '../assets/Kevin_Kim_Resume.pdf';
import BackButton from './BackButton';
import './Navigation.css';

const NavigationBar = () => {
  const name = 'Kevin Kim';
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isMouseHovering, setIsMouseHovering] = useState(false);

  const location = useLocation();
  const isNotHomePage = location.pathname !== '/';
  const dropdownId = useId();

  const title = name.split('').map((char, index) => <span key={index}>{char}</span>);

  useEffect(() => {
    if (isMouseHovering) return undefined;

    const timeoutId = setTimeout(() => setDropdownVisible(false), 1000);
    return () => clearTimeout(timeoutId);
  }, [isMouseHovering]);

  useEffect(() => {
    setDropdownVisible(false);
    setIsMouseHovering(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setDropdownVisible(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <nav className={isNotHomePage ? 'navbar active' : 'navbar'}>
        <Link to="/">
          <div className="navbar-title">{title}</div>
        </Link>

        <div
          className="navbar-socials"
          onMouseEnter={() => {
            setDropdownVisible(true);
            setIsMouseHovering(true);
          }}
          onMouseLeave={() => setIsMouseHovering(false)}
        >
          <button
            type="button"
            className="navbar-socials-group"
            aria-expanded={dropdownVisible}
            aria-controls={dropdownId}
            onClick={() => setDropdownVisible((visible) => !visible)}
            onFocus={() => setDropdownVisible(true)}
          >
            Profile
          </button>

          {dropdownVisible && (
            <div id={dropdownId} className="navbar-socials-dropdown">
              <ul>
                <li>
                  <a href="https://github.com/kimkev" target="_blank" rel="noreferrer">
                    Github
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/kimkevi/" target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={resume} target="_blank" rel="noreferrer">
                    Resume
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      {isNotHomePage && <BackButton />}
    </>
  );
};

export default NavigationBar;
