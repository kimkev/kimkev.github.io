import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from './App';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('App routes', () => {
  let consoleError;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('renders the home page', async () => {
    renderAt('/');

    expect(await screen.findByRole('heading', { name: 'Kevin Kim' })).toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('renders the apps page', async () => {
    renderAt('/apps');

    expect(await screen.findByRole('heading', { name: /mini-games/i })).toBeInTheDocument();
  });

  it('renders the 404 page for unknown routes', async () => {
    renderAt('/does-not-exist');

    expect(await screen.findByRole('heading', { name: '404' })).toBeInTheDocument();
  });
});
