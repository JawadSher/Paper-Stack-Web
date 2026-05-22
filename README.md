# PaperStack Web

PaperStack Web is the public website and admin console for PaperStack, a past-paper platform built for Pakistani board students. It helps students browse boards, classes, subjects, years, sessions, common questions, and PDF papers while giving administrators a protected workspace to manage the content library.

The project is built with Next.js App Router, React, TypeScript, Prisma, Supabase, Clerk, and Tailwind CSS. The public experience is fast and discovery-focused; the admin experience is structured around content operations, uploads, analytics, and maintenance workflows.

## What This Project Includes

- Public landing page with animated hero, board previews, app promotion, and search-first navigation.
- Browse flow for boards, classes, subjects, papers, and common questions.
- PDF preview and paper detail surfaces.
- Clerk-protected admin dashboard.
- Admin CRUD workflows for boards, subjects, papers, classes, questions, media, and settings.
- PostgreSQL schema managed through Prisma.
- Supabase Storage integration for paper PDF uploads and signed/public URLs.
- React Query data fetching for client-side admin and public interactions.
- Theme-aware UI built with Tailwind CSS, shadcn-style primitives, Base UI, and Lucide icons.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| Runtime UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn-style components |
| Auth | Clerk |
| Database | PostgreSQL |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Storage | Supabase Storage |
| Data fetching | TanStack Query |
| Charts | Recharts |
| Animation | Framer Motion, react-type-animation |
| Icons | Lucide React |
| Deployment | Vercel recommended |

## Product Areas

### Public Site

Public routes live under `src/app/(public)`.

- `/` - landing page
- `/browse` - board browser
- `/browse/[boardId]` - board class selection
- `/browse/[boardId]/[classId]` - subject listing
- `/browse/[boardId]/[classId]/[subjectId]` - paper listing
- `/paper/[paperId]` - paper viewer/detail page
- `/search` - global paper search
- `/common-questions/[subjectId]` - common questions by subject

### Admin Console

Admin routes live under `src/app/(admin)`.

- `/dashboard` - overview, charts, recent papers, quick actions
- `/boards` - board management
- `/subjects` - subject management
- `/classes` - class coverage workflows
- `/papers` - paper library and upload flows
- `/questions` - common question management
- `/media` - uploaded media and storage tools
- `/settings` - app settings and feature controls

Admin access requires a valid Clerk session and `publicMetadata.role === "admin"`.

## Architecture

```text
src/
  actions/            Server actions for public and admin data access
  app/                Next.js App Router routes
  components/         Public, admin, shared, and UI components
  constants/          Static fallback/reference data
  hooks/              React Query hooks and shared client utilities
  lib/                Prisma, Supabase, storage, animation, and utility code
  providers/          App-level providers
  types/              Shared TypeScript and action result types

prisma/
  schema.prisma       Database schema
  seed.ts             Database seed script
```

### Data Flow

```text
Public pages
  -> server actions / query hooks
  -> Prisma
  -> PostgreSQL

Admin forms
  -> validated server actions
  -> Prisma mutations
  -> Supabase Storage for PDFs when needed
  -> revalidated admin/public paths

PDF uploads
  -> Supabase Storage bucket: papers
  -> Paper row stores storagePath/pdfUrl metadata
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL database
- Supabase project with a `papers` storage bucket
- Clerk project for authentication

### Install

```bash
npm install
```

The `postinstall` script runs `prisma generate` automatically.

### Environment Variables

Create `.env.local` for local development:

```bash
# Database
DATABASE_URL=""
DIRECT_URL=""

# Supabase
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Rules:

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client components.
- Only `NEXT_PUBLIC_*` values are safe for browser-side code.
- Keep production secrets in Vercel environment variables, not in Git.
- Use `.env.local` locally and keep real `.env` files out of commits.

### Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Apply your schema using the migration workflow appropriate for your environment:

```bash
npx prisma migrate dev
```

Seed initial board data:

```bash
npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts
```

The current schema includes:

- Boards
- Subjects
- Board/class/subject mappings
- Papers
- Common questions
- Question-paper links
- Paper analytics
- App settings
- Feature flags
- Admin audit logs

### Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Supabase Storage

Paper PDFs are stored in the `papers` bucket. Storage helpers live in `src/lib/storage.ts`.

The generated storage path follows this pattern:

```text
province/board/class/subject/year/session.pdf
```

Example:

```text
punjab/bise-lahore/10/physics/2024/annual.pdf
```

Storage rules:

- Use the public Supabase client only for public reads.
- Use the service-role client only on the server.
- Keep upload, delete, and signed URL generation inside server-side actions/utilities.
- Configure bucket access deliberately. If the bucket is public, assume every uploaded PDF URL can be shared.

## Authentication And Authorization

Authentication is handled by Clerk.

Public routes are open. Admin routes are protected by middleware and the admin layout:

```json
{
  "role": "admin"
}
```

This value must be stored in the Clerk user's `publicMetadata`.

Authorization rules:

- A signed-in user is not automatically an admin.
- Admin authority is granted only by the metadata role check.
- Do not put sensitive authorization decisions in client-only code.
- Server actions must still validate intent and input before mutating data.

## Scripts

```bash
npm run dev      # Start local development server
npm run lint     # Run ESLint
npm run build    # Production build
npm run start    # Start production server after build
```

Useful Prisma commands:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

## Coding Standards

### General

- Prefer TypeScript types over implicit shapes.
- Keep server-only work in server actions or server utilities.
- Keep client components focused on interaction, state, and rendering.
- Reuse existing components before creating new ones.
- Keep changes scoped to the feature being edited.
- Avoid committing generated build output such as `.next`.

### UI

- Follow the warm PaperStack/Claude-inspired theme already defined in `globals.css`.
- Use theme tokens such as `primary`, `secondary`, `card`, `muted`, `border`, and `foreground`.
- Use board colors only when the UI is explicitly representing a board.
- Prefer Lucide icons for actions and recognizable UI affordances.
- Keep admin screens dense, readable, and operational.
- Keep public pages polished, responsive, and student-friendly.
- Avoid hardcoded colors unless a section intentionally uses a brand illustration or landing-page treatment.

### Data And Actions

- Use Prisma for database reads and writes.
- Return consistent action results with the shared action result helpers.
- Revalidate affected paths after admin mutations.
- Keep public queries filtered to active/live content.
- Keep admin queries explicit about draft, processing, and live states.
- Validate IDs, classes, sessions, years, and file types before writes.

### Supabase

- Never import the service-role client into public/client components.
- Never expose the service-role key.
- Keep storage writes server-side.
- Treat bucket policies and RLS as production security concerns, not optional configuration.

## Deployment

Vercel is the recommended deployment target.

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add all required environment variables.
4. Ensure the production database is reachable from Vercel.
5. Ensure Prisma generation runs during install. This project already does that with `postinstall`.
6. Run the production build.

Build command:

```bash
npm run build
```

Install command used by many deployments:

```bash
npm install --legacy-peer-deps
```

## Environment Checklist For Production

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Quality Checklist Before Shipping

Run:

```bash
npm run lint
npm run build
```

Manually verify:

- Landing page loads without client errors.
- Board preview cards use database boards and link to `/browse/[boardId]`.
- Browse flow works from board to class to subject to papers.
- Admin routes redirect unauthenticated users.
- Admin users with `publicMetadata.role = "admin"` can access the console.
- Paper upload creates a storage object and database record.
- PDF viewer can open a live paper.
- Mobile layouts remain usable.

## Contribution Workflow

1. Create a focused branch.
2. Make the smallest complete change.
3. Keep unrelated refactors out of the PR.
4. Run lint and build.
5. Include screenshots for UI changes.
6. Explain database, storage, or auth impact clearly.

Commit message style:

```text
type(scope): short description
```

Examples:

```text
feat(public): load landing boards from database
fix(admin): validate paper upload file type
style(hero): refine animated heading colors
docs(readme): refresh project guide
```

## Security Notes

- Do not commit secrets.
- Do not log service keys, database URLs, signed URLs, or Clerk secrets.
- Do not trust client-submitted IDs without server-side validation.
- Do not use `NEXT_PUBLIC_` for private credentials.
- Keep admin mutations behind Clerk auth and role checks.
- Review Supabase bucket policies before making files public.
- Prefer least-privilege access when adding new database or storage behavior.

## Project Identity

PaperStack is designed to feel calm, useful, and serious about students' time. The product should not feel like a generic file dump. Every screen should help a student or admin answer one question quickly:

- Students: "Can I find the paper I need?"
- Admins: "Can I keep the library accurate and organized?"

That is the bar for every feature.

