# Nebraska Football Silent Auction
### Real-Time Bidding · Firebase · GitHub Pages Deployment

---

## How Real-Time Bidding Works

Every bid is written to **Firebase Realtime Database** the instant a user clicks "Confirm Bid." All other open browsers receive that update automatically — no refresh needed. The admin panel, auction page, and homepage countdown all pull from the same live Firebase source.

**What lives in Firebase (shared by everyone):**
- All bids
- All registered accounts
- Auction close time (admin-adjustable in real time)

**What stays in the browser (private per user):**
- Login session (who you're signed in as)
- Guest info remembered across bids in the same session
- Admin password and admin session

---

## Step 1 — Set Up Firebase (15 minutes)

### 1a. Create the project
1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `huskers-auction` → Continue
3. Disable Google Analytics (not needed) → **Create project**

### 1b. Create the Realtime Database
1. Left sidebar → **Build → Realtime Database** → **Create database**
2. Select region: **us-central1**
3. Choose **Start in test mode** → Enable

### 1c. Get your config values
1. Click the gear icon → **Project settings** → **General**
2. Scroll to **Your apps** → click **</>** (Web app)
3. Register app name (e.g. `huskers-auction-web`) → **Register app**
4. Copy the `firebaseConfig` object — you'll need it in the next step

### 1d. Paste your config into `firebase-config.js`
Open `firebase-config.js` and replace every `PASTE_YOUR_...` placeholder:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",
  authDomain:        "huskers-auction.firebaseapp.com",
  databaseURL:       "https://huskers-auction-default-rtdb.firebaseio.com",
  projectId:         "huskers-auction",
  storageBucket:     "huskers-auction.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

### 1e. Seed the initial auction timing
In the Firebase console → **Realtime Database** → **Data tab** → click the **+** icon at the root:

| Path | Value |
|------|-------|
| `auction/settings/openTime` | `2026-06-24T10:00:00.000Z` |
| `auction/settings/closeTime` | `2026-06-24T20:00:00.000Z` |

### 1f. Set Database Rules (lock it down)
In Firebase → **Realtime Database** → **Rules** tab → paste this and **Publish**:

```json
{
  "rules": {
    "auction": {
      "settings": {
        ".read": true,
        ".write": false
      },
      "bids": {
        ".read": true,
        ".write": true
      },
      "accounts": {
        ".read": false,
        ".write": true,
        "$emailKey": {
          ".read": true
        }
      }
    }
  }
}
```

---

## Step 2 — Deploy to GitHub Pages

### 2a. Create the GitHub repository
1. Go to https://github.com → **New repository**
2. Name it `huskers-auction` (or anything you like)
3. Set to **Public** (required for free GitHub Pages)
4. Click **Create repository**

### 2b. Push the files
In a terminal, from the `huskers-auction/` folder:

```bash
git init
git add .
git commit -m "Nebraska Football Silent Auction — initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/huskers-auction.git
git push -u origin main
```

### 2c. Enable GitHub Pages
1. In your GitHub repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / folder: `/ (root)` → **Save**
4. After ~60 seconds, your site is live at:
   `https://YOUR_USERNAME.github.io/huskers-auction/`

### 2d. Update the outbid email link
In `backend/notify.js`, find `https://your-auction-url.com/auction.html` and replace it with your real GitHub Pages URL.

---

## Step 3 — Deploy the Notification Backend (Twilio + SendGrid)

> The front-end works fully without this step — bidding, accounts, and admin all work.
> This step is **only required** for SMS and email winner/outbid notifications.

### 3a. Install dependencies
```bash
cd backend
npm init -y
npm install express twilio @sendgrid/mail cors dotenv
```

### 3b. Create `.env` in the `backend/` folder
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+15551234567

SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=auction@yourdomain.com
FROM_NAME=Nebraska Football Auction

PORT=3000
```

### 3c. Get credentials
- **Twilio**: twilio.com → Console → Account SID + Auth Token → Buy a phone number
- **SendGrid**: sendgrid.com → Settings → API Keys → Create API Key (Full Access)
  - Also verify sender email under **Sender Authentication**

### 3d. Deploy the backend
Recommended free/cheap options:

| Platform | Free Tier | Notes |
|----------|-----------|-------|
| **Railway** | $5/mo credit | Easiest — connect GitHub repo, set env vars, done |
| **Render** | Free (spins down) | Fine for low-traffic notifications |
| **Fly.io** | Generous free tier | More configuration |

### 3e. Point the auction pages to your backend URL
In `auction.html` and `admin.html`, change `/api/notify-winner` and `/api/notify-outbid` to your deployed URL, e.g.:
```
https://huskers-auction-notify.railway.app/api/notify-winner
```

---

## File Summary

| File | Role |
|------|------|
| `index.html` | Homepage — hero, countdown, nav cards |
| `auction.html` | Live auction — accounts, bidding, real-time updates |
| `admin.html` | Admin panel — bid management, close time, CSV export |
| `firebase-config.js` | Firebase credentials (fill in your values) |
| `backend/notify.js` | Node.js server for Twilio SMS + SendGrid email |
| `README.md` | This file |

---

## Admin Panel

- URL: `https://YOUR_SITE/admin.html`
- Default password: `Huskers2026!`
- Change the password inside the admin panel → Settings

**Admin capabilities:**
- View live bid standings for all 10 items
- Extend or move the auction close time (updates instantly for all users)
- Close the auction manually
- Trigger winner notifications per item or all at once
- View all registered accounts and full bid history
- Export complete bid data as CSV

---

## Payment Information

Winners are directed to:
- **Check payable to:** Matt Rhule Football Camps LLC
- **Contact:** Logan Holgorsen — (531) 857-2638

---

## After the Auction Ends

1. Log into the admin panel
2. Use **Notify All Winners** to send SMS + email to every top bidder
3. Export the CSV for your records
4. Contact each winner to arrange payment and experience delivery
