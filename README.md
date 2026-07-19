# Choir App (nofomo) — Frontend

Vue 3 / Vite single-page app for the nofomo choir. Served in production by the Caddy container
(built into its image) under the `/nofomo/` base path; it talks to the Spring backend at
`/nofomo/api/*`, same-origin. Backend + infra details are in `README.md`; open tasks in `TODO.md`.

**Stack:** Vue 3 (`<script setup>`, mostly TypeScript) · Vue Router · Vite · FullCalendar
(schedule) · `vue-qrcode-reader` (doorman scanner) · `@vueuse` `useQRCode` (member QR).

## Run & build

```bash
npm install
npm run dev      # http://localhost:5173/nofomo/  — Vite proxies /nofomo/api → localhost:8080
npm run build    # production bundle into dist/
npm run preview  # serve the built bundle locally
npm test         # Vitest run (unit/component tests, jsdom)
npm run test:watch
```

The app is mounted under `/nofomo/` (`base` in `vite.config.js`); `src/api/http.ts` derives the
API base from `import.meta.env.BASE_URL` → `/nofomo/api` (override with `VITE_API_BASE_URL`). The
dev server proxies that prefix to `http://localhost:8080`, so dev is same-origin and identical to
prod — no `.env.production` needed.

## How the app is put together

**Routing & auth** (`src/router/index.js`)
- Routes: `/` → `/member`; `/member` (secret-key login), `/member/:secretKey` (member dashboard),
  `/admin`, `/doorhuman`, `/login` (password gate), `/impressum`, `/datenschutz`.
- `ROUTE_ROLE` maps routes to the required role; a `beforeEach` guard checks auth via `useAuth`
  and redirects unauthenticated users to `/login`, stashing the intended path
  (`pendingRedirect.js`) to return to after login.
- `http.ts` registers a global 401 handler that clears auth state and bounces to `/login`.

**Auth** (`src/composables/useAuth.ts`, `src/components/PasswordGate.vue`)
- One shared password per role (`member` < `doorman` < `admin`, cumulative). `PasswordGate` tries
  the role usernames in priority order against `POST /api/login` and routes by resulting role.
- Login forms carry a hidden `username` field + `autocomplete="current-password"` so mobile
  password managers save/fill them; PasswordGate and the member-key form use distinct hidden
  usernames (`site` vs `member`) so managers keep the two credentials apart.

**API layer** (`src/api/`)
- `http.ts` — `apiFetch(path, init, opts)`: prefixes the base URL, sends `credentials: 'include'`,
  attaches the CSRF token (reads `XSRF-TOKEN` cookie → `X-XSRF-TOKEN` header on non-GET), throws
  `ApiError` (carrying HTTP status), and fires the 401 hook.
- `authApi`, `memberApi`, `adminApi`, `doormanApi`, `contactApi` — thin per-domain wrappers.

**Views**
- `member/MemberLogin.vue` → `member/MemberDash.vue` (Check-In, member card, Buy Tickets, Player,
  Schedule cards; provides an accordion group). `MemberView.vue` (info + collapsible Attendance
  Log via `AttendanceView.vue` and Ticket Log via `TicketLogView.vue` — the shared, paginated
  ledger table with per-type signed deltas, also used by the admin member modal),
  `QrCodeViewer.vue` (renders the member's check-in QR), `ScheduleCalendar.vue` (FullCalendar
  list view over the backend ICS proxy).
- `admin/AdminDash.vue` — sessions table (finalize via modal), members table (search,
  show-archived toggle, detail modal with add-tickets, archive/reactivate and a fold-out Ticket
  Log; the modal is widened via `.member-detail-modal`), add-member form. Members with a negative
  regular **or** commit balance are shown red + bold and sorted to the top of the default name
  sort. ~600 lines; splitting it is on the backlog.
- `doorMan/DoormanDash.vue` — QR scanner check-in + manual name-search check-in + "currently
  checked in" list. Invalid/non-URL QR payloads and camera errors surface as fail modals.
- `legal/ImpressumPage.vue`, `legal/DatenschutzPage.vue`; `App.vue` shell (header card, router
  view, legal footer with the auth-gated **Feedback** link → `FeedbackModal.vue` → `/api/contact`).

**Shared UI** (`src/components/ui/`)
- `BaseCard.vue` — the card primitive; opt-in `collapsible` / `defaultOpen`. Each card provides its
  own accordion scope (`useAccordionGroup.ts`) so nested collapsibles don't fight their parent's
  siblings. Collapsed cards animate to a uniform header-only height.
- `BaseButton.vue` — variants (primary/secondary/danger), shared `:disabled` styling, fluid
  `clamp()` sizing so button rows stay on one line at any width.
- `Modal.vue` (backdrop + close), `ResultModal.vue` (green/red status modal used by all dashboards).

**Styling** (`src/assets/theme.css`)
- Design tokens: colours (`--bg`, `--fg`, `--accent`, `--success`, `--danger`, …), radii, fonts;
  plus shared base styles for inputs, tables, pagination, `.empty-state`. The brand palette is the
  deep-purple / yellow `[nofomo]` look. Components reference the tokens rather than hardcoding hex.

## Deployment

Built by GitHub Actions into the `choir-frontend` image (multi-stage: `node:22-alpine` build →
`caddy:2-alpine` serving `dist/` at `/srv/nofomo`). The Caddy container serves the SPA, terminates
HTTPS (auto Let's Encrypt), and reverse-proxies `/nofomo/api/*` to the backend. See `README.md`
(Deployment) — pushing to `main` builds+pushes the image; deploy is the manual "Run workflow"
button.

## Tests

Vitest + `@vue/test-utils` + jsdom (`vitest.config.ts`; specs are colocated `*.spec.ts` files):
`http.spec.ts` (CSRF header, `ApiError`, 401 hook), `AdminDash.spec.ts` (negative-first sorting,
red-flag rule, archived toggle, search, member-modal ticket log — mounts the real component with
the API module mocked and `BaseCard`/`Modal` stubbed open), `TicketLogView.spec.ts` (labels,
signed deltas, pagination) and `Modal.spec.ts`. `npm test` runs them once; the *Build and Deploy*
workflow runs them before every image build, so a red test blocks deployment.

## Conventions & gotchas

- The QR a member shows encodes `origin + /nofomo/member/<secretKey>` (built via
  `router.resolve`, base-path aware). The doorman scanner extracts the last path segment, so codes
  generated any time keep scanning.
- New/changed collapsible layouts: remember each `BaseCard` owns an accordion scope — nest
  intentionally.
- Some plain-JS files (`router/*.js`, `main.js`) and a couple of `.vue` files without `lang="ts"`
  produce `vue-tsc` implicit-`any` diagnostics; `vite build` doesn't type-check. Converting them is
  a prerequisite for a `vue-tsc --noEmit` CI gate (see `TODO.md`).
