# 🌸 Petal Rush — Full Stack E-Commerce Web App

Multi-vendor flower marketplace with Buyer, Seller, Delivery Partner, and Admin panels.

---

## 📁 File Structure

```
petal-rush/
├── index.html          ← Login / Register
├── buyer.html          ← Buyer Panel (shop, cart, orders, reviews)
├── seller.html         ← Seller Panel (products, orders, earnings)
├── delivery.html       ← Delivery Partner Panel (pickups, QR scanner)
├── admin.html          ← Admin Panel (users, orders, payments, analytics)
├── firebase-config.js  ← Firebase configuration (FILL THIS IN)
└── README.md
```

---

## 🔥 Firebase Setup (Step-by-Step)

### 1. Create Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → Name it `petal-rush`
3. Disable Google Analytics (optional) → **Create project**

### 2. Enable Authentication
1. In Firebase Console → **Authentication** → **Get Started**
2. Enable **Email/Password** provider → Save

### 3. Create Firestore Database
1. **Firestore Database** → **Create database**
2. Start in **Test mode** (for development)
3. Choose a region → Done

### 4. Enable Storage
1. **Storage** → **Get Started** → **Next** → **Done**

### 5. Get Firebase Config
1. **Project Settings** (⚙️) → **Your apps** → Web app icon (`</>`)
2. Register app → Copy the `firebaseConfig` object

### 6. Fill in firebase-config.js
Open `firebase-config.js` and replace all `YOUR_*` values:

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

---

## 👑 Create First Admin Account

After running the app, register normally via `index.html`. Then in Firebase Console:

1. **Firestore** → `users` collection → find your document
2. Change `role` field from `"buyer"` to `"admin"`
3. Change `status` to `"active"`
4. Reload the page — you'll be redirected to Admin Panel

---

## 🔐 Firestore Security Rules

In Firebase Console → **Firestore** → **Rules**, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Products: anyone can read, sellers can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Orders: authenticated users only
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }

    // Payments: authenticated users only
    match /payments/{paymentId} {
      allow read, write: if request.auth != null;
    }

    // Reviews: authenticated users
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🚀 Running the App

### Option A: Local (simple)
1. Install [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Open `petal-rush/` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**

### Option B: Deploy to GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/petal-rush.git
git push -u origin main
```
Then in GitHub repo → **Settings** → **Pages** → Deploy from `main` branch.

### Option C: Deploy to Vercel
1. Push to GitHub (see above)
2. Go to [vercel.com](https://vercel.com) → Import the repo
3. No build config needed → Deploy!

---

## 🎮 How to Use Each Panel

| Panel | URL | Login Role |
|-------|-----|-----------|
| Login/Register | `index.html` | — |
| Buyer Shop | `buyer.html` | role: `buyer` |
| Seller Dashboard | `seller.html` | role: `seller` |
| Delivery Partner | `delivery.html` | role: `delivery` |
| Admin Panel | `admin.html` | role: `admin` |

### Buyer Flow
1. Register as **Buyer** → Browse products
2. Add to cart → Place order
3. Track order status
4. Leave reviews for delivered orders

### Seller Flow
1. Register as **Seller** → Wait for admin approval
2. Add products (with images)
3. Manage incoming orders → Update status
4. View earnings (80% of each order)

### Delivery Flow
1. Register as **Delivery Partner**
2. View available pickups (packed orders)
3. Accept pickup → Use QR scanner to confirm
4. Mark as delivered → Earn 10% per order

### Admin Flow
1. Manually set role to `admin` in Firestore
2. Approve sellers, manage all users
3. View all orders, update statuses
4. Monitor payment splits
5. View analytics

---

## 💳 Payment Split Logic

For every order:
| Recipient | Share |
|-----------|-------|
| 🏪 Seller | 80% |
| 🚴 Delivery Partner | 10% |
| 👑 Admin (Platform) | 10% |

Example: ₹1,000 order → Seller ₹800, Delivery ₹100, Admin ₹100

---

## 📱 Features

- ✅ Role-based authentication (Firebase Auth)
- ✅ Multi-vendor product catalog
- ✅ Shopping cart (localStorage)
- ✅ Order management with status tracking
- ✅ QR code generation for orders
- ✅ QR code scanner (camera-based)
- ✅ Payment split calculation
- ✅ Reviews & ratings
- ✅ Admin analytics dashboard
- ✅ Seller approval workflow
- ✅ Image upload to Firebase Storage
- ✅ Real-time Firestore updates

---

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend/DB**: Firebase (Firestore, Auth, Storage)
- **QR Generation**: qrcode.js
- **QR Scanning**: jsQR (camera)
- **Fonts**: Google Fonts (Playfair Display + Poppins)
- **Deployment**: GitHub Pages / Vercel
