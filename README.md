# Event Management Platform

A web application for managing events, built with React and TypeScript, connected to a real external API. The platform provides two distinct experiences: a regular user flow (browsing upcoming events, registering, and tracking registration status) and an admin flow (full event and registration management).

## Table of Contents

- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Configuration](#api-configuration)
- [Application Startup](#application-startup)
- [Seed Data](#seed-data)
- [Build & Deployment](#build--deployment)
- [Project Structure](#project-structure)
- [Assumptions, Limitations and Trade-offs](#assumptions-limitations-and-trade-offs)
- [Optional Features](#optional-features)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| State management | Zustand (with `persist` middleware for session storage) |
| Data fetching & caching | TanStack Query (React Query) |
| HTTP client | Axios |
| Routing | React Router |
| Localization | react-i18next (Arabic / English, with automatic RTL/LTR switching) |
| Icons | lucide-react |
| Font | Cairo (Arabic + Latin, via Google Fonts) |
| PWA | vite-plugin-pwa (installable app with offline caching) |

## Setup Instructions

**Prerequisites:** Node.js 18 or later, and npm.

```bash
npm install
```

This installs all dependencies listed above, including dev dependencies (TypeScript, oxlint).

## API Configuration

The project relies on a single required environment variable:

```
VITE_API_URL=https://events-management-api-847aeb3c849e.hosted.ghaymah.systems
```

Copy `.env.example` to a new file named `.env` at the project root (the default value already points to the API used for this project; no change is needed unless testing against a different environment).

```bash
cp .env.example .env
```

> Note: the variable is prefixed with `VITE_`, not `NEXT_PUBLIC_` (the naming used as an illustrative example in the original task brief), because this project is built with Vite, not Next.js. Any environment variable that needs to be exposed to client-side code in a Vite project must be prefixed with `VITE_` specifically, or it will not be available in the compiled bundle.

## Application Startup

```bash
npm run dev
```

Starts a local development server (typically at `http://localhost:5173`).

**A pre-seeded admin account is available on the API:**

| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `admin123` |

To create a regular user account, use the "Create account" page from within the app.

## Seed Data

Because event creation is restricted to the admin role via an authenticated endpoint, a standalone script is included to populate the real API with varied test data (this is a development utility only, not shipped as part of the deployed frontend):

```bash
node scripts/seed-events.mjs
```

The script adds 15 events spread across the three supported types (conference, webinar, workshop) and multiple dates, useful for exercising search and filtering. It is built to tolerate the hosting provider's occasional cold-start latency (see the Assumptions section below): a 30-second timeout per request, up to 4 automatic retries, and it continues processing the remaining events even if a single one fails, rather than aborting the whole run.

## Build & Deployment

```bash
npm run build
```

Produces a production-ready build in the `dist/` folder, automatically code-split per page (via `React.lazy`) to reduce the initial load size.

```bash
npm run preview
```

Serves a local preview of the production build before actual deployment.

**Deployment:** the project is deployed and publicly accessible at:
**[https://event-mangment-platform.netlify.app/admin]**

The `public/_redirects` file handles SPA routing (ensures deep links like `/events/5` resolve correctly instead of returning a 404 on refresh, which Netlify requires explicitly for single-page apps).

## Project Structure

```
src/
├── api/            Direct integration functions for each API endpoint
├── components/     Reusable UI components (organized by feature/domain)
├── features/       Full application pages (one folder per page)
├── hooks/          Custom React hooks (e.g. useDebouncedValue)
├── i18n/           Localization setup and translation dictionaries (ar/en)
├── lib/            Shared utilities (validation, error handling, JWT, image/color helpers, query client config)
├── routes/         Routing and route-protection components
├── stores/         Global application state (Zustand)
└── types/          Shared TypeScript type definitions
```

## Assumptions, Limitations and Trade-offs

This section documents every real gap or discrepancy discovered between the written API documentation (`API_DOCUMENTATION.md`) and the API's actual behavior, as captured in the accompanying Postman collection, along with the decision made in each case.

### 1. Login does not return user data

`POST /auth/login` returns only an `access_token` field, with no `user` object, and there is no equivalent `/auth/me` endpoint to fetch the current user's identity after signing in. The adopted solution: decode the JWT payload locally (decode only, not verify) to extract the user's id and role, on the basis that the actual security verification of the token happens server-side on every subsequent request. The values extracted this way are used purely for UI display purposes (e.g., conditionally showing the admin dashboard link).

### 2. Field-naming mismatch between documentation and actual response

`API_DOCUMENTATION.md` describes the `POST /auth/register` response using `camelCase` (e.g. `firstName`), while the actual response recorded in Postman uses `snake_case` (`first_name`, `last_name`, `date_of_birth`, `created_at`). The actual response was adopted as the source of truth, since it reflects a real, recorded API call rather than a written description.

### 3. Inconsistent pagination key naming across endpoints

`GET /events` and `GET /events/upcoming` return list items under the `items` key, while `GET /registrations/event/{eventId}` returns the same paginated structure under the `attendees` key. This was handled by defining separate, precise TypeScript types for each case instead of forcing a single unified shape.

### 4. `PATCH /events/{id}` is documented but not implemented in practice

The written documentation describes a route for updating an existing event (`PATCH /events/{id}`), but it is entirely absent from the provided Postman collection. This route was not implemented in the app, since it falls outside the core functional requirements (create and delete only were required), and its actual shape could not be verified.

### 5. Limited registrant information in the admin panel

The `user` object attached to each registration in `GET /registrations/event/{eventId}` only includes `id`, `email`, and `role` — no full name. As a result, the admin dashboard displays the registrant's email instead of their name; this is a constraint imposed by the API's data shape, not a design choice.

### 6. "Fully booked" detection is limited to the details page

The `registrationCount` field is absent from the `GET /events/upcoming` response (the public events list) and only present in `GET /events/{id}` (single event details). As a consequence, fully-booked events cannot be visually flagged in the card grid list — only after opening that event's details page.

### 7. API hosting latency

The hosted backend is subject to cold-start behavior, occasionally producing connection timeouts exceeding 10 seconds on the first request after a period of inactivity. This was mitigated on the frontend through three complementary measures:
- A lightweight "wake-up" request fired as soon as the app loads, before any user interaction.
- One automatic retry for any GET request that fails due to a connection error.
- Caching via TanStack Query with a 5-minute stale time, reducing the number of actual requests sent to the server during frequent page navigation. Every data-mutating action (create, delete, approve, register) immediately and explicitly invalidates its related cache, so data freshness after the user's own actions is unaffected.

These measures reduce the impact but do not eliminate it entirely; a full fix would require better hosting, which is outside the scope of this project.

### 8. Linting

The project ships with oxlint only (the default configuration from the current Vite template). ESLint was not added on top of it — a conscious decision made under time constraints for delivery. Note that oxlint and ESLint are not fully equivalent alternatives (ESLint remains more mature for accessibility rules and advanced TypeScript checks).

## Optional Features

| Feature | Status |
|---|---|
| Arabic / English support (i18n) | Fully implemented — via react-i18next, with the selected language persisted in the browser and automatic RTL/LTR direction switching |
| Bundle size reduction | Partially implemented — per-page code splitting (`React.lazy`) |
| Deployment | Implemented — deployed on Netlify, see link above |
| Installable PWA | Implemented — service worker, web manifest, and app icons via vite-plugin-pwa (not part of the original brief, added as a bonus) |