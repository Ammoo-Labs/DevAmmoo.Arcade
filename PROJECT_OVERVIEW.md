# AMMOO ARCADE — Complete Project Overview

> A full-featured e-commerce marketplace built with Next.js 15 and React 19. Designed as a portfolio-grade prototype that demonstrates end-to-end shopping, seller onboarding, order management, and admin workflows.

---

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [Tech Stack](#2-tech-stack)
3. [Architecture & Directory Structure](#3-architecture--directory-structure)
4. [Pages & Routes](#4-pages--routes)
5. [Core Features](#5-core-features)
   - [Authentication System](#51-authentication-system)
   - [Shopping Cart with Selective Checkout](#52-shopping-cart-with-selective-checkout)
   - [Product Browsing & Discovery](#53-product-browsing--discovery)
   - [Product Detail Page](#54-product-detail-page)
   - [Checkout Flow](#55-checkout-flow)
   - [Seller Onboarding (Shop Wizard)](#56-seller-onboarding-shop-wizard)
   - [Seller Dashboard](#57-seller-dashboard)
   - [Order Management System (OMS)](#58-order-management-system-oms)
   - [Payouts & Financials](#59-payouts--financials)
   - [Individual Shop Pages](#510-individual-shop-pages)
   - [User Profile & Order Tracking](#511-user-profile--order-tracking)
   - [Admin Panel](#512-admin-panel)
   - [Notification System](#513-notification-system)
6. [Component Library](#6-component-library)
7. [Data Models](#7-data-models)
8. [State Management & Persistence](#8-state-management--persistence)
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

- **Customers** browse products, add to cart, selectively checkout, and track their orders
- **Sellers** onboard via a guided wizard, manage products with real image uploads, and process orders through a full OMS with delivery tracking and payouts
- **Admins** oversee users, approve sellers, and customize the site

Built entirely as a client-side static application — no backend. All data is persisted to `localStorage`. Deployable to any static host (GitHub Pages, Vercel, Netlify).

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
| Persistence | localStorage / sessionStorage | — |
| Image Loading | picsum.photos (seeded) | external CDN |
| Output Mode | Static Export (`output: "export"`) | — |

**No backend, no database, no external API.** Everything runs in the browser.

---

## 3. Architecture & Directory Structure

```
ammoo_arcade/
├── src/
│   ├── app/                                  # Next.js App Router pages
│   │   ├── layout.tsx                       # Root layout (wraps all providers)
│   │   ├── page.tsx                         # Home page
│   │   ├── products/
│   │   │   ├── page.tsx                     # Product listing + search/filter
│   │   │   └── [id]/
│   │   │       ├── page.tsx                 # Server component (generateStaticParams)
│   │   │       └── product-detail-client.tsx
│   │   ├── cart/page.tsx                    # Cart with selective checkout
│   │   ├── checkout/page.tsx                # 2-step checkout → order creation
│   │   ├── signin/page.tsx
│   │   ├── register/page.tsx
│   │   ├── profile/page.tsx                 # Buyer profile + order tracking
│   │   ├── seller/page.tsx                  # Seller dashboard (5-tab)
│   │   ├── switch-to-selling/page.tsx       # Shop wizard entry
│   │   ├── admin/page.tsx
│   │   ├── shop/[id]/
│   │   │   ├── page.tsx
│   │   │   └── shop-client.tsx              # Seller-product aware storefront
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
│   │       ├── user-menu.tsx                # Auth-aware dropdown with home redirect on logout
│   │       ├── Circle.tsx
│   │       ├── auth/auth-context.tsx
│   │       ├── cart/
│   │       │   ├── cart-context.tsx
│   │       │   ├── cart-item-card.tsx       # Checkbox-selectable item card
│   │       │   ├── cart-summary.tsx         # Shows selected count / disables checkout
│   │       │   ├── types.ts
│   │       │   └── sample-data.ts
│   │       ├── product/
│   │       │   ├── product-card.tsx         # Hover swap + clickable store name link
│   │       │   ├── product-details.tsx
│   │       │   ├── types.ts
│   │       │   ├── categories.ts
│   │       │   ├── all-products.ts          # 12 products with picsum images
│   │       │   ├── sample-data.ts           # 6 products with picsum images
│   │       │   └── currency.ts              # formatLKR() helper
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
│   │       │   ├── shop-wizard.tsx           # Persists to localStorage on every step
│   │       │   ├── shop-name-step.tsx
│   │       │   ├── profile-picture-step.tsx
│   │       │   ├── image-cropper.tsx         # Canvas-based, no stretch bug
│   │       │   ├── contact-info-step.tsx
│   │       │   ├── social-media-step.tsx
│   │       │   ├── first-listing-step.tsx
│   │       │   └── approval-waiting-step.tsx
│   │       ├── seller-dashboard/
│   │       │   ├── seller-store.ts           # Central localStorage data layer
│   │       │   ├── shop-overview/shop-overview.tsx
│   │       │   ├── edit-profile/edit-profile.tsx
│   │       │   ├── products/products.tsx     # Full CRUD with image upload
│   │       │   ├── orders/orders.tsx         # Full OMS with 7-state flow
│   │       │   └── payouts/payouts.tsx       # Wallet, withdrawals, bank details
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
│   │           ├── post-management.tsx
│   │           ├── order-management.tsx
│   │           ├── customer-management.tsx
│   │           ├── customize-website.tsx
│   │           ├── banner-form-modal.tsx
│   │           └── banner-image-input.tsx
│   │
│   ├── assets/images/
│   │   ├── hero-image.png
│   │   ├── hero-image2.png
│   │   ├── hero-image3.png
│   │   └── hero-image4.png
│   │
│   ├── data/users.ts                        # Demo user accounts
│   └── lib/utils.ts                         # cn() class utility
│
├── public/
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
| `/products` | **Products Listing** — Search, category filter, sort by price/rating |
| `/products/[id]` | **Product Detail** — Image gallery, size/color picker, size guide, fit finder |
| `/cart` | **Shopping Cart** — Checkbox-selectable items, selective totals, checkout |
| `/checkout` | **Checkout** — Shipping details → payment → confirmation; creates seller order |
| `/signin` | **Sign In** — Email/password login |
| `/register` | **Register** — Full registration with validation |
| `/profile` | **User Profile** — Edit form (contact, postal code), order tracking timeline |
| `/seller` | **Seller Dashboard** — 5-tab: Overview, Profile, Products, Orders, Payouts |
| `/switch-to-selling` | **Seller Onboarding** — 6-step shop wizard with localStorage persistence |
| `/shop/[id]` | **Shop Storefront** — Seller-specific products, policies, follow button |
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
- **Logout always redirects to home page** (`/`) — applies from header menu, profile page, and seller dashboard

**Demo Credentials (see Section 14 for full user list):**

| Role | Email | Password |
|------|-------|----------|
| Customer | john.customer@example.com | password123 |
| Seller (Sarah) | sarah.seller@example.com | seller123 |
| Seller (Tech) | contact@techgadgets.com | tech123 |
| Seller (Artisan) | hello@artisancrafts.com | craft123 |

---

### 5.2 Shopping Cart with Selective Checkout

**Files:** `src/app/cart/page.tsx`, `src/ui/components/cart/`

- Add products with quantity, size, and color variants
- Remove individual items or clear the entire cart
- Update item quantities with stepper controls
- Cart item count badge on the header icon
- Persisted to `localStorage` key `ammoo-cart`

**Selective Checkout:**
- Each cart item has a **checkbox** — buyers can select/deselect specific items
- **"Select All"** checkbox with indeterminate state for partial selections
- Order summary totals update in real time to reflect **only selected items**
- "Proceed to Checkout" button shows count of selected items and is **disabled** when nothing is selected
- Selected item IDs are written to `sessionStorage` before navigating to checkout
- Checkout reads selected IDs, processes only those items, and removes only them from the cart after order — unselected items remain

**Cart Summary Calculations (for selected items):**

| Item | Logic |
|------|-------|
| Subtotal | Sum of (price × quantity) for selected items only |
| Shipping | Free if selected subtotal ≥ $50, else flat fee |
| Tax | 8% of selected subtotal |
| Total | Subtotal + shipping + tax |
| Savings | Sum of discounts from original prices |

---

### 5.3 Product Browsing & Discovery

**File:** `src/app/products/page.tsx`

- **Search bar** — Matches product name, creator, category, store, and tags
- **Category filter pills** — 10+ categories (Fashion, Accessories, Art, etc.)
- **Sort options** — Default, Price: Low to High, Price: High to Low, Rating
- **Product grid** — 2 columns (mobile) → up to 5 columns (desktop)
- Real-time filtering — results update instantly without page reload
- All product images use **seeded picsum.photos** for realistic portrait-ratio (3:4) photos

---

### 5.4 Product Detail Page

**File:** `src/ui/components/product/product-details.tsx`

- Image gallery with thumbnail strip (main + up to 4 additional images)
- **Hover image swap** on product cards — shows front/back view on hover
- **Clickable store name** on every product card links to the seller's shop page (`/shop/[slug]`)
- Size selector — XS, S, M, L, XL
- Color selector — Black, White, Navy, Gray
- Quantity stepper
- Add to cart with selected variant
- Discount badge (% off) and original/sale price display
- New arrival badge
- Trust badges — Free Shipping, Secure Payment, 30-Day Returns

**Size Guide Modal:**
- Bust, Waist, Hips, Length measurements per size
- Toggle between centimeters and inches

**Fit Finder Modal:**
- User inputs height, weight, body type
- BMI calculation used to auto-recommend a size

---

### 5.5 Checkout Flow

**File:** `src/app/checkout/page.tsx`

**Step 1 — Shipping Details:**
- First name, last name, email address
- Shipping address, city, postal code, country

**Step 2 — Payment Details:**
- Card number, expiry date, CVC
- Demo mode banner (no real charges)

**Confirmation:**
- Simulated 1.8-second processing delay
- Generated order number
- **Order saved to `localStorage`** via `seller-store.ts` — appears instantly in seller's OMS
- Only selected cart items are removed from cart; unselected items remain

---

### 5.6 Seller Onboarding (Shop Wizard)

**File:** `src/ui/components/shop-wizard/shop-wizard.tsx`

A 6-step guided wizard for new sellers:

| Step | Content |
|------|---------|
| 1 | Shop name only (3–50 characters, validated) |
| 2 | Profile picture (circle crop), cover photo (banner crop), ID photo upload (with ID type and ID number) |
| 3 | Contact info — NIC number, telephone, address |
| 4 | Social media links — Facebook, Instagram, Twitter, website URL |
| 5 | First product listing — name, category, price, description, front + back + gallery images |
| 6 | Approval waiting screen — confirmation with next steps |

**Key Features:**
- **localStorage persistence** — wizard progress (step + all form data) is saved on every change; refreshing the page restores exact position
- **Canvas-based image cropper** — drag + zoom crop preview using computed natural-image coordinates; no horizontal stretch on any aspect ratio
- Step progress indicator with mobile (progress bar) and desktop (dot/line) layouts
- File input with image preview and "click to change" overlay
- Per-step form validation before advancing

---

### 5.7 Seller Dashboard

**File:** `src/app/seller/page.tsx`

Accessible only to users with `role: "seller"`. Collapsible sidebar on desktop, hamburger on mobile.

**5 Navigation Tabs:**

| Tab | Content |
|-----|---------|
| Dashboard | Revenue, orders, products, followers stats; charts |
| Edit Profile | Shop name, description, contact info, social links |
| Products | Full CRUD product inventory with real image upload |
| Orders | Full 7-state OMS with timeline, tracking, notifications |
| Payouts | Wallet balance, withdrawal form, bank details, history |

**Products Tab:**
- Add / edit / delete products via modal forms
- **Real image upload** — file selected → converted to dataURL via `FileReader` → stored in localStorage and displayed on cards
- Drag-and-drop upload zone with preview and "Remove image" option
- Fields: name, description, category, price, original price, stock, status (active/inactive/draft), tags
- Stats strip: Total / Active / Out of Stock counts

---

### 5.8 Order Management System (OMS)

**File:** `src/ui/components/seller-dashboard/orders/orders.tsx`

Full order lifecycle management with a 7-state machine:

```
pending → on_hold → processing → packaged → shipped → completed
                ↘                                    ↗
                 cancelled (from any non-final state)
```

| Status | Badge Color | Meaning |
|--------|-------------|---------|
| Pending | Yellow | New order, awaiting action |
| On Hold | Orange | Temporarily paused |
| Processing | Blue | Being picked/packed |
| Packaged | Indigo | Ready for courier |
| Shipped | Purple | In transit (requires tracking number) |
| Completed | Green | Delivered and finalized |
| Cancelled | Red | Order voided |

**Features:**
- **Transition enforcement** — only valid next states shown per order (no skipping)
- **Shipping modal** — prompts for tracking number before marking as Shipped
- **Order detail modal** — full status timeline with connected dot indicator
- **Status filter pills** — filter by status with per-status order counts
- **Bell icon with unread count** — notification panel lists all buyer notifications triggered by status changes
- **Buyer notifications** written to `localStorage` on every status change (visible in buyer profile)
- Status history appended to each order on every transition

---

### 5.9 Payouts & Financials

**File:** `src/ui/components/seller-dashboard/payouts/payouts.tsx`

**Wallet Summary (3 cards):**
- **Total Earnings** — gross revenue from all orders
- **In Escrow** — revenue from processing/packaged/shipped orders (90% rate, held until complete)
- **Available** — completed order revenue × 90% platform fee minus paid-out transactions

**Withdrawal:**
- Minimum withdrawal limit: **$50** — warning banner shown when available balance is below
- Quick-select percentage buttons: 25% / 50% / 100% / Max
- Custom amount input
- Withdrawal creates a `PayoutTransaction` record in localStorage

**Bank Details Form:**
- Fields: Bank Name, Account Holder, Account Number, Routing Number, Account Type, IBAN
- View mode / edit mode toggle
- Saved per seller ID to localStorage

**Payout History Table:**
- Lists all transaction records with date, amount, and status badge

---

### 5.10 Individual Shop Pages

**File:** `src/app/shop/[id]/shop-client.tsx`

- Shop header — logo, banner image, shop name, description, location
- Shop stats — products count, followers, star rating
- **Follow / Unfollow** button
- 3 navigation tabs: Products | Shipping Info | Returns & Exchanges
- **Seller-aware product loading** — first checks `HARDCODED_SELLER_MAP` (maps slug → sellerId for demo shops), then dynamically looks up sellers by user ID or shop-name slug; loads that seller's `active + approved` products from `seller-store.ts`; falls back to up to 8 sample products if none found
- Product cards show seeded picsum images when seller products have no uploaded image
- Dynamic theme colors per shop (`shop-colors.ts`)

---

### 5.11 User Profile & Order Tracking

**File:** `src/app/profile/page.tsx`

Matches the site's light theme (`bg-gray-50`, white cards, standard Tailwind patterns).

**Profile Header:**
- Avatar with verification badge overlay
- Role badge and verified/unverified indicator

**Edit Profile Form (toggle):**
- Full Name, Email Address, **Contact Number** (required), City, **Postal Code**, Street Address
- Inline save with 700ms simulated persist

**Profile Details Panel:**
- Read-only view of all profile fields including new contact/postal fields

**My Orders Section:**
- Loads all orders from `seller-store.ts` filtered by `customer.email === user.email`
- Each order is a collapsible row showing ID, status badge, tracking number, date, item count, total
- **Expanded view** includes:
  - Line items with quantities, sizes, colors, and line totals
  - Order subtotal / shipping / total breakdown
  - Shipping address
  - **Status timeline** — connected dot indicator showing full history with timestamps

**Followed Shops:**
- Lists all shops the user follows with direct links

**Quick Actions:**
- Browse Products, View Cart, Wishlist — links matching site style

---

### 5.12 Admin Panel

**File:** `src/app/admin/page.tsx`

Fixed left sidebar with 7 sections:

| Section | Description |
|---------|-------------|
| Dashboard Overview | Platform-wide stats: total users, sellers, revenue, orders |
| Seller Management | Seller list — ban/suspend/activate, profile-change approval, payout requests tab |
| Post Management | Product approval workflow — approve/reject (with comment)/mark under review; rejected posts shown to seller |
| Order Management | All platform orders; tracking IDs; handover proof links; `adminReviewed` flag; modular `sendTrackingNotification()` stub |
| Customer Management | All customer accounts with order history and activity |
| User Management | Full user list — approve accounts, ban users |
| Customize Website | Banner editor with modal form, theme settings |

---

### 5.13 Notification System

**File:** `src/ui/components/notifications/notification-provider.tsx`

- Toast notifications for user feedback
- 4 severity types: **Success**, **Error**, **Warning**, **Info**
- Auto-dismiss after 5 seconds
- Max 5 simultaneous toasts, position top-right
- Used throughout — signin, register, add to cart, checkout, forms

**Buyer Order Notifications (separate system):**
- Written to `localStorage` (`ammoo-buyer-notifications`) on every OMS status change
- Accessible from the seller's Orders tab bell icon panel
- Readable in buyer profile order timeline

---

## 6. Component Library

### Layout
| Component | Purpose |
|-----------|---------|
| `MainLayout` | Root wrapper; conditionally renders navbar and footer |
| `Header` | Fixed top bar — logo, search input, cart icon with badge, user menu |
| `Navbar` | Category dropdown navigation below header |
| `Footer` | Site footer with links |
| `UserMenu` | Auth-aware dropdown — routes to home on logout |

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
| `ProductCard` | Card with hover image swap, discount badge, like button, add to cart, **clickable store link** |
| `ProductDetails` | Full detail view — gallery, variant picker, quantity, size guide, fit finder modals |

### Cart & Checkout
| Component | Purpose |
|-----------|---------|
| `CartItemCard` | Checkbox-selectable line item with image, name, variant, quantity stepper, remove |
| `CartSummaryCard` | Selected-item totals, shipping, tax; disabled checkout when nothing selected |

### Seller Dashboard
| Component | Purpose |
|-----------|---------|
| `ShopOverview` | Stats cards and charts |
| `EditProfile` | Shop info editor form |
| `Products` | Full CRUD inventory with drag-drop image upload |
| `Orders` | 7-state OMS with timeline, shipping modal, notification bell |
| `Payouts` | Wallet cards, withdrawal form, bank details, payout history |
| `seller-store.ts` | Central data layer — all localStorage read/write for orders, products, bank, transactions, notifications |

### Admin
| Component | Purpose |
|-----------|---------|
| `AdminSidebar` | Fixed left navigation (7 sections) |
| `DashboardOverview` | Metrics and KPIs |
| `UserManagement` | Searchable user table with action buttons |
| `SellerManagement` | Seller list — ban/suspend/activate, profile-change approval, payout requests |
| `PostManagement` | Product approval workflow — approve/reject/under_review |
| `OrderManagement` | All platform orders with tracking, handover proof, adminReviewed flag |
| `CustomerManagement` | All customers with order history and activity |
| `CustomizeWebsite` | Banner list and theme editor |
| `BannerFormModal` | Create/edit banner modal |
| `BannerImageInput` | File input with live preview and remove for banner images |

### User Profile
| Component | Purpose |
|-----------|---------|
| `ProfileHeader` | Avatar, verified badge, Back to Shop / Logout buttons |
| `AccountStatus` | 4-stat grid: wishlist count, orders, member since, followed shops |
| `FollowedShops` | Lists shops the user follows (resolved from user IDs in `followedShops` array) |
| `QuickActions` | Browse Products, View Cart, Wishlist shortcut links |

### Utilities
| Component | Purpose |
|-----------|---------|
| `Circle` | Animated floating decorative circle (hero section) |
| `InlineNotification` | Inline alert box (not a toast) |
| `ImageCropper` | Canvas-based crop with drag + zoom; uniform scale prevents stretch |

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
  shopName?: string;
  shopDescription?: string;
  wishlist?: number[];
  followedShops?: string[];
}
```

> **Note:** `city` and `postalCode` are not on the `User` interface. They are stored in `ammoo-user-overrides` via `UserProfileOverride` and merged at runtime via `(user as any).postalCode`.

### Product (Buyer-facing)

```typescript
interface Product {
  id: number;
  name: string;
  creator: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  image: string | StaticImageData;
  image2?: string | StaticImageData;
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

### SellerProduct (Seller-facing)

```typescript
type PostApprovalStatus = "pending" | "approved" | "rejected" | "under_review";

interface SellerProduct {
  id: number;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: "active" | "inactive" | "draft";  // "inactive" = out-of-stock/hidden
  image: string;        // dataURL from FileReader or picsum URL
  tags?: string[];
  createdAt: string;
  sales: number;
  approvalStatus: PostApprovalStatus;   // new/edited products default to "pending"
  rejectionComment?: string;            // set by admin when rejecting
}
```

### SellerOrder

```typescript
type OrderStatus =
  "pending" | "on_hold" | "processing" |
  "packaged" | "shipped" | "completed" | "cancelled";

interface SellerOrder {
  id: string;
  sellerId: string;
  customer: { name: string; email: string };
  products: Array<{
    name: string; image: string; quantity: number;
    price: number; size?: string; color?: string;
  }>;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: OrderStatus;
  paymentStatus: "paid" | "pending" | "failed";
  orderDate: string;
  shippingAddress: string;
  trackingNumber?: string;
  handoverProof?: string;   // base64 image; required when marking as shipped
  adminReviewed?: boolean;  // false whenever seller updates order; admin resets to true on view
  statusHistory: StatusHistoryEntry[];
}

interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}
```

### SellerProfile

```typescript
type SellerAccountStatus = "active" | "suspended" | "banned";

interface SellerProfile {
  sellerId: string;
  shopName?: string;
  shopDescription?: string;
  profileImage?: string;
  bannerImage?: string;
  email?: string;
  phone?: string;
  address?: string;
  courierService?: string;       // preferred courier (e.g. Koombiyo, DHL)
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  // Shop contact & policy fields
  shopAddress?: string;
  shopEmail?: string;
  shopPhone?: string;
  returnPolicy?: string;
  returnableitems?: string;
  nonReturnableItems?: string;
  exchangePolicy?: string;
  exchangeConditions?: string;
  returnSteps?: string;
  refundInfo?: string;
  contactEmail?: string;
  contactPhone?: string;
  // Sensitive-field change approval
  pendingProfileChanges?: Partial<SellerProfile>;
  profileChangeStatus?: "none" | "pending";  // "none" = no pending changes
}
```

### PayoutRequest

```typescript
interface PayoutRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  shopName: string;
  amount: number;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  bankDetails?: Partial<BankDetails>;
  adminNote?: string;
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
  originalPrice?: number | null;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  store: string;
  inStock: boolean;
}
```

### BankDetails

```typescript
interface BankDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  routingNumber: string;
  accountType: "checking" | "savings";
  iban?: string;
}
```

### PayoutTransaction

```typescript
interface PayoutTransaction {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  method: string;
}
```

### BuyerNotification

```typescript
interface BuyerNotification {
  id: string;
  orderId: string;
  buyerEmail: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "shipped" | "cancelled" | "on_hold" | "processing" | "completed" | "general";
}
```

### UserProfileOverride

```typescript
interface UserProfileOverride {
  profileImage?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  name?: string;
}
```

Stored in `ammoo-user-overrides` keyed by userId. Merged onto the static `User` object at login and hydration, providing editable profile fields that aren't in the hardcoded user array.

---

## 8. State Management & Persistence

All runtime state uses **React Context API** — no Redux, no Zustand.

**Provider nesting:**
- `CartProvider` — mounted in `src/app/layout.tsx` (root, wraps everything)
- `AuthProvider` + `NotificationProvider` — mounted inside `src/ui/layout/main-layout.tsx` (nested under CartProvider)

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

| Method | Description |
|--------|-------------|
| `login(email, password)` | Validates credentials, merges `ammoo-user-overrides`, sets user |
| `logout()` | Clears user and localStorage; callers redirect to `/` |
| `updateUser(partial)` | Merges partial into current user and persists to `ammoo-user-overrides` |

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
| `clearCart()` | Empties entire cart |
| `getCartItemCount()` | Returns total item count |
| `getCartTotal()` | Returns full subtotal (all items) |

### NotificationContext

```
Provider: src/ui/components/notifications/notification-provider.tsx
Hook:     useNotifications()
```

| Method | Description |
|--------|-------------|
| `showSuccess(message, title?)` | Green success toast — auto-dismisses after 5 s |
| `showError(message, title?)` | Red error toast — **does not auto-dismiss** (`autoClose: false`) |
| `showWarning(message, title?)` | Yellow warning toast — auto-dismisses after 5 s |
| `showInfo(message, title?)` | Blue info toast — auto-dismisses after 5 s |
| `showNotification(props)` | Raw notification — caller controls type and autoClose |
| `removeNotification(id)` | Dismiss a specific toast by ID |
| `clearAllNotifications()` | Dismiss all visible toasts |

### localStorage Keys

| Key | Contents |
|-----|---------|
| `userId` | ID string of logged-in user |
| `ammoo-cart` | JSON array of cart items |
| `ammoo-seller-orders` | JSON array of all seller orders (includes `handoverProof`, `adminReviewed`) |
| `ammoo-seller-products` | JSON array of all seller products (includes `approvalStatus`, `rejectionComment`) |
| `ammoo-seller-profiles` | Seller profile objects keyed by sellerId (includes `courierService`, pending changes) |
| `ammoo-seller-status` | Seller account status (`active`/`suspended`/`banned`) keyed by sellerId |
| `ammoo-payout-requests` | Array of payout request objects |
| `ammoo-user-overrides` | User profile overrides keyed by userId (profileImage, phone, etc.) |
| `ammoo-bank-details-{sellerId}` | Bank details object per seller |
| `ammoo-transactions-{sellerId}` | Payout transaction array per seller |
| `ammoo-buyer-notifications` | Array of buyer notification objects |
| `ammoo-tracking-notifications` | Modular tracking notification records (stub for future AI agent) |
| `ammoo-shop-wizard` | Shop wizard draft (step + all non-File form fields) |

### sessionStorage Keys

| Key | Contents |
|-----|---------|
| `ammoo-checkout-selected` | JSON array of selected cart item IDs (set at cart, read at checkout, deleted after order) |

---

## 9. Design System & Styling

### Tailwind CSS Configuration

**Custom Animations (`tailwind.config.js`):**

| Name | Duration | Behavior |
|------|----------|----------|
| `scroll` | 30s linear infinite | Horizontal auto-scroll (marquee) |
| `float` | 6s ease-in-out infinite | Gentle vertical bob (±20 px) |
| `float-slow` | 8s ease-in-out infinite | Slow vertical bob (±30 px) |
| `float-fast` | 4s ease-in-out infinite | Fast vertical bob (±15 px) |
| `float-very-fast` | 2s ease-in-out infinite | Very fast vertical bob (±10 px) |

### Color Palette

| Purpose | Color |
|---------|-------|
| Primary actions | Black (`#000`) |
| Page backgrounds | White (`#fff`), Gray-50 |
| Card backgrounds | White with `border border-gray-200` |
| Star ratings | Yellow-400 |
| Success states | Green-500 / Green-600 |
| Error states | Red-500 / Red-600 |
| Info states | Blue-500 |
| Warning states | Yellow-500 |
| Borders | Gray-100 / Gray-200 |
| Muted text | Gray-400 / Gray-500 |

### Typography Scale

- Headings: `text-xl` through `text-4xl`, `font-bold` or `font-semibold`
- Body: `text-sm` through `text-base`, `font-normal` or `font-medium`
- Labels: `text-xs`, `font-medium`, often uppercase + `tracking-wide`
- Monospace IDs: `font-mono`

### Component Design Patterns

- Cards: `bg-white rounded-xl border border-gray-200 p-6`
- Buttons: `rounded-lg px-4 py-2 font-medium transition-colors`
- Inputs: `rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-black`
- Modals: `fixed inset-0 bg-black/50 flex items-center justify-center`
- Status badges: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium`

---

## 10. Responsive Design

Mobile-first approach using Tailwind breakpoints:

| Breakpoint | Width | Layout Changes |
|------------|-------|---------------|
| Default (mobile) | < 640px | Single column, hamburger nav, progress bar steps |
| `sm` | 640px | 2-column grids, side-by-side form fields |
| `md` | 768px | Multi-column forms, step labels appear |
| `lg` | 1024px | Full navigation, sidebar layouts, 3-col grid |
| `xl` | 1280px | Maximum widths, 4–5 column product grids |

**Key Responsive Behaviors:**
- Header: hamburger on mobile, full nav on desktop
- Product grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
- Seller dashboard sidebar: collapsed/hamburger on mobile, fixed-left on desktop
- Shop wizard progress: bar (mobile), numbered dots with connector lines (desktop)
- Checkout form: single column (mobile), two-column (desktop)

---

## 11. Performance & Optimization

| Technique | Implementation |
|-----------|---------------|
| Static Export | `output: "export"` — builds pure HTML/CSS/JS, no server required |
| Code Splitting | Automatic per-page splitting by Next.js App Router |
| Server Components | Product and shop detail pages use server components for initial render |
| Static Params | `generateStaticParams()` pre-renders all product/shop pages at build time |
| Image Lazy Loading | Next.js `<Image>` with lazy load (`priority` on hero) |
| Unoptimized Images | `images: { unoptimized: true }` — allows external URLs (picsum) in static export |
| Turbopack | Dev server uses Turbopack for faster HMR |
| Tailwind Purging | Only used CSS classes included in production build |
| useMemo | Cart summary and checkout totals memoized to avoid recalculation on unrelated renders |

---

## 12. Configuration

### `next.config.ts`

```typescript
const isProd = process.env.NODE_ENV === "production";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

{
  output: "export",           // Static site generation
  trailingSlash: true,        // /products/ not /products
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",   // Needed for correct asset paths on sub-path hosts
  images: {
    unoptimized: true         // Required for static export + external image URLs
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

**Static export** — `npm run build` produces an `/out` directory of plain HTML/CSS/JS files.

| Host | Instructions |
|------|-------------|
| GitHub Pages | Push `/out` to `gh-pages` branch; `.nojekyll` already in `/public`; set `NEXT_PUBLIC_BASE_PATH` for sub-path hosting |
| Vercel | Connect repo; framework: Next.js; build command: `npm run build` |
| Netlify | Connect repo; publish directory: `out`; build command: `npm run build` |
| Any CDN | Upload `/out` directory contents |

---

## 14. Demo Data & Credentials

### Users (`src/data/users.ts`)

| Name | Email | Password | Role | ID |
|------|-------|----------|------|----|
| John Doe | john.customer@example.com | password123 | customer | user_001 |
| Sarah Johnson | sarah.seller@example.com | seller123 | seller | user_002 |
| Tech Gadgets Pro | contact@techgadgets.com | tech123 | seller | shop_003 |
| Artisan Crafts | hello@artisancrafts.com | craft123 | seller | shop_004 |

### Seller Demo Data (`seller-store.ts`)

Pre-seeded in localStorage on first load:

| Category | Count | Details |
|----------|-------|---------|
| Orders | 7 | One in each status (pending → cancelled); all for seller-sarah |
| Products | 5 | 3 active (approved), 1 inactive (approved), 1 draft (pending approval) |
| Bank Details | 1 | Commercial Bank of Ceylon demo account (Sarah Silva) |
| Transactions | 3 | All status "completed" — bank transfer payouts |

### Product Catalog

| File | Products | Image Source |
|------|---------|-------------|
| `sample-data.ts` | 6 | `picsum.photos/seed/{name}/300/400` |
| `all-products.ts` | 12 total (6 + 6 additional) | `picsum.photos/seed/{name}/300/400` |

### Shop Pages

| Shop Slug | Seller ID | Notes |
|-----------|-----------|-------|
| `/shop/sarahs-boutique` | seller-sarah | Loads Sarah's active+approved products from localStorage |
| `/shop/ammoo-arcade` | — | Hardcoded; falls back to 8 sample products |
| `/shop/tech-haven` | — | Hardcoded; falls back to 8 sample products |

---

## 15. Project Statistics

| Metric | Count |
|--------|-------|
| Pages / Routes | 15 |
| UI Component files (`src/ui/`) | 59 |
| App page files (`src/app/`) | 18 |
| Context Providers | 3 (Auth, Cart, Notifications) |
| TypeScript Interfaces / Types | 20+ |
| Button Variants | 6 component types |
| Seller Wizard Steps | 6 |
| Seller Dashboard Tabs | 5 (Overview, Profile, Products, Orders, Payouts) |
| OMS Order Statuses | 7 |
| Admin Panel Sections | 7 |
| Product Filter Categories | 10 (including "All") |
| Demo Users | 4 |
| Demo Shops | 3 |
| Demo Orders | 7 |
| Demo Products | 12 catalog + 5 seller |
| localStorage Keys | 13 |
| Custom Tailwind Animations | 5 |
| Production npm Dependencies | 4 |
| Dev Dependencies | 8 |
| Estimated Lines of Code | <!-- TODO: verify --> ~18,000+ |

---

## 16. Known Demo Limitations

| Limitation | Detail |
|-----------|--------|
| No real payment | Checkout accepts any card — no actual charge |
| No database | All data is hardcoded TypeScript or localStorage |
| No email | Verification pages are UI only — no emails sent |
| No password hashing | Passwords stored in plaintext in the demo user array |
| File uploads not server-persisted | Product images converted to dataURL and stored in localStorage; cleared on browser data wipe |
| No real search backend | Search is client-side filter on in-memory array |
| No real notifications | Buyer notifications are localStorage strings; no push/email/SMS |
| Single demo seller | All checkout orders are assigned to `seller-sarah` regardless of actual product owner |
| localStorage quota | Uploading many large images may approach 5–10 MB browser storage limit |

---

## Quick Reference — User Journeys

### Customer Journey
1. Browse `/` home page → hero, featured products, top sellers
2. Search or filter at `/products` → click product → view detail
3. Use Fit Finder / Size Guide on product detail page
4. Add to cart → open `/cart` → **select items** with checkboxes
5. Proceed to `/checkout` → fill shipping + payment → order confirmed
6. View order status and timeline in `/profile`

### Seller Journey
1. Register at `/register` → sign in at `/signin`
2. Go to `/switch-to-selling` → complete 6-step Shop Wizard (saves progress on refresh)
3. Access `/seller` dashboard → manage overview, profile, products (with image upload), orders, payouts
4. Process orders through OMS: pending → processing → packaged → shipped (add tracking number) → completed
5. Request payouts from wallet; manage bank details
6. Seller shop visible at `/shop/[id]`

### Admin Journey
1. Sign in → navigate to `/admin`
2. View platform stats (Dashboard)
3. **Seller Management** — ban/suspend sellers, approve/reject sensitive profile changes, manage payout requests
4. **Post Management** — approve/reject/mark-under-review seller product listings; rejected posts show comment to seller
5. **Order Management** — view all platform orders; see tracking IDs and handover proof; mark orders as reviewed
6. **Customer Management** — view all customers, order history, activity
7. Customize website banners and theme

---

*AMMOO ARCADE — Next.js 15 | React 19 | TypeScript | Tailwind CSS | Static Export*
*Last updated: June 9, 2026*
