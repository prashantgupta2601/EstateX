<div align="center">

# EstateX

**A full-stack real estate marketplace with role-based dashboards, AI-powered tools, and subscription payments.**

[Live Demo](https://estate-x-zeta.vercel.app/) · [Report a Bug](https://github.com/prashantgupta2601/EstateX/issues) · [Request a Feature](https://github.com/prashantgupta2601/EstateX/issues)

</div>

---

## Table of Contents

- [About](#about)
- [Key Features](#key-features)
  - [Buyer](#buyer)
  - [Seller / Broker](#seller--broker)
  - [Admin](#admin)
  - [AI Tools (Google Gemini)](#ai-tools-google-gemini)
  - [Platform](#platform)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup (Neon)](#database-setup-neon)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Roadmap](#roadmap)
- [Author](#author)

---

## About

EstateX is a modern property marketplace connecting buyers, sellers/brokers, and administrators on a unified platform:

- **Buyers** search, compare, and shortlist properties with interactive maps and mortgage tools.
- **Sellers & Brokers** publish listings, manage leads through a CRM pipeline, and subscribe to plans.
- **Admins** moderate listings, verify brokers, and monitor platform revenue and audit trails.

The platform integrates **Google Gemini** to deliver AI-assisted tools including fair-market price prediction, automated listing description generation, image quality analysis, personalized recommendations, and a 24/7 chat concierge.

> Payments run in **Razorpay Test Mode**. No real currency is charged.

---

## Key Features

### Buyer
- **Advanced Search & Filters:** Filter by purpose (Buy/Rent), city, locality, price range, BHK, furnishing, and amenities.
- **Interactive Maps & Location Autocomplete:** Map rendering with Leaflet and nearby landmark inspection.
- **Wishlist, Saved Searches & Price Alerts:** Save favorite listings and track price changes.
- **Side-by-Side Property Comparison:** Compare up to 4 properties simultaneously across pricing, area, amenities, and specifications.
- **EMI Loan Calculator:** Calculate monthly payments with interactive amortization breakdowns.
- **PDF Property Brochures:** Download complete property specifications as formatted PDF brochures.

### Seller / Broker
- **Multi-Step Listing Creator:** Photo dropzone, pricing, feature selection, and interactive Leaflet map pin picker.
- **Lead Management CRM:** Kanban-style lead pipeline to track buyer inquiries.
- **Listing Status Control & Analytics:** Toggle active/inactive states and monitor view counts.
- **Subscription Plans:** Razorpay test checkout with automated invoices.

### Admin
- **Dashboard & KPIs:** Revenue breakdown charts, transaction logs, and platform analytics.
- **Listing Moderation:** Review, approve, or reject property listings.
- **Broker Verification & User Moderation:** KYC verification for brokers and user account management (ban/unban).
- **Platform Configuration:** Audit logs, system health checks, feature flags, and settings management.

### AI Tools (Google Gemini)
- **AI Price Predictor:** Estimates fair market value using city benchmarks, BHK, area (sqft), and market trends.
- **Listing Description Generator:** Produces compelling, accurate listing descriptions from structured property data.
- **AI Image Quality Checker:** Evaluates listing photos for lighting, framing, and clutter with actionable retake tips.
- **AI Recommendations:** Analyzes user budget, preferences, and wishlist activity to suggest matching properties.
- **AI Chat Concierge:** Floating assistant offering 24/7 real estate guidance, terminology explanations, and locality insights.
- **Quota Management:** Fair daily usage tracker ensuring quota is only consumed on successful responses.

### Platform
- **Authentication:** NextAuth v4 credentials authentication with secure password hashing.
- **Role-Based Access Control:** Distinct buyer, seller, and administrator route protection enforced via middleware.
- **Responsive & Accessible UI:** Mobile-first layout with high-contrast accessibility modes, ARIA labeling, and keyboard navigation.
- **Data Validation:** Strict client and server-side request validation using Zod.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| **Styling / UI** | Tailwind CSS 4, shadcn/ui, Base UI, Lucide Icons, tw-animate-css |
| **Database** | PostgreSQL on Neon (Serverless), Prisma ORM 6 |
| **Auth** | NextAuth v4, bcryptjs |
| **Payments** | Razorpay (Test Mode) |
| **AI** | Google Gemini (`@google/generative-ai`) |
| **Maps** | Leaflet, React-Leaflet |
| **Data / Forms** | TanStack Query, React Hook Form, Zod |
| **Charts / PDF** | Recharts, `@react-pdf/renderer` |
| **Interactions** | `@dnd-kit`, canvas-confetti, react-dropzone |
| **Hosting** | Vercel |

---

## Architecture Overview

```text
Browser ──► Next.js (App Router, Vercel)
             ├── Server Components & Route Handlers (/api/*)
             │    ├── NextAuth (Sessions, Role checks)
             │    ├── Prisma ──► Neon PostgreSQL (Pooled connection)
             │    ├── Razorpay (Orders, Webhooks, Signature verification)
             │    └── Gemini API (AI Price Prediction, Descriptions, Chat, Vision)
             └── Middleware (Role-based route protection)
```

- **Database Connections:** Prisma uses a pooled connection string (`DATABASE_URL`) for runtime queries and a direct non-pooled connection (`DIRECT_URL`) for schema migrations and CLI operations.
- **Payment Verification:** Razorpay HMAC signatures are verified server-side before activating subscriptions.
- **Central AI Helper:** Single source of truth in `lib/gemini.ts` ensures consistent model resolution and error handling across all AI endpoints.

---

## Getting Started

### Prerequisites

- **Node.js**: 20.9+ (required for Next.js 16)
- **npm** or **yarn** / **pnpm**
- A free [Neon](https://neon.tech/) PostgreSQL database project
- A [Google AI Studio](https://aistudio.google.com/apikey) API key
- A [Razorpay](https://dashboard.razorpay.com/) test mode account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prashantgupta2601/EstateX.git
   cd EstateX
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(This automatically triggers `prisma generate` via `postinstall`)*

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   cp .env.example .env
   ```
   *(Fill in your values in both files — see [Environment Variables](#environment-variables) below)*

4. **Push the database schema:**
   ```bash
   npx prisma db push
   ```

5. **(Optional) Seed sample data:**
   ```bash
   npx prisma db seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Why two `.env` files?**  
> Next.js reads `.env.local` for development and runtime environments, while the Prisma CLI reads `.env`. Keep the database connection strings identical in both.

---

## Environment Variables

Create `.env.local` (and `.env` for Prisma CLI) using `.env.example` as a template:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Neon connection string used by the app (pooled in production) |
| `DIRECT_URL` | Neon direct (non-pooled) connection string used by Prisma CLI |
| `NEXTAUTH_SECRET` | Secret string for signing session tokens |
| `NEXTAUTH_URL` | Base URL of the application (`http://localhost:3000` for local development) |
| `RAZORPAY_KEY_ID` | Razorpay test key ID (server-side) |
| `RAZORPAY_KEY_SECRET` | Razorpay test key secret (server-side only) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay test key ID (exposed to client for checkout modal) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | *(Optional)* Model override (defaults to `gemini-flash-latest`) |

Generate a secure `NEXTAUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> **Security Rule:** Never commit `.env` or `.env.local` to source control. Only `.env.example` belongs in the repository.

---

## Database Setup (Neon)

1. Create a project in the [Neon Console](https://console.neon.tech/).
2. In the **Connection Details** panel, copy both strings:
   - **Pooled** (host includes `-pooler`) &rarr; assign to `DATABASE_URL`
   - **Direct** (host does not include `-pooler`) &rarr; assign to `DIRECT_URL`
3. Append `?connect_timeout=30` to connection strings. Neon's free-tier computes can suspend when idle, and this allows time for automatic wake-up.
4. Run `npx prisma db push` to synchronize your database tables.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Generates the Prisma Client and compiles the production build |
| `npm run start` | Runs the compiled Next.js production server |
| `npm run lint` | Runs ESLint checks across the codebase |
| `npx prisma studio` | Opens Prisma Studio GUI to view and edit database records |
| `npx prisma db push` | Pushes Prisma schema changes directly to the database |
| `npx prisma db seed` | Populates the database with initial demo data |

---

## Project Structure

```text
EstateX/
├── app/                       # Next.js App Router root
│   ├── (auth)/                # Authentication views (login, signup, OTP)
│   ├── (buyer)/               # Buyer routes (search, tools, wishlist, compare)
│   ├── (dashboard)/           # Buyer account dashboard & enquiries
│   ├── (seller)/              # Seller control hub (listings, leads, plans)
│   ├── admin/                 # Admin dashboard, moderation, logs & settings
│   ├── api/                   # REST API routes (auth, properties, AI, leads)
│   ├── globals.css            # Tailwind theme, contrast mode tokens & styles
│   └── layout.tsx             # Root application shell
├── components/                # Modular React components
│   ├── ai/                    # AI usage indicators & Google Gemini badges
│   ├── chat/                  # Floating AI chat widget
│   ├── home/                  # Hero section, city links, featured cards
│   ├── property/              # Property cards, comparison tables, filters
│   ├── seller/                # Multi-step listing creation forms & CRM tables
│   ├── tools/                 # Standalone price predictor & EMI calculators
│   └── ui/                    # Reusable shadcn/ui and Base UI primitives
├── lib/                       # Shared libraries & utilities
│   ├── ai/                    # Gemini client & usage tracker hooks
│   ├── db.ts                  # Shared Prisma client instance
│   ├── gemini.ts              # Central Gemini configuration & model resolver
│   ├── hooks/                 # Custom React hooks
│   ├── mock-data/             # Local datasets & fallback records
│   └── utils/                 # Currency formatters, mappers & styling helpers
├── prisma/                    # Database schema and seed scripts
├── public/                    # Static assets & icons
├── types/                     # Shared TypeScript interfaces
├── middleware.ts              # Role-based route guard
└── .env.example               # Environment variable reference template
```

---

## Deployment

The application is optimized for deployment on **Vercel** with **Neon PostgreSQL**:

1. Push your repository to GitHub and import it into Vercel.
2. In Vercel Project Settings &rarr; **Environment Variables**, add all keys from the table above:
   - Use the pooled Neon connection string for `DATABASE_URL`.
   - Use the direct connection string for `DIRECT_URL`.
3. Choose a serverless function region close to your database (e.g. `iad1` for Neon `us-east-2`).
4. Set `NEXTAUTH_URL` to your production domain (without a trailing slash) and trigger a deployment.

---

## Security Notes

- **Secrets Management:** Sensitive keys and secrets reside strictly in environment variables and are excluded from Git via `.gitignore`.
- **Password Protection:** User passwords are encrypted with `bcryptjs`.
- **Payment Integrity:** Razorpay webhook and client transaction signatures are verified cryptographically on the server.
- **Route Authorization:** Restricted pages and APIs require valid session tokens and role verification (Admin, Seller, Buyer).
- **Safe Logging:** AI route catch blocks log error codes and messages while systematically masking API secrets.

---

## Roadmap

- [ ] Image hosting integration for property photos
- [ ] Email and SMS/WhatsApp OTP notifications
- [ ] Saved-search alerts and automated price-drop notifications
- [ ] End-to-end automated test suite
- [ ] Next.js proxy convention migration for routing middleware
- [ ] Prisma config file (`prisma.config.ts`) migration

---

## Author

**Prashant Gupta**  
GitHub: [@prashantgupta2601](https://github.com/prashantgupta2601)

If you found this project helpful, consider giving it a star on GitHub!
