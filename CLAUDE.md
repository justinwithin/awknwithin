# CLAUDE.md - AWKNWithin

This file provides context for Claude (AI assistant) when working on this codebase.

> See `CLAUDE.local.md` for credentials and environment-specific configuration.

> **IMPORTANT: You have direct database access!**
> Always run SQL migrations directly using `psql` - never ask the user to run SQL manually.

> **IMPORTANT: Push changes immediately!**
> This is a GitHub Pages site - changes only go live after pushing.
> Always `git push` as soon as changes are ready.

## Project Overview

AWKNWithin is a dual-brand platform managing two related wellness properties:

- **AWKN Ranch** — A venue rental and membership business. Manages venue spaces, bookings, members, and events.
- **Within Center** — A retreat center offering psychedelic-assisted therapy and integration services. Manages retreats, participants, intake forms, therapy sessions, and integration sessions.

**Main entities:** venues, bookings, members, retreats, participants, intake_forms, therapy_sessions, integration_sessions, practitioners, payments, documents

**Tech Stack:**
- Frontend: Next.js 16 (React 19, TypeScript, Tailwind CSS)
- Backend: Supabase (PostgreSQL + Storage + Auth)
- Hosting: GitHub Pages (static export) → custom domain: www.within.center
- i18n: Dictionary-based multi-language support

**Live URLs:**
- Public site: https://www.within.center/
- Intranet: https://www.within.center/en/intranet/

## Deployment

Push to main and it's live. No build step, no PR process.
**For Claude:** Always push changes immediately.

## Shared Files

- `shared/supabase.js` — Supabase client init (URL + anon key as globals)
- `shared/auth.js` — Auth module: profile button, login modal, page guard
- `shared/admin.css` — Admin styles: layout, tables, modals, badges (themeable via `--aap-*` CSS vars)

### Auth System (`shared/auth.js`)

Provides login/profile functionality on all pages:

- **Profile button**: Auto-inserts into nav bar. Shows person icon when logged out, initials avatar when logged in.
- **Login modal**: Email/password via `supabase.auth.signInWithPassword()`. Opens on profile icon click.
- **Dropdown menu**: When logged in, clicking avatar shows dropdown with "Admin" link and "Sign Out".
- **Page guard**: Admin pages call `requireAuth(callback)` — redirects to `../index.html` if not authenticated.
- **Supabase client**: Exposed as `window.adminSupabase` for admin page data access.

**Script loading order on every page:**
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="shared/supabase.js"></script>
<script src="shared/auth.js"></script>
```

**`shared/supabase.js` must export globals** (auth.js reads these):
```javascript
var SUPABASE_URL = 'https://YOUR_REF.supabase.co';
var SUPABASE_ANON_KEY = 'your-anon-key';
```

### Admin Pages (`admin/`)

- All admin pages are in `admin/` directory with `<meta name="robots" content="noindex, nofollow">`
- Each page loads `shared/admin.css` and calls `requireAuth()`:
```javascript
requireAuth(function(user, supabase) {
    // Page is authenticated — load data using supabase client
});
```
- Admin topbar nav links between admin sub-pages
- CRUD pattern: `admin-table` for listing, `admin-modal` for add/edit forms
- CSS classes are themeable via `--aap-*` custom properties

## Supabase Details

- Project ID: `(see CLAUDE.local.md)`
- URL: `(see CLAUDE.local.md)`
- Anon key is in `src/lib/supabase.ts` and `shared/supabase.js`

### Direct Database Access (for Claude)

See `CLAUDE.local.md` for the full psql connection string.

```bash
psql "$(cat ~/.psql_awknwithin 2>/dev/null || echo 'SEE CLAUDE.local.md')" -c "SQL HERE"
```

### Supabase CLI Access (for Claude)

```bash
supabase functions deploy <function-name>
supabase functions logs <function-name>
supabase secrets set KEY=value
```

Run these directly. If CLI not installed: `npm install -g supabase && supabase login`

## Key Files

- `src/lib/supabase.ts` — Supabase client (Next.js app)
- `shared/supabase.js` — Supabase client (vanilla JS pages)
- `next.config.ts` — basePath: `/awknwithin` (matches GitHub repo name)
- `src/i18n/config.ts` — supported locales
- `src/i18n/dictionaries/*.json` — translation files
- `src/contexts/auth-context.tsx` — authentication

## External Services

### Auth (Google OAuth)
- Provider: Google via Supabase Auth
- Redirect URI: `https://{REF}.supabase.co/auth/v1/callback`

### Email (Resend)
- API key stored as Supabase secret: `RESEND_API_KEY`
- Edge function: `send-email`

### SMS (Telnyx)
- Config in `telnyx_config` table
- Edge functions: `send-sms`, `telnyx-webhook` (deploy with `--no-verify-jwt`)
- Auth: Bearer token (NOT Basic)

### Payments (Square)
- Config in `square_config` table
- Edge function: `process-square-payment`, `square-webhook` (deploy with `--no-verify-jwt`)
- Start in sandbox, switch to production when ready

### E-Signatures (SignWell)
- Config in `signwell_config` table
- Edge function: `signwell-webhook` (deploy with `--no-verify-jwt`)

### AI (Google Gemini)
- Secret: `GEMINI_API_KEY`
- Models: `gemini-2.0-flash` (fast), `gemini-2.5-flash` (smart)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/`

### File Storage (Cloudflare R2)
- Config in `r2_config` table
- Secrets: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`
- Shared helper: `supabase/functions/_shared/r2-upload.ts`
- Free tier: 10 GB/month

## Conventions

1. Use toast notifications, not alert()
2. Filter archived items client-side
3. Don't expose personal info in public views
4. Client-side image compression for files > 500KB
5. AWKN Ranch = venue/membership focus; Within Center = retreat/therapy focus
