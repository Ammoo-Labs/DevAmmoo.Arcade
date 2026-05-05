# AMMOO ARCADE — Complete Project Overview

> A full-featured e-commerce marketplace built with Next.js 15 and React 19. Designed as a portfolio-grade prototype that demonstrates end-to-end shopping, seller onboarding, and admin management workflows.

---

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [Tech Stack](#2-tech-stack)
3. [Architecture & Directory Structure](#3-architecture--directory-structure)
4. [Pages & Routes](#4-pages--routes)
5. [Core Features](#5-core-features)
   - [Authentication System](#51-authentication-system)
   - [Shopping Cart](#52-shopping-cart)
   - [Product Browsing & Discovery](#53-product-browsing--discovery)
   - [Product Detail Page](#54-product-detail-page)
   - [Checkout Flow](#55-checkout-flow)
   - [Seller Onboarding (Shop Wizard)](#56-seller-onboarding-shop-wizard)
   - [Seller Dashboard](#57-seller-dashboard)
   - [Individual Shop Pages](#58-individual-shop-pages)
   - [User Profile](#59-user-profile)
   - [Admin Panel](#510-admin-panel)
   - [Notification System](#511-notification-system)
6. [Component Library](#6-component-library)
7. [Data Models](#7-data-models)
8. [State Management](#8-state-management)
9. [Design System & Styling](#9-design-system--styling)
10. [Responsive Design](#10-responsive-design)
11. [Performance & Optimization](#11-performance--optimization)
12. [Configuration](#12-configuration)
13. [Deployment](#13-deployment)
14. [Demo Data & Credentials](#14-demo-data--credentials)
15. [Project Statistics](#15-project-statistics)
16. [Known Demo Limitations](#16-known-demo-limitations)

---

## 1. Project Summary

**AMMOO ARCADE** is a marketplace e-commerce platform prototype where:

- **Customers** browse products, add to cart, and check out
- **Sellers** onboard via a guided wizard, manage products, and track orders
- **Admins** oversee users, approve sellers, and customize the site

Built entirely as a client-side static application with no backend — all data is mock, persistence is via `localStorage`. The project is deployable to any static host (GitHub Pages, Vercel, Netlify).

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.5.4 |
| UI Library | React | 19.1.0 |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | 3.4.17 |
| Icons | Lucide React | 0.544.0 |
| Build Tool | Turbopack | bundled with Next.js |
| State | React Context API | — |
| Persistence | localStorage | — |
| CSS Processing | PostCSS 4 | — |
| Output Mode | Static Export (`output: "export"`) | — |

**No backend, no database, no external API.** Everything runs in the browser.

---

## 3. Architecture & Directory Structure

```
ammoo_arcade/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout (wraps all providers)
│   │   ├── page.tsx                 # Home page
│   │   ├── products/
│   │   │   ├── page.tsx             # Products listing
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Product detail (server component)
│   │   │       └── product-detail-client.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── signin/page.tsx
│   │   ├── register/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── seller/page.tsx          # Seller dashboard
│   │   ├── switch-to-selling/page.tsx
│   │   ├── admin/page.tsx
│   │   ├── shop/[id]/
│   │   │   ├── page.tsx
│   │   │   └── shop-client.tsx
│   │   ├── email-verification/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── ui/
│   │   ├── layout/main-layout.tsx
│   │   └── components/
│   │       ├── header.tsx
│   │       ├── navbar.tsx
│   │       ├── footer.tsx
│   │       ├── user-menu.tsx
│   │       ├── Circle.tsx
│   │       ├── auth/auth-context.tsx
│   │       ├── cart/
│   │       │   ├── cart-context.tsx
│   │       │   ├── cart-item-card.tsx
│   │       │   ├── cart-summary.tsx
│   │       │   ├── types.ts
│   │       │   └── sample-data.ts
│   │       ├── product/
│   │       │   ├── product-card.tsx
│   │       │   ├── product-details.tsx
│   │       │   ├── types.ts
│   │       │   ├── categories.ts
│   │       │   ├── all-products.ts
│   │       │   ├── sample-data.ts
│   │       │   └── currency.ts
│   │       ├── button/
│   │       │   ├── button.tsx
│   │       │   ├── action-button.tsx
│   │       │   ├── form-button.tsx
│   │       │   ├── cart-button.tsx
│   │       │   ├── icon-button.tsx
│   │       │   └── link-button.tsx
│   │       ├── home/
│   │       │   ├── hero.tsx
│   │       │   ├── featured-products.tsx
│   │       │   ├── top-sellers.tsx
│   │       │   ├── creators.tsx
│   │       │   └── popular-shops.tsx
│   │       ├── notifications/
│   │       │   ├── notification-provider.tsx
│   │       │   ├── notification-container.tsx
│   │       │   ├── notification.tsx
│   │       │   └── inline-notification.tsx
│   │       ├── shop/
│   │       │   ├── shop-header.tsx
│   │       │   ├── shop-footer.tsx
│   │       │   ├── shop-category-nav.tsx
│   │       │   ├── shipping-info.tsx
│   │       │   ├── returns-exchanges.tsx
│   │       │   └── shop-colors.ts
│   │       ├── shop-wizard/
│   │       │   ├── shop-wizard.tsx
│   │       │   ├── shop-name-step.tsx
│   │       │   ├── profile-picture-step.tsx
│   │       │   ├── image-cropper.tsx
│   │       │   ├── contact-info-step.tsx
│   │       │   ├── social-media-step.tsx
│   │       │   ├── first-listing-step.tsx
│   │       │   └── approval-waiting-step.tsx
│   │       ├── seller-dashboard/
│   │       │   ├── shop-overview/shop-overview.tsx
│   │       │   ├── edit-profile/edit-profile.tsx
│   │       │   ├── products/products.tsx
│   │       │   └── orders/orders.tsx
│   │       ├── userprofile/
│   │       │   ├── profile-header.tsx
│   │       │   ├── account-status.tsx
│   │       │   ├── followed-shops.tsx
│   │       │   └── quick-actions.tsx
│   │       └── admin/
│   │           ├── admin-sidebar.tsx
│   │           ├── dashboard-overview.tsx
│   │           ├── user-management.tsx
│   │           ├── seller-management.tsx
│   │           ├── customize-website.tsx
│   │           └── banner-form-modal.tsx
│   │
│   ├── assets/images/
│   │   ├── hero-image.png
│   │   ├── hero-image2.png
│   │   ├── hero-image3.png
│   │   └── hero-image4.png
│   │
│   ├── data/users.ts                # Demo user accounts
│   └── lib/utils.ts                 # cn() class utility
│
├── public/                          # Static files, SVGs
├── next.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 4. Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | **Home** — Hero banner, featured products, top sellers, creators, popular shops |
| `/products` | **Products Listing** — Search, filter by category, sort by price/rating |
| `/products/[id]` | **Product Detail** — Image gallery, size/color picker, size guide, fit finder |
| `/cart` | **Shopping Cart** — Item list, quantities, cart summary with tax/shipping |
| `/checkout` | **Checkout** — 2-step form: shipping details → payment details → confirmation |
| `/signin` | **Sign In** — Email/password login with demo credentials |
| `/register` | **Register** — Full registration with validation, terms acceptance |
| `/profile` | **User Profile** — Account info, status, followed shops, quick actions |
| `/seller` | **Seller Dashboard** — Overview, edit profile, products, orders |
| `/switch-to-selling` | **Seller Onboarding** — 6-step shop wizard |
| `/shop/[id]` | **Shop Page** — Shop storefront with products, policies, follow button |
| `/admin` | **Admin Panel** — Dashboard, user/seller management, site customization |
| `/email-verification` | **Email Verification** — Post-signup confirmation page |
| `/verify-email` | **Verify Email** — Email link verification handler |
| `/forgot-password` | **Forgot Password** — Password reset request form |

---

## 5. Core Features

### 5.1 Authentication System

**File:** `src/ui/components/auth/auth-context.tsx`

- React Context with `useAuth()` hook available app-wide
- Login with email + password against demo user list
- Persistent session via `localStorage` (`userId` key)
- Role-based routing: `"customer"` vs `"seller"`
- Protected routes redirect to `/signin`
- Logout clears session and redirects home

**Demo Credentials:**

| Role | Email | Password |
|------|-------|----------|
| Customer | john.customer@example.com | password123 |
| Seller | sarah.seller@example.com | seller123 |

---

### 5.2 Shopping Cart

**File:** `src/ui/components/cart/cart-context.tsx`

- Add products with quantity, size, and color variants
- Remove individual items or clear the entire cart
- Update item quantities
- Cart item count badge on the header icon
- Persisted to `localStorage` key `ammoo-cart`

**Cart Summary Calculations:**

| Item | Logic |
|------|-------|
| Subtotal | Sum of (price × quantity) |
| Shipping | Free if subtotal ≥ $50, else flat fee |
| Tax | 8% of subtotal |
| Total | Subtotal + shipping + tax |
| Savings | Sum of discounts from original prices |

---

### 5.3 Product Browsing & Discovery

**File:** `src/app/products/page.tsx`

- **Search bar** — Matches product name, creator, category, store, and tags
- **Category filter pills** — 10+ categories (Fashion, Accessories, Art, etc.)
- **Sort options** — Default, Price: Low to High, Price: High to Low, Rating
- **Product grid** — 2 columns (mobile) → up to 5 columns (desktop)
- **Real-time filtering** — Results update instantly without page reload

---

### 5.4 Product Detail Page

**File:** `src/ui/components/product/product-details.tsx`

- Image gallery with thumbnail strip
- **Hover image swap** on product cards (shows front/back)
- Size selector — XS, S, M, L, XL
- Color selector — Black, White, Navy, Gray
- Quantity stepper
- Add to cart with selected variant
- Discount badge (% off) and original/sale price display
- New arrival badge
- Trust badges — Free Shipping, Secure Payment, 30-Day Returns
- Similar products carousel at the bottom

**Size Guide Modal:**
- Bust, Waist, Hips, Length measurements per size
- Toggle between centimeters and inches

**Fit Finder Modal:**
- User inputs height, weight, body type
- BMI calculation used to auto-recommend a size
- Educational description of sizing logic

---

### 5.5 Checkout Flow

**File:** `src/app/checkout/page.tsx`

**Step 1 — Shipping Details:**
- First name, last name, email address
- Shipping address, city, postal code, country

**Step 2 — Payment Details:**
- Card number (formatted as XXXX XXXX XXXX XXXX)
- Expiry date, CVC
- Demo mode banner (no real charges)

**Confirmation:**
- Generated order number
- Order summary with items and totals
- Success notification

---

### 5.6 Seller Onboarding (Shop Wizard)

**File:** `src/ui/components/shop-wizard/shop-wizard.tsx`

A 6-step guided wizard for new sellers:

| Step | Content |
|------|---------|
| 1 | Shop name, tagline, description |
| 2 | Profile picture, cover photo, ID photo — with built-in image cropper |
| 3 | Contact info — NIC number, telephone, address |
| 4 | Social media links — Facebook, Instagram, Twitter, website URL |
| 5 | First product listing — name, category, price, description, front/back/gallery images |
| 6 | Approval waiting screen — confirmation with next steps |

Features:
- Step progress indicator (mobile + desktop)
- Per-step form validation
- Built-in **image cropper** for uploaded photos
- File input with image preview
- Animated transitions between steps

---

### 5.7 Seller Dashboard

**File:** `src/app/seller/page.tsx`

Accessible only to users with `role: "seller"`.

**Sidebar navigation** (collapsible on desktop, hamburger on mobile) with 4 sections:

| Tab | Content |
|-----|---------|
| Shop Overview | Key stats (revenue, orders, products, followers), charts |
| Edit Profile | Shop name, description, contact info, social links |
| Products | Product inventory table with actions |
| Orders | Order history and status list |

Logout button in sidebar footer.

---

### 5.8 Individual Shop Pages

**File:** `src/app/shop/[id]/shop-client.tsx`

- Shop header — logo, banner image, shop name, description, location
- Shop stats — total products, followers count, star rating
- **Follow / Unfollow** button
- 3 navigation tabs:
  - **Home** — Products grouped by category with filter pills
  - **Shipping Info** — Shipping policies and delivery times
  - **Returns & Exchanges** — Return policy details
- Shop footer
- Dynamic theme colors per shop (`shop-colors.ts`)

---

### 5.9 User Profile

**File:** `src/app/profile/page.tsx`

- Profile header — avatar, name, email, member since date
- Account status — email verification badge, role badge
- Followed shops list
- Quick action links — My Orders, Wishlist, Account Settings

---

### 5.10 Admin Panel

**File:** `src/app/admin/page.tsx`

Fixed left sidebar with 4 sections:

| Section | Description |
|---------|-------------|
| Dashboard Overview | Platform-wide stats: total users, sellers, revenue, orders |
| User Management | Full user list — approve accounts, ban users |
| Seller Management | Seller application list — approve or reject new sellers |
| Customize Website | Banner editor with modal form, theme settings |

**Banner Editor Modal:**
- Add/edit promotional banners
- Title, subtitle, image, link fields

---

### 5.11 Notification System

**File:** `src/ui/components/notifications/notification-provider.tsx`

- Toast notifications for user feedback
- 4 severity types: **Success**, **Error**, **Warning**, **Info**
- Auto-dismiss after 5 seconds (configurable)
- Max 5 simultaneous toasts
- Position: top-right
- Used throughout — signin, register, add to cart, checkout, forms

---

## 6. Component Library

### Layout
| Component | Purpose |
|-----------|---------|
| `MainLayout` | Root wrapper; conditionally renders navbar and footer |
| `Header` | Fixed top bar — logo, search input, cart icon with badge, user menu |
| `Navbar` | Category dropdown navigation below header |
| `Footer` | Site footer with links |
| `UserMenu` | Auth-aware dropdown — sign in or profile/logout |

### Buttons
| Component | Purpose |
|-----------|---------|
| `Button` | Base button — variants: primary, secondary, outline, ghost, link |
| `ActionButton` | Call-to-action button |
| `FormButton` | Submit button with loading state |
| `CartButton` | Add-to-cart button |
| `IconButton` | Icon-only circular button |
| `LinkButton` | Renders a Next.js `<Link>` as a button |

### Home Page Sections
| Component | Purpose |
|-----------|---------|
| `Hero` | Full-width banner with headline, CTA, hero images, animated floating circles |
| `FeaturedProducts` | Category filter pills + product grid |
| `TopSellers` | Curated seller highlight cards |
| `Creators` | Creator profile cards |
| `PopularShops` | Horizontally scrollable shop cards |

### Product
| Component | Purpose |
|-----------|---------|
| `ProductCard` | Card with hover image swap, price, discount badge, like button, add to cart |
| `ProductDetails` | Full detail view — gallery, variant picker, quantity, modals |

### Cart & Checkout
| Component | Purpose |
|-----------|---------|
| `CartItemCard` | Line item with image, name, variant, quantity stepper, remove button |
| `CartSummary` | Subtotal, shipping, tax, total, savings callout |

### Seller Dashboard
| Component | Purpose |
|-----------|---------|
| `ShopOverview` | Stats cards and charts |
| `EditProfile` | Shop info editor form |
| `Products` | Product inventory table |
| `Orders` | Order list with status badges |

### Admin
| Component | Purpose |
|-----------|---------|
| `AdminSidebar` | Fixed left navigation |
| `DashboardOverview` | Metrics and KPIs |
| `UserManagement` | Searchable user table with action buttons |
| `SellerManagement` | Seller application queue |
| `CustomizeWebsite` | Banner list and theme editor |
| `BannerFormModal` | Create/edit banner modal |

### Utilities
| Component | Purpose |
|-----------|---------|
| `Circle` | Animated floating decorative circle (used in hero) |
| `InlineNotification` | Inline alert box (not a toast) |

---

## 7. Data Models

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "seller";
  profileImage?: string;
  phone?: string;
  address?: string;
  isVerified: boolean;
  createdAt: string;
  // Seller-specific
  shopName?: string;
  shopDescription?: string;
  // Customer-specific
  wishlist?: number[];
  followedShops?: string[];
}
```

### Product

```typescript
interface Product {
  id: number;
  name: string;
  creator: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string | StaticImageData;
  image2?: string;
  category: string;
  description?: string;
  isNew?: boolean;
  isLiked?: boolean;
  inStock?: boolean;
  discount?: number;
  store?: string;
  tags?: string[];
}
```

### CartItem

```typescript
interface CartItem {
  id: number;
  productId: number;
  name: string;
  creator: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  store: string;
  inStock: boolean;
}
```

### CartSummary

```typescript
interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  savings?: number;
}
```

---

## 8. State Management

All state is managed with **React Context API** — no Redux, no Zustand.

### AuthContext

```
Provider: src/ui/components/auth/auth-context.tsx
Hook:     useAuth()
```

| State | Type | Description |
|-------|------|-------------|
| `user` | `User \| null` | Currently logged-in user |
| `isAuthenticated` | `boolean` | Derived from user != null |
| `isLoading` | `boolean` | True during localStorage hydration |

| Method | Signature | Description |
|--------|-----------|-------------|
| `login` | `(email, password) => Promise<boolean>` | Validates and sets user |
| `logout` | `() => void` | Clears user and localStorage |

### CartContext

```
Provider: src/ui/components/cart/cart-context.tsx
Hook:     useCart()
```

| Method | Description |
|--------|-------------|
| `addToCart(product, qty, size, color)` | Appends or increments item |
| `removeFromCart(id)` | Removes item by cart item id |
| `updateQuantity(id, qty)` | Updates quantity |
| `clearCart()` | Empties cart |
| `getCartItemCount()` | Returns total item count |
| `getCartTotal()` | Returns subtotal |

### NotificationContext

```
Provider: src/ui/components/notifications/notification-provider.tsx
Hook:     useNotifications()
```

| Method | Description |
|--------|-------------|
| `showSuccess(message, title?)` | Green success toast |
| `showError(message, title?)` | Red error toast |
| `showWarning(message, title?)` | Yellow warning toast |
| `showInfo(message, title?)` | Blue info toast |

---

## 9. Design System & Styling

### Tailwind CSS Configuration

**Custom Animations (tailwind.config.js):**

| Name | Duration | Behavior |
|------|----------|----------|
| `scroll` | 30s linear infinite | Horizontal auto-scroll (marquee) |
| `float` | 3s ease-in-out infinite | Gentle vertical bob |
| `float-slow` | 5s ease-in-out infinite | Slow vertical bob |
| `float-fast` | 2s ease-in-out infinite | Fast vertical bob |
| `float-very-fast` | 1.5s ease-in-out infinite | Very fast bob |

### Color Palette

| Purpose | Color |
|---------|-------|
| Primary actions | Black (`#000`) |
| Backgrounds | White (`#fff`), Gray-50 to Gray-100 |
| Star ratings | Yellow-400 |
| Success states | Green-500 / Green-600 |
| Error states | Red-500 / Red-600 |
| Info states | Blue-500 |
| Warning states | Yellow-500 |
| Borders | Gray-200 / Gray-300 |
| Muted text | Gray-500 / Gray-600 |

### Typography Scale

- Headings: `text-xl` through `text-4xl`, `font-bold` or `font-semibold`
- Body: `text-sm` through `text-base`, `font-normal` or `font-medium`
- Labels: `text-xs`, `font-medium`, often uppercase + tracking-wide

### Component Design Patterns

- Cards: `rounded-lg shadow-sm bg-white border border-gray-100`
- Buttons: `rounded-lg px-4 py-2 font-medium transition-colors`
- Inputs: `rounded-lg border border-gray-300 px-3 py-2 focus:ring-2`
- Modals: `fixed inset-0 bg-black/50 flex items-center justify-center`

---

## 10. Responsive Design

Mobile-first approach using Tailwind breakpoints:

| Breakpoint | Width | Layout Changes |
|------------|-------|---------------|
| Default (mobile) | < 640px | Single column, hamburger nav, small text |
| `sm` | 640px | 2-column grids begin |
| `md` | 768px | Multi-column forms, adjusted spacing |
| `lg` | 1024px | Full navigation visible, sidebar layouts |
| `xl` | 1280px | Maximum widths, 4–5 column product grids |

**Key Responsive Behaviors:**
- Header: hamburger on mobile, full nav on desktop
- Product grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
- Seller dashboard sidebar: hidden on mobile (hamburger toggle), fixed left on desktop
- Checkout form: single column mobile, two-column desktop
- Admin sidebar: always fixed left, main content scrollable

---

## 11. Performance & Optimization

| Technique | Implementation |
|-----------|---------------|
| Static Export | `output: "export"` in `next.config.ts` — builds pure HTML/CSS/JS |
| Code Splitting | Automatic per-page splitting by Next.js App Router |
| Server Components | Product and shop detail pages use server components for initial render |
| Static Params | `generateStaticParams()` pre-renders all product/shop pages at build time |
| Image Lazy Loading | Next.js `<Image>` with lazy load (hero uses `priority`) |
| Turbopack | Dev server uses Turbopack for faster HMR |
| Tailwind Purging | Only used CSS classes included in production build |
| Component Memos | Price calculation functions memoized in cart context |

---

## 12. Configuration

### `next.config.ts`

```typescript
{
  output: "export",           // Static site generation
  trailingSlash: true,        // /products/ not /products
  images: {
    unoptimized: true         // Required for static export
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### `package.json` Scripts

```json
{
  "dev":   "next dev --turbopack",
  "build": "next build",
  "start": "next start"
}
```

---

## 13. Deployment

**Static export** — the `build` command produces an `/out` directory of plain HTML/CSS/JS files.

| Host | Instructions |
|------|-------------|
| GitHub Pages | Push `/out` to `gh-pages` branch; add `.nojekyll` (already in `/public`) |
| Vercel | Connect repo; set framework to Next.js; build command `npm run build` |
| Netlify | Connect repo; publish directory `out`; build command `npm run build` |
| Any CDN | Upload `/out` directory |

---

## 14. Demo Data & Credentials

### Users (`src/data/users.ts`)

| Name | Email | Password | Role |
|------|-------|----------|------|
| John Customer | john.customer@example.com | password123 | customer |
| Jane Smith | jane.smith@example.com | password123 | customer |
| Sarah Seller | sarah.seller@example.com | seller123 | seller |
| Mike Maker | mike.maker@example.com | seller123 | seller |

### localStorage Keys

| Key | Contents |
|-----|---------|
| `userId` | ID string of logged-in user |
| `ammoo-cart` | JSON array of cart items |

### Product Data Files

| File | Contents |
|------|---------|
| `src/ui/components/product/all-products.ts` | Full product catalog |
| `src/ui/components/product/sample-data.ts` | Smaller subset used in some sections |
| `src/ui/components/product/categories.ts` | Category list with icons |
| `src/ui/components/cart/sample-data.ts` | Sample cart items |

---

## 15. Project Statistics

| Metric | Count |
|--------|-------|
| Pages / Routes | 15 |
| Components | 60+ |
| Context Providers | 3 (Auth, Cart, Notifications) |
| TypeScript Interfaces | 10+ |
| Button Variants | 6 component types |
| Seller Wizard Steps | 6 |
| Seller Dashboard Tabs | 4 |
| Admin Panel Sections | 4 |
| Product Categories | 10+ |
| Demo Users | 4 |
| Demo Shops | 3 |
| Custom Tailwind Animations | 5 |
| npm Dependencies | 4 |
| Estimated Lines of Code | 10,000+ |

---

## 16. Known Demo Limitations

| Limitation | Detail |
|-----------|--------|
| No real payment | Checkout form accepts any card details — no charge occurs |
| No database | All product/user/shop data is hardcoded TypeScript |
| No email | Email verification pages are UI only — no emails sent |
| No password hashing | Passwords are stored in plaintext in the demo user array |
| No file upload backend | Shop wizard file inputs preview locally but don't persist |
| No real search backend | Search is client-side filter on in-memory array |
| Static product catalog | You cannot add or edit products in the demo |
| No real notifications | Toast notifications are ephemeral; no push/email |

---

## Quick Reference — User Journeys

### Customer Journey
1. Browse `/` home page → explore hero, featured products, top sellers
2. Search or filter at `/products`
3. Click product → view detail at `/products/[id]` → use Fit Finder
4. Add to cart → view `/cart`
5. Proceed to `/checkout` → fill shipping + payment → see confirmation

### Seller Journey
1. Register at `/register` → sign in at `/signin`
2. Go to `/switch-to-selling` → complete 6-step Shop Wizard
3. Access `/seller` dashboard → manage overview, profile, products, orders
4. Seller shop visible at `/shop/[id]`

### Admin Journey
1. Sign in with any account → navigate to `/admin`
2. View dashboard overview → manage users → approve/reject sellers
3. Customize website banners and theme

---

*Generated for brochure and presentation use. AMMOO ARCADE — Next.js 15 | React 19 | TypeScript | Tailwind CSS*
