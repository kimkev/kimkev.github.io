const MAX_DEPTH = 3;

const formatCell = (value, depth = 0) => {
  if (value === null || value === undefined) return '';
  if (value === '') return '';
  if (Array.isArray(value)) {
    if (depth >= MAX_DEPTH) return `${value.length} items`;
    return value.map((item) => formatCell(item, depth + 1)).join(', ');
  }
  if (typeof value === 'object') {
    if (depth >= MAX_DEPTH) return '…';
    return Object.entries(value)
      .map(([key, nested]) => `${key}: ${formatCell(nested, depth + 1)}`)
      .join(' · ');
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const DataTable = ({ rows, columns, caption, emptyMessage = 'No data yet.' }) => {
  if (!rows.length) {
    return <p className="table-empty">{emptyMessage}</p>;
  }

  return (
    <div className="table-scroll">
      <table>
        {caption && <caption className="visually-hidden">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>{formatCell(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
