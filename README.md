# Roblox Military Enlistment Portal (US Marines + US Navy)

Production-style Next.js + TypeScript + Tailwind + Prisma + PostgreSQL enlistment website with secure admin workflows.

## Features
- Roblox account connection by username, server-side lookup, profile-code ownership challenge, and branch group membership verification.
- Branch-aware enlistment flow for **US Marines** and **US Navy** with join-group prompts and verification refresh.
- Applicant dashboard with avatar, application status, branch resources, and announcements.
- Protected admin login and admin APIs with server-side session validation.
- Admin controls for applications, statuses, notes, branches, links, announcements, settings, and audit logging.

## Tech stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Zod validation

## Quick start
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy environment variables
   ```bash
   cp .env.example .env
   ```
3. Update `.env` values:
   - `DATABASE_URL`: your PostgreSQL URL
   - `SESSION_SECRET`: long random secret
4. Run migrations and seed
   ```bash
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```
5. Start development server
   ```bash
   npm run dev
   ```

## Important replacement points
- Replace sample group IDs and URLs in `prisma/seed.ts` (`requiredGroupId`, `joinGroupUrl`) with your real US Marines and US Navy Roblox group IDs.
- Replace seed Discord and game links in `prisma/seed.ts`.
- Replace default admin credentials after first login:
  - Email: `admin@example.com`
  - Password: `ChangeMeNow!123`

## Roblox verification flow
1. Recruit enters Roblox username.
2. Backend resolves real Roblox user ID and returns one-time verification code.
3. Recruit places code in Roblox profile description.
4. Recruit clicks refresh verification.
5. Backend checks:
   - profile contains verification code (account ownership)
   - user is in selected branch required Roblox group
6. Enlistment submission unlocks only when checks pass.

## Admin routes
- `/admin/login`
- `/admin/applications`
- `/admin/content`
- `/admin/settings`

## API routes
- `POST /api/auth/connect-roblox`
- `POST /api/auth/verify-roblox`
- `POST /api/applications`
- `POST /api/auth/admin-login`
- `POST /api/auth/admin-logout`
- `GET/PATCH /api/admin/applications`
- `GET/POST /api/admin/announcements`
- `GET/POST /api/admin/links`
- `GET/PATCH /api/admin/branches`
- `GET/PUT /api/admin/settings`

## Security notes
- Admin access is validated on the server for protected pages and write APIs.
- All primary write endpoints perform schema validation with Zod.
- Group verification is always server-side and rechecked on application submission.
- Keep all secrets only in environment variables.
