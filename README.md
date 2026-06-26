# EstateX

EstateX is a modern, premium real estate marketplace platform that connects property buyers and sellers with an intuitive search experience, robust dashboards, and smart property tools.

## Features

- **Advanced Property Search & Filtering**: Find properties using multi-criteria searches including location, price, type, and size.
- **Property Listings & Detail Views**: Explore comprehensive details, high-quality images, and property specifications.
- **Personalized Wishlist**: Save favorite properties to a personal wishlist for tracking and quick access.
- **Side-by-Side Property Comparison**: Compare multiple properties side-by-side on key metrics to make informed decisions.
- **Seller Dashboard**: Provide sellers with tools to list properties, manage listings, and view inquiry analytics.
- **Admin Control Panel**: Facilitate listing moderation, user management, and overall system configuration.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui & Lucide Icons
*(Note: Database, authentication, and cloud services will be integrated and documented as backend implementation begins.)*

## Folder Structure

```
├── app/                  # Next.js App Router pages, layout, and styling
│   ├── (buyer)/          # Buyer-focused routes (search, properties, wishlist, compare)
│   ├── globals.css       # Tailwind CSS global styles and variables
│   └── layout.tsx        # Application root layout
├── components/           # Reusable UI components
│   ├── layout/           # Shared layout components (Navbar, Footer)
│   ├── property/         # Property display cards, details, and search items
│   ├── ui/               # Low-level primitive design components (shadcn/ui)
│   └── providers.tsx     # Global context and theme providers
├── lib/                  # Helper utilities, fonts, and data helpers
│   ├── fonts.ts          # Outfit and Inter fonts configuration
│   ├── mock-data/        # Local mock datasets for prototyping
│   └── utils.ts          # Utility classes merger (cn)
├── public/               # Static assets (images, logos, icons)
├── types/                # TypeScript type definitions and interfaces
│   └── property.ts       # Type models for property listings
└── types/                # General typing files
```

## Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd estatex
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the example environment file and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Roadmap & Project Phases

- [x] **Phase 0**: Project Boilerplate & Shell Layout (Navbar, Footer, routing shell)
- [ ] **Phase 1**: Search & Filter System (Interactive listings, category filtering, search input)
- [ ] **Phase 2**: Property Details View (Image carousels, maps, request form, specs)
- [ ] **Phase 3**: User Authentication & Profiles (Buyer/seller registration, NextAuth setup)
- [ ] **Phase 4**: Seller Dashboard & Property Uploads (Listing creation, media upload, dashboard UI)
- [ ] **Phase 5**: Admin Dashboard & Moderation (Approving listings, managing users)
- [ ] **Phase 6**: Backend Integration (Prisma, PostgreSQL Database integration)
- [ ] **Phase 7**: AI & Advanced Features (Gemini-powered property summaries and smart search recommendations)
