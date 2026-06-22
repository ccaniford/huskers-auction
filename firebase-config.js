/**
 * firebase-config.js
 * ─────────────────────────────────────────────────────────────
 * STEP 1 — Create your Firebase project:
 *   1. Go to https://console.firebase.google.com
 *   2. Click "Add project" → name it (e.g. "huskers-auction")
 *   3. Disable Google Analytics (not needed) → Create project
 *
 * STEP 2 — Create a Realtime Database:
 *   1. Left sidebar → Build → Realtime Database → Create database
 *   2. Choose "Start in test mode" (we'll lock it down after setup)
 *   3. Pick us-central1 (closest to Nebraska)
 *
 * STEP 3 — Get your config:
 *   1. Project Settings (gear icon) → General → Your apps
 *   2. Click </> (Web) → Register app → name it → Copy the firebaseConfig object
 *   3. Paste the values into the object below
 *
 * STEP 4 — Set Realtime Database Rules (paste into Rules tab):
 * {
 *   "rules": {
 *     "auction": {
 *       "settings": {
 *         ".read": true,
 *         ".write": false
 *       },
 *       "bids": {
 *         ".read": true,
 *         ".write": true
 *       },
 *       "accounts": {
 *         ".read": false,
 *         ".write": true,
 *         "$email": {
 *           ".read": true
 *         }
 *       }
 *     }
 *   }
 * }
 *
 * STEP 5 — Seed the initial auction close time:
 *   In Realtime Database → Data tab → click + next to root node
 *   Path: auction/settings/closeTime
 *   Value: 2026-06-24T20:00:00.000Z
 *
 *   Path: auction/settings/openTime
 *   Value: 2026-06-24T10:00:00.000Z
 */

const FIREBASE_CONFIG = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://PASTE_YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId:         "PASTE_YOUR_PROJECT_ID",
  storageBucket:     "PASTE_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId:             "PASTE_YOUR_APP_ID"
};

// Default auction timing (used as fallback if Firebase not yet seeded)
const AUCTION_DEFAULTS = {
  openTime:  '2026-06-24T10:00:00.000Z',  // 5:00 AM CT
  closeTime: '2026-06-24T20:00:00.000Z'   // 3:00 PM CT
};
