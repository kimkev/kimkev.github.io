import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Route error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-error" role="alert">
          <h1>Something went wrong</h1>
          <p>This page failed to load. Reload the page to try again.</p>
          <div className="page-error-actions">
            <button type="button" onClick={() => window.location.reload()}>
              Reload
            </button>
            <Link to="/">Back to home</Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
