# Orbit — Relationship Memory App

A polished full-stack web app for tracking meaningful interactions with people you care about. Visualize your relationship graph, explore your emotional memory map, and get smart reminders before connections fade.

---

## Author
Jinya Jiang, Keqian Wang, Yijia Tang, Zihan Zhou

## Features
<img width="1470" height="801" alt="Screenshot 2026-03-31 at 6 45 25 PM" src="https://github.com/user-attachments/assets/5c5e1cd6-cf0a-4e05-bd7f-5c21f1651625" />

- **Dashboard** — activity feed, relationship strength overview, reminder alerts, weekly trend chart
- **People** — browseable list with relationship-type filtering and closeness scores
- **Person Detail** — activity timeline, mood distribution, initiative balance, closeness trend
- **Memory Map** — all interactions plotted on a map (OpenStreetMap, no API key needed), filterable by person and mood
- **Relationship Graph** — interactive network visualization with React Flow; edge thickness = closeness
- **Trends & Insights** — monthly frequency charts, closeness trend lines, growing/fading relationship flags
- **Reminders** — smart, context-aware reconnect suggestions based on interaction history


---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + custom shadcn-style components |
| Database | PostgreSQL + Prisma ORM |
| Maps | Leaflet + OpenStreetMap (no API key required) |
| Graph | React Flow (`@xyflow/react`) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Auth | Mock auth (swap for Clerk/Auth.js) |

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL (local or managed, e.g. Supabase, Railway, Neon)

### 2. Clone & Install

```bash
git clone <your-repo>
cd Orbit_v2
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required: your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/Orbit"

# Optional: Mapbox token (app works without it using OpenStreetMap)
NEXT_PUBLIC_MAPBOX_TOKEN=""
```

### 4. Set Up the Database

```bash
# Push schema to your database
npx prisma db push

# Seed with demo data (8 people + 40 activities)
npm run db:seed
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the dashboard.

---

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:push` | Push schema to database (no migration history) |
| `npm run db:migrate` | Create a new migration |
| `npm run db:seed` | Seed demo data |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Open Prisma Studio |

---

## Project Structure

```
app/
  dashboard/          Dashboard page
  people/             People list + [id] detail pages
  activities/new/     Log interaction form
  map/                Memory map
  graph/              Relationship graph
  trends/             Trends & insights
  reminders/          Reminders center
  api/                REST API routes

components/
  ui/                 Base UI components (shadcn-style)
  layout/             Sidebar, TopBar
  dashboard/          Dashboard widgets
  activities/         Form, timeline, mood chips
  people/             Person card, header
  map/                Leaflet map wrapper
  graph/              React Flow graph
  trends/             Recharts components

lib/
  db.ts               Prisma client singleton
  scoring.ts          Closeness score algorithm
  reminders.ts        Reminder generation logic
  mock-auth.ts        Mock authentication
  utils.ts            Shared utilities

prisma/
  schema.prisma       Database schema
  seed.ts             Demo seed data

types/
  index.ts            TypeScript type definitions
```

---

## Closeness Score Algorithm

The closeness score (0–100) for each relationship is computed from four components:

```
score = recency × 0.35 + frequency × 0.30 + mood × 0.20 + initiative × 0.15
```

- **Recency (35%)** — exponential decay from last interaction date; halves every ~40 days
- **Frequency (30%)** — weighted count of interactions in last 30 and 90 days
- **Mood (20%)** — weighted average of mood scores (happy=100, conflict=10)
- **Initiative (15%)** — mutual initiation is rewarded; one-sided patterns score lower

Scores above 80 = "Very Close", 60–80 = "Close", 40–60 = "Moderate", below 40 = "Distant/Fading".

---

## Seed Data

The seed includes 8 realistic people spanning different relationship types:

- **Sarah Chen** (friend) — frequent, positive
- **Elena Rossi** (romantic) — very active, growing
- **Marcus Williams** (coworker) — regular work contact
- **Yuki Tanaka** (friend) — less frequent, high quality
- **David Park** (mentor) — monthly cadence
- **Tom Nguyen** (friend) — **fading**, hasn't been in touch
- **Priya Sharma** (coworker) — dropped off after project ended
- **James O'Brien** (family) — not enough contact

Locations span New York and San Francisco with real coordinates.

---

## Extending Auth

To replace the mock auth with Clerk:

1. `npm install @clerk/nextjs`
2. Wrap the root layout with `<ClerkProvider>`
3. Replace `MOCK_USER` in `lib/mock-auth.ts` with `currentUser()` from Clerk
4. Add middleware for protected routes
