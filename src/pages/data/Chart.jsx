import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

import ProjectHeader from '../../components/ProjectHeader';
import data from '../../data/housing-index.json';
import './Chart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const formatMonth = (value) => {
  const [year, month] = value.split('-');
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
};

const formatDate = (value) => {
  const [year, month, day] = value.split('-');
  return `${MONTH_NAMES[Number(month) - 1]} ${Number(day)}, ${year}`;
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { maxTicksLimit: 8 } },
    y: { title: { display: true, text: 'Index (Dec 2016 = 100)' } },
  },
};

const HousingChart = () => {
  const chartData = useMemo(
    () => ({
      labels: data.series.map((point) => point.date),
      datasets: [
        {
          label: 'New housing price index',
          data: data.series.map((point) => point.value),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          pointRadius: 0,
          pointHitRadius: 12,
          tension: 0.2,
        },
      ],
    }),
    [],
  );

  const first = data.series[0];
  const last = data.series[data.series.length - 1];
  const changePercent = ((last.value - first.value) / first.value) * 100;
  const direction = changePercent >= 0 ? 'rose' : 'fell';
  const summary = `The index ${direction} ${Math.abs(changePercent).toFixed(1)}% between ${formatMonth(
    first.date,
  )} and ${formatMonth(last.date)}, from ${first.value} to ${last.value}.`;
  const base = data.indexBase.split('=')[0];

  return (
    <div className="housing-chart">
      <ProjectHeader
        title={data.title}
        description="Monthly new housing price index for Canada, charted from Statistics Canada data with a table fallback."
        tags={['Chart.js', 'Statistics Canada']}
        source="https://github.com/kimkev/kimkev.github.io/blob/master/src/pages/data/Chart.jsx"
      />

      <p className="chart-summary">{summary}</p>
      <p className="chart-meta">
        Monthly, {formatMonth(first.date)} to {formatMonth(last.date)}. Base:{' '}
        {formatMonth(`${base.slice(0, 4)}-${base.slice(4, 6)}`)} = 100. Source:{' '}
        <a href={data.sourceUrl} target="_blank" rel="noreferrer">
          {data.source}
        </a>
        .
      </p>

      <div className="chart-canvas" role="img" aria-label={summary}>
        <Line data={chartData} options={options} />
      </div>

      <p className="chart-updated">Data updated {formatDate(data.generatedAt)}.</p>

      <details className="chart-table">
        <summary>View data table</summary>
        <div className="chart-table-scroll">
          <table>
            <caption className="visually-hidden">{data.title}</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Index</th>
              </tr>
            </thead>
            <tbody>
              {data.series.map((point) => (
                <tr key={point.date}>
                  <td>{point.date}</td>
                  <td>{point.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
};

export default HousingChart;
