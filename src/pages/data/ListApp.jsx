import { useMemo, useRef, useState } from 'react';

import ProjectHeader from '../../components/ProjectHeader';
import { QUOTES } from '../../data/quotes';
import DataTable from './DataTable';
import './ListApp.css';

const SOURCES = [
  {
    id: 'holidays',
    label: 'Canadian Holidays',
    title: (year) => `${year} Canadian Holidays`,
    load: async (year) => {
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/ca`);
      if (!response.ok) throw new Error(`Holiday request failed (${response.status})`);
      return response.json();
    },
  },
  {
    id: 'trivia',
    label: 'Trivia',
    title: () => 'Random Trivia',
    load: async () => {
      const response = await fetch('https://opentdb.com/api.php?amount=10');
      if (!response.ok) throw new Error(`Trivia request failed (${response.status})`);
      const json = await response.json();
      return json.results ?? [];
    },
  },
  {
    id: 'quotes',
    label: 'Quotes',
    title: () => 'Programming Quotes',
    load: async () => QUOTES,
  },
  {
    id: 'users',
    label: 'Sample Users',
    title: () => 'Sample Users',
    load: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error(`Users request failed (${response.status})`);
      return response.json();
    },
  },
];

const compareValues = (first, second) => {
  if (first === second) return 0;

  const firstNumber = typeof first === 'number' ? first : Number(first);
  const secondNumber = typeof second === 'number' ? second : Number(second);

  const bothNumeric =
    first !== '' &&
    second !== '' &&
    Number.isFinite(firstNumber) &&
    Number.isFinite(secondNumber);

  if (bothNumeric) return firstNumber - secondNumber;

  return String(first ?? '').localeCompare(String(second ?? ''), undefined, { numeric: true });
};

const ListApp = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [title, setTitle] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortAscending, setSortAscending] = useState(true);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [activeSource, setActiveSource] = useState(null);
  const requestId = useRef(0);
  const currentYear = new Date().getFullYear();

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;

    const sorted = [...rows].sort((first, second) =>
      compareValues(first[sortKey], second[sortKey]),
    );

    return sortAscending ? sorted : sorted.reverse();
  }, [rows, sortKey, sortAscending]);

  const handleLoad = async (source) => {
    const request = requestId.current + 1;
    requestId.current = request;

    setActiveSource(source);
    setStatus('loading');
    setError('');
    setSortKey('');
    setSortAscending(true);

    try {
      const loaded = await source.load(currentYear);
      if (request !== requestId.current) return;

      const nextRows = Array.isArray(loaded) ? loaded : [];
      const nextColumns = nextRows.length
        ? [...new Set(nextRows.flatMap((row) => Object.keys(row)))]
        : [];

      setRows(nextRows);
      setColumns(nextColumns);
      setTitle(source.title(currentYear));

      if (!nextRows.length) setError('The source returned no rows.');
    } catch (loadError) {
      if (request !== requestId.current) return;

      setRows([]);
      setColumns([]);
      setError(loadError.message);
    } finally {
      if (request === requestId.current) setStatus('idle');
    }
  };

  return (
    <div className="container-lists">
      <ProjectHeader
        title="Lists"
        description="The same sortable table rendering four different sources: Canadian holidays, trivia, programming quotes, and sample users."
        tags={['Fetch', 'Sorting']}
        source="https://github.com/kimkev/kimkev.github.io/blob/master/src/pages/data/ListApp.jsx"
      />

      <section className="lists-controls" aria-labelledby="sources-heading">
        <h2 id="sources-heading">Sources</h2>
        <div className="list-buttons">
          {SOURCES.map((source) => (
            <button
              key={source.id}
              type="button"
              onClick={() => handleLoad(source)}
              disabled={status === 'loading'}
              aria-pressed={activeSource?.id === source.id}
            >
              {source.id === 'holidays' ? `${currentYear} ${source.label}` : source.label}
            </button>
          ))}
        </div>

        {status === 'loading' && (
          <p className="list-status" role="status">
            Loading…
          </p>
        )}

        {error && (
          <div className="list-status list-error" role="alert">
            <p>{error}</p>
            {activeSource && (
              <button type="button" onClick={() => handleLoad(activeSource)} disabled={status === 'loading'}>
                Try again
              </button>
            )}
          </div>
        )}
      </section>

      <section className="lists-results" aria-label="Results">
        <div className="container-sort">
          <h2>{title || 'Results'}</h2>
          <div className="sort-controls">
            <label htmlFor="sort-column">Sort by</label>
            <select
              id="sort-column"
              className="custom-select"
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value)}
              disabled={!columns.length}
            >
              <option value="">--</option>
              {columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="sort-direction"
              onClick={() => setSortAscending((current) => !current)}
              disabled={!sortKey}
              aria-label={`Sort ${sortAscending ? 'descending' : 'ascending'}`}
            >
              {sortAscending ? 'Asc ↑' : 'Desc ↓'}
            </button>
          </div>
        </div>

        {rows.length > 0 && (
          <p className="list-count">
            {rows.length} {rows.length === 1 ? 'row' : 'rows'}
          </p>
        )}

        <DataTable
          rows={sortedRows}
          columns={columns}
          caption={title}
          emptyMessage={title ? 'No rows returned.' : 'Pick a source above to load data.'}
        />
      </section>
    </div>
  );
};

export default ListApp;
