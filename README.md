# ERLC Hub

ERLC Hub is a production-ready web app for Emergency Response: Liberty County communities. It combines a server directory, CAD tools, staff applications, and moderation workflows in one Next.js + Prisma project.

## Features

- Server directory with join methods, tags, and rules.
- CAD tools for civilians, officers, and dispatchers.
- Applications with a lightweight JSON form builder and admin review.
- Announcements and audit logs.
- Role-based access control (Owner, Admin, Moderator, Dispatcher, Officer, Member).
- Auth with email/password and password reset tokens.

## Tech Stack

- Next.js (App Router)
- Prisma + PostgreSQL
- Tailwind CSS
- REST API routes (serverless)

## Getting Started

```bash
npm install
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Run migrations and generate Prisma client:

```bash
npx prisma migrate dev
```

Start the dev server:

```bash
npm run dev
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string.
- `AUTH_SECRET`: secret used to sign session tokens.

## Password Reset Flow

1. POST to `/api/auth/reset-request` with `email`.
2. The response returns a `token` (in production, this would be emailed).
3. POST to `/api/auth/reset` with `token` and `password`.

## Deploying on a Website Builder

1. Connect your repo.
2. Set environment variables (`DATABASE_URL`, `AUTH_SECRET`).
3. Ensure the platform supports serverless Next.js routes.
4. Deploy and run database migrations (many builders offer a one-click Prisma migration step).

## Admin Setup

1. Sign up via `/auth/signup`.
2. Create a community in the Admin Panel.
3. Your account is assigned the **Owner** role for the new community.
4. Add other members from the Admin Panel and assign roles.

## REST Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/reset-request`
- `POST /api/auth/reset`
- `GET/POST /api/communities`
- `GET/POST /api/communities/:id/members`
- `GET/POST /api/servers`
- `GET /api/servers/:id`
- `GET/POST /api/announcements`
- `GET/POST /api/applications`
- `POST /api/applications/submit`
- `POST /api/applications/:id/review`
- `GET/POST /api/cad/civilians`
- `GET/POST /api/cad/vehicles`
- `GET/POST /api/cad/citations`
- `GET/POST /api/cad/arrests`
- `GET/POST /api/cad/bolos`
- `GET/POST /api/cad/incident-reports`
- `GET/POST /api/cad/sessions`
- `GET/POST /api/cad/dispatch-calls`
- `GET /api/audit`
- `GET/PUT /api/users/me`
