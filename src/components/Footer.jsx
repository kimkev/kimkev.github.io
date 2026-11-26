import { Link } from 'react-router-dom';

import './Footer.css';

const Footer = () => (
  <footer>
    <span>Copyright © {new Date().getFullYear()} Kevin Kim</span>
    <div>
      <Link className="Admin" to="/admin">
        admin
      </Link>
    </div>
  </footer>
);

export default Footer;
