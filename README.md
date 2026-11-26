# kimkev.github.io

Personal site and a set of small browser apps: mini-games, a data table, and a housing-index
chart. Static site, no backend of its own.

- Primary: https://kimkev.github.io
- Mirror: https://kimkev.web.app

## Stack

| Area | Choice |
| --- | --- |
| Build | Vite 8 |
| UI | React 19, React Router 7 |
| Charts | chart.js 4 via react-chartjs-2 |
| Analytics | react-ga4 (GA4, measurement `G-52N2K9V12M`) |
| Admin | Firebase Auth + Firestore (read-only snapshot) |
| Tests | Vitest, Testing Library, jsdom |
| Lint/format | ESLint 9 flat config, Prettier |
| Node | 24 (`.nvmrc`) |

## Scripts

```bash
npm run dev            # dev server, http://localhost:3000
npm run build          # production build to dist/
npm run preview        # serve dist/ locally
npm run lint           # eslint .
npm run test           # vitest run
npm run test:watch     # vitest
npm run format         # prettier --write .
npm run sync:analytics # pull GA4 into Firestore (CI only)
```

## Local setup

```bash
npm ci
cp .env.example .env   # fill in values
npm run dev
```

Missing env values degrade gracefully: analytics stays off and `/admin` reports that it is not
configured. The rest of the site works.

## Environment variables

All variables are build-time. Anything prefixed `VITE_` ends up in the public bundle, so it must
never hold a secret.

| Variable | Purpose |
| --- | --- |
| `VITE_GA_MEASUREMENT_ID` | GA4 measurement ID |
| `VITE_FIREBASE_API_KEY` | Firebase web config (public identifier) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase web config |
| `VITE_FIREBASE_PROJECT_ID` | Firebase web config |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase web config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase web config |
| `VITE_FIREBASE_APP_ID` | Firebase web config |
| `VITE_ADMIN_EMAIL` | The only Google account allowed to read `/admin` |
| `GA_PROPERTY_ID` | Numeric GA4 property ID, used by the sync script |

`FIREBASE_SERVICE_ACCOUNT` (full service-account JSON) exists only as a GitHub Actions secret.

## Routing

`BrowserRouter` with clean paths (`/apps`, `/games/typing`, `/data/chart`).

GitHub Pages cannot rewrite requests, so `public/404.html` stores the requested path in
`sessionStorage` and redirects to the shell, which restores it with `history.replaceState`.
Firebase Hosting uses a normal SPA rewrite in `firebase.json`.

## Deploy

Every push to `master` runs `.github/workflows/deploy.yml`:

1. `npm ci`, lint, test, build (once).
2. Publish `dist/` to GitHub Pages.
3. Publish the same `dist/` to Firebase Hosting.

Required repository configuration:

- Settings → Pages → Source: **GitHub Actions**
- Variables: the eight `VITE_*` values plus `GA_PROPERTY_ID`
- Secret: `FIREBASE_SERVICE_ACCOUNT`

The build fails if any `%VITE_*%` or `%REACT_APP_*%` placeholder survives into `dist/`.

## Admin and analytics

`/admin` is not linked in the nav; the footer link is intentionally faint.

1. Google sign-in via Firebase Auth.
2. Only `VITE_ADMIN_EMAIL` may read, enforced twice: in the UI and in `firestore.rules`.
3. Data comes from the `stats/latest` Firestore document, written by
   `.github/workflows/sync-analytics.yml` (`npm run sync:analytics`) every day at 06:17 UTC.
4. Trigger a refresh manually from the Actions tab → *Sync analytics* → *Run workflow*.

The schedule needs a service account with GA4 **Viewer** access on the property and Firestore
write access (default `firebase-adminsdk` account is sufficient). No Cloud Functions, no billing
plan.

Rules:

```
match /stats/{doc} {
  allow read: if request.auth != null
              && request.auth.token.email == 'YOUR_EMAIL';
  allow write: if false;
}
```

## Project layout

```
src/
  components/   Navigation, Footer, BackButton
  data/         static datasets (words, passages, quotes, housing index)
  lib/          pure logic with unit tests (ticTacToe, anagram, pokerHand)
  pages/        Home, Apps, NoPage, Admin, games/, data/
  services/     analytics, firebase
  test/         Vitest setup
scripts/        sync-analytics.mjs
public/         404 shim, favicon, manifest, robots, sitemap
```

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Blank page after deploy | HTML referencing assets that no longer exist. Check that both hosts got the same `dist/` |
| Deep link 404s on Pages | `public/404.html` missing from the build, or Pages source not set to Actions |
| Admin stuck on "Loading…" | Firebase config missing, or `onAuthStateChanged` blocked by an extension |
| "Not authorized" after sign-in | The signed-in email differs from `VITE_ADMIN_EMAIL` (also check the Firestore rule) |
| No analytics data | Ad blocker, `VITE_GA_MEASUREMENT_ID` missing at build, or wrong property |
| Pages deploy skipped | Repository Pages source is still "Deploy from a branch" |

## History

Originally Create React App 5 with hash routing, two competing deploy scripts and a client-side
admin password baked into the bundle. Migrated to Vite in this repository's history; the
`pre-vite` tag marks the last CRA commit.
