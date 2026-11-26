import { Link } from 'react-router-dom';

const NoPage = () => (
  <div className="container">
    <h1>404</h1>
    <p>That page does not exist.</p>
    <p>
      <Link to="/">Back to the home page</Link>
    </p>
  </div>
);

export default NoPage;
