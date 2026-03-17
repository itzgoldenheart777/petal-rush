// ============================================================
//  PETAL RUSH — Firebase Configuration
//  !! REPLACE ALL VALUES BELOW WITH YOUR FIREBASE PROJECT !!
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAKnTHcyCx_JN06nyukCHGkldWIJh_IU0Y",
  authDomain: "petal-rush.firebaseapp.com",
  projectId: "petal-rush",
  storageBucket: "petal-rush.firebasestorage.app",
  messagingSenderId: "752572979194",
  appId: "1:752572979194:web:9da69860122fa24930b643"
};


// Initialize Firebase (compat SDK)
firebase.initializeApp(firebaseConfig);
const db      = firebase.firestore();
const auth    = firebase.auth();
const storage = firebase.storage();

// ── Utility helpers ──────────────────────────────────────────
const ROLES = { ADMIN: "admin", BUYER: "buyer", SELLER: "seller", DELIVERY: "delivery" };

async function getUserRole(uid) {
  const snap = await db.collection("users").doc(uid).get();
  return snap.exists ? snap.data().role : null;
}

function redirectByRole(role) {
  const map = {
    admin:    "admin.html",
    buyer:    "buyer.html",
    seller:   "seller.html",
    delivery: "delivery.html"
  };
  if (map[role]) window.location.href = map[role];
}

async function requireRole(expectedRole) {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async user => {
      if (!user) { window.location.href = "index.html"; return reject(); }
      const role = await getUserRole(user.uid);
      if (role !== expectedRole) { redirectByRole(role); return reject(); }
      resolve({ user, role });
    });
  });
}

function logout() {
  auth.signOut().then(() => window.location.href = "index.html");
}

// ── Payment split helper ──────────────────────────────────────
function calcSplit(total) {
  return {
    sellerShare:     Math.round(total * 0.80),
    deliveryShare:   Math.round(total * 0.10),
    adminCommission: Math.round(total * 0.10)
  };
}

// ── QR helpers (uses qrcode.js) ───────────────────────────────
function generateQR(containerId, text) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = "";
  new QRCode(el, { text, width: 180, height: 180, colorDark: "#E8196B", colorLight: "#fff" });
}

// ── Toast notification ────────────────────────────────────────
function showToast(msg, type = "success") {
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 3000);
}
