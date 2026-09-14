# Courtyard Grill — Full-Stack Website

A production-structured full-stack website for **Courtyard Grill**, a BBQ restaurant in DHA Phase 2,
Lahore. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma + PostgreSQL, and a
custom cookie-based auth system for both customers and admins.

Every interaction is real: the cart, checkout, reservations, contact form, customer accounts, and
the admin dashboard all read from and write to a real PostgreSQL database through Prisma. There are
no fake buttons or mocked API calls.

---

## 1. Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide icons
- **Backend:** Next.js Route Handlers (API routes)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Custom JWT sessions (jose) in httpOnly cookies, bcrypt password hashing — separate
  sessions for customers (`cyg_session`) and admins (`cyg_admin_session`)
- **Email:** Resend (optional — gracefully skipped if `RESEND_API_KEY` isn't set)
- **Validation:** Zod on every API route

---

## 2. Project structure

```
prisma/
  schema.prisma        Database models
  seed.ts               Seed script (menu items, categories, admin user)
src/
  app/
    page.tsx             Home
    menu/                Menu (search, filter, sticky category nav)
    about/                About
    gallery/              Gallery (filter + lightbox)
    contact/              Contact form + map
    reservations/         Reservation form
    order/                Cart + checkout
    login/ signup/         Customer auth
    account/               Customer dashboard (orders + reservations)
    admin/
      login/                Admin login (public)
      (dashboard)/          Route group — everything below requires an admin session
        page.tsx              Stats overview
        menu/                 Menu CRUD
        orders/               Order list + status updates
        reservations/         Approve/reject reservations
        customers/            Customer list
    api/                  All backend route handlers (see below)
  components/            Reusable UI (cart, header/footer, menu cards, home sections)
  lib/                   prisma client, auth helpers, zod schemas, mailer, utils
  types/                 Shared TypeScript types
```

### API routes

| Route | Methods | Purpose |
|---|---|---|
| `/api/auth/signup` | POST | Create a customer account |
| `/api/auth/login` | POST | Customer login |
| `/api/auth/logout` | POST | Customer logout |
| `/api/auth/me` | GET | Current customer session |
| `/api/menu` | GET | Public menu (categories + items) |
| `/api/orders` | GET, POST | Customer order history / place an order |
| `/api/reservations` | GET, POST | Customer reservation history / book a table |
| `/api/contact` | POST | Contact form submissions |
| `/api/admin/login` / `/logout` | POST | Admin auth |
| `/api/admin/menu` | GET, POST | List / create menu items |
| `/api/admin/menu/[id]` | PATCH, DELETE | Edit / delete a menu item |
| `/api/admin/orders` | GET | All orders |
| `/api/admin/orders/[id]` | PATCH | Update order status |
| `/api/admin/reservations` | GET | All reservations |
| `/api/admin/reservations/[id]` | PATCH | Approve / reject / cancel |
| `/api/admin/customers` | GET | Customer list |
| `/api/admin/stats` | GET | Dashboard stats |

Order pricing is always recalculated server-side from the database — the client only sends item IDs
and quantities, never prices.

---

## 3. Local setup

### Requirements
- Node.js 20+
- A PostgreSQL database (local via Docker, or a hosted free tier — Neon, Supabase, Railway all work)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment file and fill in real values
cp .env.example .env
# at minimum, set DATABASE_URL and AUTH_SECRET

# 3. Generate the Prisma client
npx prisma generate

# 4. Push the schema to your database (first-time setup)
npx prisma db push
# — or, if you prefer tracked migrations:
npx prisma migrate dev --name init

# 5. Seed the database (menu items, categories, admin login)
npm run db:seed

# 6. Start the dev server
npm run dev
```

Visit `http://localhost:3000`. The seeded admin account is printed to the console after seeding
(default `admin@courtyardgrill.pk` / `ChangeMe123!` unless you set `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` in `.env`). **Change this password immediately in a real deployment** — there
is no self-serve admin password reset yet, so update it directly in the database or re-seed with a
new value.

Admin dashboard: `http://localhost:3000/admin/login`

---

## 4. Database commands

```bash
npm run db:push       # sync schema.prisma to the database (fast, no migration history)
npm run db:migrate    # create + apply a tracked migration (recommended before production)
npm run db:seed       # (re)seed menu data + admin user — safe to re-run, uses upserts
npm run db:studio     # open Prisma Studio to browse/edit data visually
```

---

## 5. What's real vs. what needs a credential

Everything listed as a feature in the brief is wired end-to-end against the database. Two
integrations are intentionally left as documented stubs because they need real third-party
credentials that only the restaurant owner can provide:

- **Online payments** — the checkout flow is fully built (cart → order → confirmation) with
  "Cash on Delivery" / "Pay on Pickup" as the live payment methods. The `Order.paymentMethod` enum
  and checkout UI are structured so a card gateway (Stripe, JazzCash, EasyPaisa) can be added later
  without changing the data model — see `orderSchema` in `src/lib/validation.ts`.
- **Transactional email** — `src/lib/mailer.ts` sends real emails via Resend whenever
  `RESEND_API_KEY` is set. Without it, the app logs a console warning and continues — reservations
  and orders still save to the database either way.
- **Image uploads in the admin dashboard** — the admin menu editor currently takes an image **URL**
  (paste a hosted image link). Wiring up direct upload to Cloudinary or Supabase Storage just needs
  the corresponding env vars from `.env.example` and a small upload handler in
  `src/app/api/admin/menu/route.ts`.

---

## 6. Deployment (Vercel + hosted Postgres)

1. Push this repo to GitHub.
2. Create a Postgres database (e.g. [Neon](https://neon.tech) or [Supabase](https://supabase.com) —
   both have a free tier and give you a `DATABASE_URL` immediately).
3. Import the repo into [Vercel](https://vercel.com/new).
4. Add environment variables from `.env.example` in the Vercel project settings (`DATABASE_URL`,
   `AUTH_SECRET`, `RESEND_API_KEY` if using email, `NEXT_PUBLIC_SITE_URL`).
5. Set the build command to `prisma generate && next build` (Vercel usually detects this
   automatically from `postinstall`, but confirm it in Project Settings → Build & Development).
6. After the first deploy, run migrations against the production database:
   ```bash
   DATABASE_URL="<production-url>" npx prisma migrate deploy
   DATABASE_URL="<production-url>" npm run db:seed
   ```
7. Visit `/admin/login` on the deployed URL and change the seeded admin password.

---

## 7. Notes on this build

- Menu photography uses Unsplash placeholder images by category — swap `imageUrl` values (via the
  admin dashboard or `prisma/seed.ts`) for real photos of Courtyard Grill's dishes before going live.
- The design intentionally avoids a generic SaaS look: a charcoal/ember/gold palette, an editorial
  dotted-leader menu layout (`/menu`), and restrained motion (one hero entrance, hover states) rather
  than animating every section.
- `next.config.js` has `eslint: { ignoreDuringBuilds: true }` set so a clean `next build` isn't
  blocked by lint warnings during initial setup — remove that once you've run `npm run lint` and
  cleared any warnings you care about.
