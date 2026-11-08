# A little date

A mobile-first, anonymous date invitation built with Nuxt 4, Vue 3, TypeScript, and Nuxt UI. It generates a static GitHub Pages site; only explicit final submission contacts Supabase.

## Local development

Requires Node.js 22 and npm.

```sh
npm ci
cp .env.example .env
npm run dev
```

Without Supabase configuration, the complete wizard works and the review page explains that sending is unavailable. It never pretends to save a response. Unfinished preferences remain in this browser's localStorage, under `little-date-v1`; clearing site storage removes them. There are no analytics, tracking cookies, or personal contact fields.

The flow is date → itinerary → review. Recipients can select one or more dates immediately, choose a complete itinerary or “Let’s decide together”, and see a receipt after submitting. Declining closes the invitation without sending a response. Timing is part of the selected plan: pickup at 11:00 AM and drop-off around 9:30–10:00 PM (Malaysia time). Submissions store `11:00` and `22:00` as the planned window; recipients do not choose custom times. Old `/times` links redirect to the itinerary step.

## Content

- Date window, timezone, allowed itinerary IDs: `shared/invitation/constants.ts`.
- Date validation: `shared/invitation/validation.ts`; database validation must be updated alongside date-window changes.
- Options and venue fields: `app/data/itineraries.ts`.
- Images: [asset instructions](public/images/itinerary/README.md).
- Styling: `app/assets/css/main.css`.

Options A, B, and C are distinct indoor dates: **A Little Luxury** (TRX, Aurum Theatre, Hokkaido Table), **Made Together** (Zen Ceramic and relaxed meals in Hartamas), and **Textiles & Chinatown** (Merdeka Textile Museum and dinner at Concubine). Each card has its own theme and a local venue cover photo. Meal venues not yet selected use illustrations and are clearly marked for choosing together. Schedules are suggestions; screenings, workshops, indoor tables and museum opening dates need confirming before booking.

“Let’s decide together” stores `decide-together` as the itinerary ID. Apply `202611080003_decide_together.sql` and redeploy the Edge Function before deploying this frontend. Old `/really` links redirect to the plan page.

## Supabase setup

1. Create a Supabase project and install/login to the Supabase CLI.
2. Link it: `supabase link --project-ref YOUR_PROJECT_REF`.
3. Apply the migration with `supabase db push`.
4. Set function secrets. `ALLOWED_ORIGINS` is a comma-separated list of exact origins, for example `https://scarletdawn03.github.io,http://localhost:3000`. Origins have no repository path or trailing slash. Set `RATE_LIMIT_SECRET` to a strong random secret. Use the Supabase dashboard or CLI secret input; never commit values.
5. Deploy: `supabase functions deploy submit-invitation`. JWT verification is disabled in `supabase/config.toml` because recipients have no login; all payloads are validated by the function.
6. Set `NUXT_PUBLIC_SUPABASE_URL` and `NUXT_PUBLIC_SUPABASE_KEY` in `.env` for development and as GitHub repository Actions **variables** for deployment. Use the project's public publishable or legacy anon key. Never use a service-role/secret key here.

Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the function environment. The privileged key never enters the static site.

The migration enables RLS with no visitor policies and revokes browser access. Only a service-role-only RPC can insert. The database checks dates, stop IDs, true acceptance, schema version, and same-day time ordering. The function bounds actual body bytes to 2 KB and rejects malformed or unknown fields. A UUID is a session identifier, not authentication.

Duplicate identical submissions succeed without another row. Different preferences under an existing session return a conflict; the author can handle changes privately. There is no public lookup API. Rate limiting allows ten attempts per hashed network address per hour. It uses the gateway's forwarded address and a keyed, hourly digest, never a stored raw IP; expired buckets are removed on the next submission. This is lightweight abuse mitigation, not bot-proof protection. Verify forwarded address behavior in your Supabase deployment before relying on the limiter for hostile traffic. The host may keep its own infrastructure logs.

Read responses in the Supabase dashboard's Table Editor, `invitation_responses`. No public admin route exists. Delete responses in the dashboard when no longer needed, then disable the function/site after the invitation ends.

### Backend smoke checks

After deployment, submit a test response and inspect the table. Retry the identical request and confirm the row count is unchanged. Check that altered dates/times, false acceptance, oversized requests, and anonymous REST reads/inserts are denied. Test from the configured production origin. The migration and live function require a real Supabase project; frontend tests do not replace these checks.

## GitHub Pages

The provided workflow deploys pushes to `main` and supports manual dispatch. In repository Settings → Pages, select **GitHub Actions** as the source. Configure the two public Supabase variables above before building the production site.

The workflow obtains the repository base path from `actions/configure-pages`. For a local subpath build:

```sh
NUXT_APP_BASE_URL=/Invitation/ npm run generate
```

Upload `.output/public`. All six known routes have generated `index.html` files for direct loads and refreshes, and Nuxt generates a `404.html` fallback. Navigation, scripts, and illustration URLs include the base path. For a custom domain or root user site use `/`. GitHub Pages may return HTTP 404 for unknown paths even while its fallback loads the app; supported wizard routes have real files.

## Checks

Run `npm run format` to format source files and `npm run format:check` to check formatting. Generated output and the lockfile are excluded.

```sh
npm run format:check
npm run typecheck
npm test
npm run generate
npm run test:e2e
NUXT_APP_BASE_URL=/Invitation/ npm run generate
npm run test:static
```

Browser tests use local Google Chrome (`/usr/bin/google-chrome`). Override `CHROME_PATH` for another Chromium executable. The e2e harness starts the dev server automatically. Tests cover respectful No/exit behavior, multi-date flow, time ordering, exactly-one itinerary, route guards, refresh recovery, and unconfigured submission. Mocked submission tests cover network retry, duplicate-click protection, and blocked edits while sending. Cover and stop images are checked with both successful and failed photo requests. Unit tests verify weekends and full December 19–31 availability and payload rejection. No remote Supabase access is needed for these tests.

Before launch, manually check keyboard focus, screen-reader announcements, reduced motion, the production subpath, missing images, and 320–430 px screens. Supabase and GitHub Pages setup are external steps; this repository does not provision accounts or publish itself until you push and configure hosting.

## Dependency status

The lockfile and `.npmrc` make installation reproducible with npm's legacy peer resolver (the default resolver crashed on this dependency graph). Vitest is updated to a patched release. The dependency tree still has npm audit advisories. Recheck `npm audit` after dependency updates and assess affected runtime and development paths before launch. Keep local development private.
