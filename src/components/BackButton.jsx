import { Link } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => (
  <div className="button-container">
    <Link className="back-button" to="/apps">
      <span aria-hidden="true">←</span> All apps
    </Link>
  </div>
);

export default BackButton;
