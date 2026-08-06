# EstateX

EstateX is a modern, premium real estate marketplace platform that connects property buyers and sellers with an intuitive search experience, robust seller and admin control centers, smart property tools, and responsive visual features.

> **Project Status**: Frontend complete — Backend integration in progress.

## Demo Credentials

You can test different user personas using the following demo credentials:

| Persona | Email | Password | Access Level / Dashboard Route |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@estatehub.com` | `admin123` | `/admin/dashboard` (Control Center, Revenue, Moderation, Logs) |
| **Seller / Broker** | `seller@estatehub.com` | `seller123` | `/seller/dashboard` (Listing Uploads, Leads, Subscription) |
| **Buyer / User** | `buyer@estatehub.com` | `buyer123` | `/dashboard` (Wishlist, Enquiries, Price Alerts, Compare) |

---

## Features Implemented

- **Admin Control Center & Moderation**:
  - **Overview**: Real-time KPI dashboards, platform analytics & revenue breakdown charts (stacked bar & MRR line graphs).
  - **Moderation**: Listing approvals pipeline, reported content moderation, and RERA broker KYC verification workflows.
  - **User Management**: Unified management table for all users, sellers, and buyers with suspension toggles.
  - **Revenue & Subscription Plans**: Financial tracking, 30+ payment transaction records, refund issue modals, tax invoice PDF views, plan tier management (JSON-like feature limit editor), and promo code generator.
  - **Audit Logs & Activity Trail**: 90-day retention logs, multi-faceted filter toolbar, browser User Agent footprint inspection, and Before/After state mutation comparison cards.
  - **Site Settings & Feature Flags**: Platform config settings, 10 feature flags with Maintenance Mode warning dialog, SEO & robots.txt editor, and transactional email template customizer.
  - **Admin Notifications**: Real-time alerts hub for pending approvals, broker verifications, user reports, failed payments, and traffic spikes.
- **Seller Control Hub**: Multi-step property listing creation form, media dropzone, interactive Leaflet geo-coordinate pin picker, buyer lead management (CRM status pipeline), and subscription plan management.
- **Advanced Property Search & Filtering**: Multi-criteria search (purpose, city, locality, price range, bedrooms, amenities, furnishing) with dynamic sorting, filtering, and instant active filter chips.
- **Location Autocomplete**: Smart search input with a dropdown matching list of cities and localities.
- **Leaflet Interactive Maps**: Dynamic map rendering for property listing grids, property detail locations, and surrounding key landmarks.
- **Side-by-Side Property Comparison**: Compare up to 4 properties on pricing, specs (BHK, area, age, facing, overlook), and features in a sticky-scrolled horizontal grid.
- **EMI Loan Calculator**: Interactive home loan calculator with monthly payment breakdowns, amortization charts, and custom interest sliders.
- **Accessibility Integration (A11y)**: Focus rings, dynamic screen-reader ARIA labels, semantic structure layout, and custom user-controlled High Contrast/Large Text Accessibility Mode.
- **Responsive Layout & Performance**: Code-splitting dynamic imports, blur data placeholders, dark sidebar navigation, and clean responsive viewport breakpoints for mobile, tablet, and desktop.

---

## Folder Structure

```
├── app/                           # Next.js App Router root
│   ├── (admin)/                   # Admin route group (dashboard, revenue, plans, logs, settings, notifications)
│   ├── (auth)/                    # Authentication routes (login, signup, OTP verify)
│   ├── (buyer)/                   # Buyer client views (search, properties, wishlist, compare)
│   ├── (dashboard)/               # Dashboard view routes (saved searches, enquiries, alerts)
│   ├── (seller)/                  # Seller control hub (listings, add property, leads, subscription)
│   ├── admin/                     # Admin route re-exports & layout shell
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
│   ├── seller/                    # Seller property creation & lead management components
│   ├── ui/                        # Low-level primitives (buttons, modals, dialogs, map-error boundary)
│   └── providers.tsx              # Combined providers client entry point
├── lib/                           # Core utilities & mocks
│   ├── context/                   # Global Estate Context providers
│   ├── hooks/                     # Custom compare & wishlist hooks
│   ├── mock-data/                 # Mock datasets (properties, revenue, activity logs, plans, notifications)
│   ├── pdf/                       # PDF document schemas and render buffers
│   └── utils/                     # Formatting utilities, blur image helpers & status badge colors
├── types/                         # TypeScript interfaces & types
└── public/                        # Static assets (logos, illustrations)
```

---

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
