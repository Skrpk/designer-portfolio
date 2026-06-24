# Interior Designer Portfolio

A server-rendered portfolio site for an interior designer, built with Next.js (App Router) and plain CSS, deployed on Vercel. Project metadata and images are stored in Vercel Blob, so new projects can be created on the live deployment from an admin page.

## Features

- Minimalist, typography-driven design with CSS-only hover image reveals on the project list.
- Public and private projects.
- Private projects are gated behind a shared password; entering it sets a signed, httpOnly cookie valid for 1 hour that unlocks all private projects.
- Admin page (HTTP Basic Auth) to create projects: name, description, visibility, and multiple images.
- Images upload directly from the browser to Vercel Blob (supports large files); metadata is saved to `data/projects.json` in Blob.
- Server-side rendering throughout.

## Tech

- Next.js App Router + React (server components)
- Plain CSS (global stylesheet + CSS Modules), no CSS framework
- `@vercel/blob` for storage

## Routes

| Route | Description |
| --- | --- |
| `/` | Home — SSR list of all projects |
| `/projects/[slug]` | Project detail (public renders directly; private checks the auth cookie and redirects to `/unlock`) |
| `/unlock` | Password entry for private projects |
| `/admin` | Create-project form (HTTP Basic Auth) |
| `/api/auth/verify` | Verifies the private password and sets the access cookie |
| `/api/blob/upload` | Issues client-upload tokens for Vercel Blob (Basic Auth) |
| `/api/admin/projects` | Persists project metadata (Basic Auth) |

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Purpose |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token. Auto-injected on Vercel once a Blob store is linked; required locally. |
| `PRIVATE_PROJECT_PASSWORD` | Shared password to view private projects. |
| `ADMIN_USER` / `ADMIN_PASSWORD` | HTTP Basic Auth credentials for `/admin` (must differ from the private password). |
| `AUTH_SECRET` | Long random string used to sign the access cookie. Generate with `openssl rand -hex 32`. |

## Local development

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev
```

To use Vercel Blob locally you need a real `BLOB_READ_WRITE_TOKEN`:

1. Create a project on Vercel and add a Blob store (Storage tab).
2. Copy the store's read/write token into `.env.local`.

Alternatively, run `vercel env pull .env.local` after linking the project with the Vercel CLI.

## Deployment (Vercel)

1. Push this repo to GitHub and import it into Vercel.
2. In the project's Storage tab, create/link a Blob store — this injects `BLOB_READ_WRITE_TOKEN` automatically.
3. Add the other environment variables (`PRIVATE_PROJECT_PASSWORD`, `ADMIN_USER`, `ADMIN_PASSWORD`, `AUTH_SECRET`) in Settings → Environment Variables.
4. Deploy. Visit `/admin` to add your first project.

## Notes

- Project data lives at the stable Blob pathname `data/projects.json` and is read with no caching so the admin's changes appear immediately.
- The admin and private-project passwords are intentionally separate.
