import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import resume from '../assets/Kevin_Kim_Resume.pdf';
import BackButton from './BackButton';
import './Navigation.css';

const PROFILE_LINKS = [
  { href: 'https://github.com/kimkev', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/kimkevi/', label: 'LinkedIn' },
  { href: resume, label: 'Resume' },
];

const EMAIL = 'k6ky08@gmail.com';

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuId = useId();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const showBackToApps = !isHomePage && location.pathname !== '/apps';

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={isHomePage ? 'navbar' : 'navbar active'}
        aria-label="Main"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
        }}
      >
        <Link to="/" className="navbar-title">
          Kevin Kim
        </Link>

        <div className="navbar-links">
          {PROFILE_LINKS.map((link) => (
            <a
              key={link.label}
              className="navbar-link"
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
          <a className="navbar-link navbar-email" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </div>

        <div className="navbar-menu" ref={menuRef}>
          <button
            type="button"
            className="navbar-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Links
          </button>

          {menuOpen && (
            <div id={menuId} className="navbar-socials-dropdown">
              <ul>
                {PROFILE_LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      {showBackToApps && <BackButton />}
    </>
  );
};

export default NavigationBar;
