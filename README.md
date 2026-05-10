# 🌸 Petal Rush

> **Multi-vendor flower marketplace** — Order Flowers Like Never Before · Fresh · Fast · Beautiful

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Four Panels](#-four-panels)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [File Structure](#-file-structure)
- [Firebase Setup](#-firebase-setup)
- [Firestore Security Rules](#-firestore-security-rules)
- [Payment Split Logic](#-payment-split-logic)
- [Order Lifecycle](#-order-lifecycle)
- [User Flows](#-user-flows)
- [Running the App](#-running-the-app)
- [Deployment](#-deployment)

---

## 🌟 Overview

Petal Rush is a full-stack, mobile-first **multi-vendor flower marketplace** built with pure HTML, CSS, and Vanilla JavaScript, powered by Firebase. It features four completely independent panels for Buyers, Sellers, Delivery Partners, and Admins — all sharing a single Firestore database and real-time sync.

---

## 🎭 Four Panels

| Panel | File | Role | Description |
|-------|------|------|-------------|
| 🔐 Login / Register | `index.html` | — | Auth entry point, routes by role |
| 🛍️ Buyer | `buyer.html` | `buyer` | Browse, cart, order, track, review |
| 🏪 Seller | `seller.html` | `seller` | Products, orders, earnings, store |
| 🛵 Delivery | `delivery.html` | `delivery` | Pickups, QR scanner, earnings |
| 👑 Admin | `admin.html` | `admin` | Users, orders, payouts, analytics |

---

## ✅ Features

- 🔐 Role-based Firebase Authentication (buyer / seller / delivery / admin)
- 🌸 Multi-vendor product catalog with categories
- 🛒 Shopping cart (localStorage)
- 📦 Order management with full status tracking
- 📱 QR code generation per order (qrcode.js)
- 📷 QR code scanner via camera (jsQR)
- 🔢 6-digit delivery confirmation code
- 💸 Automatic payment split calculation (85 / 10 / 5)
- ⭐ Reviews & star ratings system
- 📊 Admin analytics dashboard with Chart.js
- 🏪 Seller approval workflow
- 🖼️ Image upload to Firebase Storage (up to 6 per product)
- ⚡ Real-time Firestore listeners
- 💰 Payout request system with income ledger
- 📢 Announcements broadcast to all panels
- 🌙 Dark mode with system preference sync
- 📲 PWA installable (offline support via Service Worker)
- 📥 CSV export for orders
- 💳 COD & Prepaid payment modes
- 📱 Mobile bottom nav + hamburger sidebar

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Database | Firebase Firestore (real-time) |
| Auth | Firebase Authentication (Email/Password) |
| Storage | Firebase Storage (product images) |
| QR Generation | [qrcode.js](https://davidshimjs.github.io/qrcodejs/) |
| QR Scanning | [jsQR](https://github.com/cozmo/jsQR) |
| Charts | [Chart.js](https://www.chartjs.org/) |
| Fonts | Google Fonts — Playfair Display + Poppins |
| Deployment | GitHub Pages / Vercel |

---

## 📁 File Structure

```
petal-rush/
├── index.html           ← Login / Register + role routing
├── buyer.html           ← Buyer panel (shop, cart, orders, reviews)
├── seller.html          ← Seller panel (products, orders, earnings)
├── delivery.html        ← Delivery partner panel (pickups, QR scanner)
├── admin.html           ← Admin panel (users, orders, payouts, analytics)
├── shared.css           ← Master CSS — mobile-first, dark mode, all panels
├── firebase-config.js   ← Firebase init + shared utility functions
├── mobile-patch.js      ← Sidebar, bottom-nav, table-wrap mobile helpers
├── manifest.json        ← PWA manifest
├── sw.js                ← Service worker (offline caching)
├── icon-192.png         ← PWA icon
├── icon-512.png         ← PWA icon
├── splash.png           ← PWA splash screen
└── Headerlogo.png       ← App logo
```

---

## 🔥 Firebase Setup

### 1 — Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → name it `petal-rush` → **Create project**

### 2 — Enable Authentication

1. **Authentication** → **Get Started**
2. Enable **Email/Password** provider → **Save**

### 3 — Create Firestore Database

1. **Firestore Database** → **Create database**
2. Start in **Test mode** (for development)
3. Choose a region → **Done**

### 4 — Enable Storage

1. **Storage** → **Get Started** → **Next** → **Done**

### 5 — Get Your Config

1. **Project Settings** ⚙️ → **Your apps** → Click the Web icon `</>`
2. Register app → Copy the `firebaseConfig` object

### 6 — Fill in `firebase-config.js`

```js
const firebaseConfig = {
  apiKey:            "AIza...",
  authDomain:        "petal-rush.firebaseapp.com",
  projectId:         "petal-rush",
  storageBucket:     "petal-rush.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123:web:abc123"
};
```

### 7 — Create First Admin Account

1. Register normally via `index.html`
2. In Firebase Console → **Firestore** → `users` collection → find your document
3. Change `role` from `"buyer"` → `"admin"`
4. Change `status` → `"active"`
5. Reload the page — you'll be redirected to the Admin panel

---

## 🔐 Firestore Security Rules

In Firebase Console → **Firestore** → **Rules**, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }

    match /payments/{paymentId} {
      allow read, write: if request.auth != null;
    }

    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 💳 Payment Split Logic

Every delivered order is automatically split:

| Recipient | Share | Example (₹1,000 order) |
|-----------|-------|------------------------|
| 🏪 Seller | 85% | ₹850 |
| 🛵 Delivery Partner | 10% | ₹100 |
| 👑 Admin (Platform) | 5% | ₹50 |

Configured in `firebase-config.js` → `calcSplit(total)`:

```js
function calcSplit(total) {
  return {
    sellerShare:     Math.round(total * 0.85),
    deliveryShare:   Math.round(total * 0.10),
    adminCommission: Math.round(total * 0.05)
  };
}
```

---

## 🔄 Order Lifecycle

```
🛒 Placed  →  ✅ Confirmed  →  📦 Packed  →  🚚 Shipped  →  📬 Delivered
                                                                    ↑
                                                          (QR / 6-digit code)
```

| Status | Who acts |
|--------|----------|
| `pending` | Buyer places order |
| `confirmed` | Seller confirms |
| `packed` | Seller packs, ready for pickup |
| `shipped` | Delivery partner picks up (QR scan) |
| `delivered` | Delivery confirms at buyer door (6-digit code) |
| `cancelled` | Seller or Admin |

---

## 👤 User Flows

<details>
<summary><strong>🛍️ Buyer Flow</strong></summary>

1. Register as **Buyer** via `index.html`
2. Browse the product catalog, filter by category
3. Add items to cart → adjust quantities
4. Checkout — enter delivery address, choose COD or Prepaid
5. Track order status in real-time
6. Receive a QR code — share with delivery partner at doorstep
7. Leave a review after delivery

</details>

<details>
<summary><strong>🏪 Seller Flow</strong></summary>

1. Register as **Seller** → account starts as `pending`
2. Admin approves → status becomes `active`
3. Set up store profile — name, logo, banner, bank/UPI details
4. Add products — name, price, stock, category, pickup address, up to 6 images
5. Manage incoming orders: Confirm → Pack → mark ready for pickup
6. View earnings (85% of each delivered order)
7. Request payout via UPI or bank transfer

</details>

<details>
<summary><strong>🛵 Delivery Partner Flow</strong></summary>

1. Register as **Delivery Partner**
2. Browse available pickups (orders with status `packed`)
3. Accept a pickup → go to seller location
4. Scan buyer QR or enter code to confirm pickup → status → `shipped`
5. Deliver to buyer → scan their QR → status → `delivered`
6. Earn 10% of each order value

</details>

<details>
<summary><strong>👑 Admin Flow</strong></summary>

1. Manually set role to `admin` in Firestore (one-time setup)
2. Approve or suspend seller accounts
3. View all orders — search, filter by status/payment, export CSV
4. Manage payouts — approve/reject requests, view income ledger, partner balances
5. Monitor revenue — 7-day chart, total / seller / delivery / net breakdown
6. Add products, manage categories
7. Broadcast announcements to all panels
8. Configure platform: UPI/bank info, commission %, delivery fees, feature toggles

</details>

---

## 🚀 Running the App

### Option A — Local (VS Code Live Server)

1. Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Open the `petal-rush/` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**

### Option B — Simple HTTP server (Python)

```bash
cd petal-rush
python -m http.server 8000
# open http://localhost:8000
```

---

## 📦 Deployment

### GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/petal-rush.git
git push -u origin main
```

Then: repo **Settings** → **Pages** → Deploy from `main` branch root → **Save**

### Vercel

1. Push to GitHub (see above)
2. Go to [vercel.com](https://vercel.com) → **Import project**
3. Select your repo → no build config needed → **Deploy**

---

## 🗄️ Firestore Collections

| Collection | Key Fields |
|-----------|-----------|
| `users` | name, email, role, status, storeName, bank, earnings |
| `orders` | userId, sellerId, items[], totalAmount, status, deliveryCode |
| `products` | name, price, stock, category, sellerId, images[], pickupAddress |
| `categories` | name, icon, slug |
| `payoutRequests` | sellerId, amount, method, status, paymentInfo |
| `reviews` | productId, userId, rating, comment |
| `announcements` | title, message, target, color |
| `settings` | general, fees, payment (sub-documents) |

---

## ⚠️ Important Notes

> **API Key Security** — Your Firebase config is exposed client-side. Before going to production, restrict your API keys in [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → set allowed domains.

> **Firestore Rules** — The current rules allow any authenticated user to write orders/products. Tighten these with role-based checks before launch.

> **Split Consistency** — Ensure `calcSplit()` in `firebase-config.js` and the Admin Settings page show the same percentages.

---

## 📄 License

MIT © [itzgoldenheart777](https://github.com/itzgoldenheart777)

---

<p align="center">Made with 🌸 and Firebase</p>
