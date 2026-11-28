import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { adminEmail, auth, db, googleProvider, isFirebaseConfigured } from '../services/firebase';
import './Admin.css';

const formatTimestamp = (value) => {
  if (!value) return 'never';
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 'unknown' : date.toLocaleString();
};

const Admin = () => {
  const [authState, setAuthState] = useState('loading');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    try {
      const snapshot = await getDoc(doc(db, 'stats', 'latest'));
      setStats(snapshot.exists() ? snapshot.data() : null);
      setAuthState('ready');
    } catch (loadError) {
      setError(loadError.message);
      setAuthState('error');
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthState('unconfigured');
      return undefined;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setAuthState('signedOut');
        return;
      }

      if (nextUser.email !== adminEmail) {
        setAuthState('unauthorized');
        return;
      }

      loadStats();
    });
  }, [loadStats]);

  const handleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (signInError) {
      setError(signInError.message);
    }
  };

  if (authState === 'loading') {
    return <p className="admin-message">Loading…</p>;
  }

  if (authState === 'unconfigured') {
    return (
      <div className="admin-message">
        <h1>Admin is not configured</h1>
        <p>
          Add the <code>VITE_FIREBASE_*</code> values to <code>.env</code> and restart the dev
          server.
        </p>
      </div>
    );
  }

  if (authState === 'signedOut') {
    return (
      <div className="admin-message">
        <h1>Admin</h1>
        <p>Sign in with the allowlisted Google account.</p>
        <button type="button" onClick={handleSignIn}>
          Sign in with Google
        </button>
        {error && <p className="admin-error">{error}</p>}
      </div>
    );
  }

  if (authState === 'unauthorized') {
    return (
      <div className="admin-message">
        <h1>Not authorized</h1>
        <p>
          Signed in as {user?.email}, which is not the admin account.
        </p>
        <button type="button" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </div>
    );
  }

  if (authState === 'error') {
    return (
      <div className="admin-message">
        <h1>Could not load analytics</h1>
        <p className="admin-error">{error}</p>
        <button type="button" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </div>
    );
  }

  const totals = stats?.totals ?? {};

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>Analytics</h1>
        <button type="button" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </div>

      {!stats ? (
        <p className="admin-message">
          No snapshot yet. The sync workflow writes one daily; run it manually from the Actions tab
          to populate this page.
        </p>
      ) : (
        <>
          <p className="admin-muted">Last updated: {formatTimestamp(stats.updatedAt)}</p>

          <dl className="admin-metrics">
            <div>
              <dt>Users</dt>
              <dd>{totals.users ?? 0}</dd>
            </div>
            <div>
              <dt>Sessions</dt>
              <dd>{totals.sessions ?? 0}</dd>
            </div>
            <div>
              <dt>Page views</dt>
              <dd>{totals.pageviews ?? 0}</dd>
            </div>
          </dl>

          <h3>Top pages</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Page</th>
                <th scope="col">Views</th>
              </tr>
            </thead>
            <tbody>
              {(stats.topPages ?? []).map((page) => (
                <tr key={page.path}>
                  <td>{page.path}</td>
                  <td>{page.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <p className="admin-muted">Signed in as {user?.email}</p>
    </div>
  );
};

export default Admin;
