# EmailCheck frontend

React interface for the on-premise email validation API. Three screens: sign-in, user and admin.

It talks to the real REST API only. There is no mock layer, so the backend must be running.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. Start the backend on `127.0.0.1:8000` first, or every screen will show
“Could not reach the API”.

```ini
VITE_BACKEND_ORIGIN=http://127.0.0.1:8000
```

Vite proxies `/v1`, `/admin`, `/healthz` and `/bootstrap` to that origin, so the browser stays on
one origin and there is no CORS. In production the built `dist/` is served from the same address as
the API, behind Caddy.

## Preview mode (temporary)

To look at the UI without a backend, set this in `.env`:

```ini
VITE_DEV_PREVIEW=true
```

Any key signs you in as **admin**. A key containing `user` signs you in as a **client**. A warning
strip sits at the bottom of every screen so this is never mistaken for real data.

It works by short-circuiting the transport: `src/api/core/request.ts` returns a sample `Response`
instead of calling `fetch`. Every hook, poll, cache invalidation and error path behaves exactly as
it will against the real API.

**To delete it when the backend is ready:**

```bash
rm -rf src/devPreview
```

Then remove the `DEV_PREVIEW` block from `src/api/core/request.ts`, the `<PreviewBanner />` line
from `src/app/App.tsx`, and `VITE_DEV_PREVIEW` from `.env`. Nothing else references it.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 5173 |
| `npm run build` | Typecheck, then build to `dist/` |
| `npm run preview` | Serve the built `dist/` |
| `npm run lint` | Lint with oxlint |

## One hook per endpoint

Every endpoint is its own file in `src/api/hooks/`, owning its URL, its return type and its query
key. Components never see a URL.

```ts
const { data, isLoading, error } = useGetJob(jobId)
const { data: ips } = useGetAdminStatus()

const pauseIp = usePauseIp()
pauseIp.mutate('203.0.113.10')
```

GET endpoints are `useQuery` hooks, POST and DELETE are `useMutation` hooks that invalidate the
queries they affect.

| Hook | Method and path |
|---|---|
| `useVerifyApiKey` | `GET /admin/status` (sign-in, see below) |
| `useListJobs` | `GET /v1/jobs` |
| `useGetJob` | `GET /v1/jobs/{id}` |
| `useCreateJobFromCsv` | `POST /v1/jobs/upload` |
| `useCreateJobFromEmails` | `POST /v1/jobs` |
| `useDownloadResults` | `GET /v1/jobs/{id}/results.csv` |
| `useLookupEmail` | `GET /v1/result?email=` |
| `useGetAdminStatus` | `GET /admin/status` |
| `usePauseIp` | `POST /admin/ips/{ip}/pause` |
| `useResumeIp` | `POST /admin/ips/{ip}/resume` |
| `useListApiKeys` | `GET /admin/keys` |
| `useCreateApiKey` | `POST /admin/keys` |
| `useRevokeApiKey` | `DELETE /admin/keys/{id}` |
| `useListAuditEntries` | `GET /admin/audit?limit=` |

`src/api/core/request.ts` is the one place that sets the `X-API-Key` header, parses JSON and maps
status codes to messages. Every hook goes through it, so 401 behaves the same everywhere.

## Sign-in uses a stand-in endpoint

`GET /v1/me` does not exist on the backend yet, so sign-in uses `GET /admin/status` to classify the
key instead:

| Response | Meaning |
|---|---|
| 200 | Admin key |
| 403 | Client key |
| 401 | Not a valid key |

That lives in `src/api/hooks/useVerifyApiKey.ts`. When `/v1/me` is built, replace the body of
`identityFromAdminStatus` with a single `requestJson<Identity>('/v1/me', { apiKey })` call and
nothing else changes.

Because the stand-in cannot return an id or a name, `Identity.id` is `null` and the name is just
`Admin` or `Client`. One visible effect: the admin screen cannot grey out the key you are signed in
with, so it shows Revoke on every active key and relies on the backend refusing to revoke the key in
use.

## Two endpoints still missing

| Endpoint | Used by | Needed because |
|---|---|---|
| `GET /v1/jobs` | Recent jobs | The job list has no source |
| `GET /admin/audit` with key names | Recent activity | It returns `key_id`, not a readable name |

Those two panels will show their error state until the backend provides them. Everything else works
against the API as it stands today.

## Folder layout

Every component, hook and helper lives in its own folder or file with an `index.ts` barrel, so an
import names the thing rather than a path into a file.

```
src/
  api/
    core/          ApiError, request (the single fetch wrapper)
    types/         identity, job, sendingIp, apiKey, audit
    hooks/         one file per endpoint
  app/             App, providers, query client
  auth/            session state, key access, the 401 listener
  theme/           light and dark theme context
  components/      reusable UI, one folder each, no domain knowledge
  features/
    auth/          SignInPage + its components and hook
    jobs/          UserPage + its components and hook
    admin/         AdminPage + its components
  lib/             format, verdicts, saveBlob, useCountUp
  styles/          tokens.css, motion.css, index.css
```

## How the API key is handled

The key is held in React state only. It is never written to `localStorage`, `sessionStorage`, a
cookie or a URL, so closing or reloading the tab signs the user out. It is sent as the `X-API-Key`
header on every request.

Any 401 signs the user out and returns them to sign-in, wherever it happens. That is wired once in
`src/auth/useSignOutOnUnauthorised.ts` rather than repeated per screen.

Results download through `fetch` and a temporary object URL rather than a plain link, because a link
cannot carry the key header.

## Design system

`styles/tokens.css` holds every colour as a CSS custom property, defined twice: once for light and
once under `.theme-dark`. `styles/index.css` maps those into Tailwind theme colours, so components
use `bg-surface` or `text-ink-soft` and never a raw hex value.

`styles/motion.css` holds the keyframes. Everything is disabled under
`prefers-reduced-motion: reduce`.

| Piece | Where |
|---|---|
| Drifting aurora background | `components/AuroraBackdrop` |
| Glass panels with hover lift | `components/Panel` |
| Animated verdict donut | `components/DonutChart` |
| Counting stat tiles | `components/StatTile` + `lib/useCountUp` |
| Gradient progress with sheen | `components/ProgressTrack` |
| Per-IP usage meters | `components/UsageMeter` |
| Pulsing live status dots | `components/Badge` |

## Verdicts

The API returns four verdicts, not two. Only `invalid` is safe to remove from a mailing list.

| Verdict | Meaning |
|---|---|
| `valid` | The mailbox exists |
| `invalid` | Rejected, or the domain has no mail server |
| `catch_all` | The domain accepts every address, so the check proved nothing |
| `unknown` | No clear answer: greylisted, timed out, or the sending IP was blocked |

## Polling

The job panel polls `GET /v1/jobs/{id}` every 4 seconds and stops once `finished` is true. The admin
screen refreshes status and the audit log every 10 seconds.
