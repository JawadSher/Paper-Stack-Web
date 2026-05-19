# PaperStack Web

PaperStack Web is a Next.js admin and public browsing portal for Pakistan board past papers. It includes public paper discovery, PDF previews, Clerk-protected admin tools, and static mock data ready to be replaced by Supabase.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env` or `.env.local` with:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Clerk sign-ups are disabled in the Clerk dashboard. Admin access is authorized with:

```json
{
  "role": "admin"
}
```

stored in `user.publicMetadata`.

## Folder Structure

- `src/app/(public)` public landing, browse, search, paper viewer, common questions
- `src/app/(admin)` Clerk-protected admin portal
- `src/components/shared` shared UI used by public and admin
- `src/components/public` public site components
- `src/components/admin` admin-only components
- `src/constants` mock data for boards, subjects, papers, questions, media
- `src/types` shared TypeScript types

## Adding Boards and Subjects

For now, edit static data:

- Boards: `src/constants/boards.ts`
- Subjects: `src/constants/subjects.ts`
- Admin metadata adapters: `src/constants/admin-boards.ts`, `src/constants/admin-subjects.ts`

Later these lists can be replaced with Supabase queries while keeping the page/component contracts.

## Deployment

Vercel is recommended:

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add the Clerk environment variables.
4. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
5. Deploy.

## Scripts

```bash
npm run lint
npx tsc --noEmit
npm run build
```
