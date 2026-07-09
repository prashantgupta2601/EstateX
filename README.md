# EstateX

EstateX is a modern, premium real estate marketplace platform that connects property buyers and sellers with an intuitive search experience, robust dashboards, smart property tools, and responsive visual features.

## Screenshots
> [!NOTE]
> Screenshots coming soon

## Features Implemented

- **Advanced Property Search & Filtering**: Multi-criteria search (purpose, city, locality, price range, bedrooms, amenities, furnishing) with dynamic sorting, filtering, and instant active filter chips.
- **Location Autocomplete**: Smart search input with a dropdown matching list of cities and localities.
- **Leaflet Interactive Maps**: Dynamic map rendering for property listing grids, property detail locations, and surrounding key landmarks.
- **Side-by-Side Property Comparison**: Compare up to 4 properties on pricing, specs (BHK, area, age, facing, overlook), and features in a sticky-scrolled horizontal grid.
- **EMI Loan Calculator**: Interactive home loan calculator with monthly payment breakdowns, amortization charts, and custom interest sliders.
- **Seller Details & Enquiry Routing**: Direct messaging with property sellers, with message statuses tracked.
- **Personalized Dashboards**: User hub monitoring active enquiries, bookmarked properties, automated saved searches, and price drop alerts.
- **Comprehensive Error Handling**: Creative global 404 pages, listing 404 views, inline error boundaries, and Leaflet map initialization protection wrappers.
- **Accessibility Integration (A11y)**: Focus rings, dynamic screen-reader ARIA labels, semantic structure layout, and a custom user-controlled High Contrast/Large Text Accessibility Mode.
- **Responsive Layout & Performance**: Code-splitting dynamic imports, blur data placeholders, vertical toolbar columns, and clean responsive viewport breakpoints for mobile, tablet, and desktop.

## Folder Structure

```
├── app/                           # Next.js App Router root
│   ├── (auth)/                    # Authentication routes (login, signup, OTP verify)
│   ├── (buyer)/                   # Buyer client views (search, properties, wishlist, compare)
│   ├── (dashboard)/               # Dashboard view routes (saved searches, enquiries, alerts)
│   ├── api/                       # API routes (PDF brochure download generator)
│   ├── error.tsx                  # Global client error boundary
│   ├── globals.css                # Global stylesheets, Tailwind theme, and contrast mode variables
│   ├── layout.tsx                 # Root layout provider wrapper
│   └── not-found.tsx              # Standalone global 404 Page
├── components/                    # Reusable components
│   ├── dashboard/                 # Account summary widgets & statistics tables
│   ├── home/                      # Home page hero search, cities, and trust components
│   ├── layout/                    # Navbar & Footer layout shells
│   ├── property/                  # Property cards, listings, filters, galleries, and maps
│   ├── providers/                 # Accessibility provider context & wrappers
│   ├── ui/                        # Low-level primitives (buttons, modals, dialogs, map-error boundary)
│   └── providers.tsx              # Combined providers client entry point
├── lib/                           # Core utilities & mocks
│   ├── context/                   # Global Estate Context providers
│   ├── hooks/                     # Custom compare & wishlist hooks
│   ├── mock-data/                 # Mock datasets (properties, searches, alerts)
│   ├── pdf/                       # PDF document schemas and render buffers
│   └── utils/                     # Formatting utilities & blur image helpers
├── types/                         # TypeScript interfaces & types
└── public/                        # Static assets (logos, illustrations)
```

## Getting Started

### Prerequisites

- Node.js (v18.x or later)
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

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Upcoming Project Phases

- [ ] **Phase 5**: Seller Dashboard & Property Uploads (Listing creation, media upload, geo-coordinates picker UI)
- [ ] **Phase 6**: Admin Moderator Console (Approving listings, agent vetting, and system audits)
- [ ] **Phase 7**: Backend & Database Integration (Prisma, PostgreSQL Database integration, NextAuth setup)
- [ ] **Phase 8**: AI Engine Integration (Gemini-powered property descriptions, localized summaries, and smart matching)
