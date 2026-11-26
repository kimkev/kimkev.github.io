/**
 * Pulls a GA4 snapshot and writes it to Firestore at stats/latest.
 *
 * Runs in GitHub Actions only. Requires:
 *   FIREBASE_SERVICE_ACCOUNT  full service-account JSON (secret)
 *   GA_PROPERTY_ID            numeric GA4 property ID (e.g. 355413689)
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const DATE_RANGE = { startDate: '28daysAgo', endDate: 'today' };

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
const propertyId = process.env.GA_PROPERTY_ID;

if (!serviceAccountJson) {
  console.error('FIREBASE_SERVICE_ACCOUNT is missing.');
  process.exit(1);
}

if (!propertyId) {
  console.error('GA_PROPERTY_ID is missing.');
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountJson);
const property = `properties/${propertyId}`;

const analytics = new BetaAnalyticsDataClient({ credentials: serviceAccount });

const toIsoDate = (value) =>
  value.length === 8
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
    : value;

async function fetchTotals() {
  const [response] = await analytics.runReport({
    property,
    dateRanges: [DATE_RANGE],
    metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
  });

  const values = response.rows?.[0]?.metricValues?.map((metric) => Number(metric.value)) ?? [];

  return {
    users: values[0] ?? 0,
    sessions: values[1] ?? 0,
    pageviews: values[2] ?? 0,
  };
}

async function fetchTopPages() {
  const [response] = await analytics.runReport({
    property,
    dateRanges: [DATE_RANGE],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10,
  });

  return (response.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0]?.value ?? '(unknown)',
    views: Number(row.metricValues?.[0]?.value ?? 0),
  }));
}

async function fetchDailyUsers() {
  const [response] = await analytics.runReport({
    property,
    dateRanges: [DATE_RANGE],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'totalUsers' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  return (response.rows ?? []).map((row) => ({
    date: toIsoDate(row.dimensionValues?.[0]?.value ?? ''),
    users: Number(row.metricValues?.[0]?.value ?? 0),
  }));
}

async function main() {
  const [totals, topPages, daily] = await Promise.all([
    fetchTotals(),
    fetchTopPages(),
    fetchDailyUsers(),
  ]);

  const app = initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore(app);

  await db.doc('stats/latest').set({
    updatedAt: Timestamp.now(),
    propertyId,
    rangeDays: 28,
    totals,
    topPages,
    daily,
  });

  console.log('Wrote stats/latest', { totals, topPages: topPages.length, days: daily.length });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
