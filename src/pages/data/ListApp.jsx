import { useMemo, useState } from 'react';

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
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const currentYear = new Date().getFullYear();

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((first, second) => compareValues(first[sortKey], second[sortKey]));
  }, [rows, sortKey]);

  const handleLoad = async (source) => {
    setStatus('loading');
    setError('');
    setSortKey('');

    try {
      const loaded = await source.load(currentYear);
      const nextRows = Array.isArray(loaded) ? loaded : [];

      setRows(nextRows);
      setColumns(nextRows.length ? Object.keys(nextRows[0]) : []);
      setTitle(source.title(currentYear));

      if (!nextRows.length) setError('The source returned no rows.');
    } catch (loadError) {
      setRows([]);
      setColumns([]);
      setError(loadError.message);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="container-lists">
      <div>
        <h3>Lists</h3>
        <div className="list-buttons">
          {SOURCES.map((source) => (
            <button
              key={source.id}
              type="button"
              onClick={() => handleLoad(source)}
              disabled={status === 'loading'}
            >
              {source.id === 'holidays' ? `${currentYear} ${source.label}` : source.label}
            </button>
          ))}
        </div>
        {status === 'loading' && <p className="list-status">Loading…</p>}
        {error && (
          <p className="list-status list-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div>
        <div className="container-sort">
          <h2>{title}</h2>
          <div>
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
          </div>
        </div>

        <DataTable rows={sortedRows} columns={columns} />
      </div>
    </div>
  );
};

export default ListApp;
