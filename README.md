# 📚 AI Study Helper — Complete Setup & Deployment Guide

Turn any homework file into AI-generated summaries, key points, flashcards, and quizzes.  
**Stack:** React · Node/Express · MongoDB Atlas · Stripe · Anthropic Claude · Nodemailer

---

## 📁 Folder Structure

```
ai-study-helper/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema + bcrypt + subscription helpers
│   │   └── StudyPack.js         # Study pack schema (summary, flashcards, quiz)
│   ├── middleware/
│   │   └── auth.js              # JWT protect + requireSubscription guards
│   ├── routes/
│   │   ├── auth.js              # POST /auth/signup  /auth/login  GET /auth/me
│   │   ├── payment.js           # POST /payment/create-checkout-session  /webhook
│   │   ├── upload.js            # POST /upload  (multer → text extract → AI)
│   │   ├── process.js           # POST /process/:id  GET /process/:id/status
│   │   ├── email.js             # POST /email/send/:id  (Nodemailer)
│   │   └── history.js           # GET /history  GET /history/:id  DELETE /history/:id
│   ├── utils/
│   │   ├── aiService.js         # Anthropic API wrapper → generateStudyPack()
│   │   └── fileExtractor.js     # pdf-parse + mammoth + plain text
│   ├── server.js                # Express app, CORS, rate-limiting, routes
│   ├── package.json
│   ├── .env.example
│   └── render.yaml              # (used at root level — see below)
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── _redirects           # Netlify SPA routing
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── hooks/
│   │   │   └── useAuth.js       # AuthContext + login/signup/logout
│   │   ├── pages/
│   │   │   ├── Home.js          # Landing page with features + pricing
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Payment.js       # Stripe checkout redirect
│   │   │   ├── Dashboard.js     # Study pack list + subscription status
│   │   │   ├── Upload.js        # Drag-and-drop file upload
│   │   │   └── StudyPackView.js # Summary / Key Points / Flashcards / Quiz tabs
│   │   ├── utils/
│   │   │   └── api.js           # Centralized fetch wrapper
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.js               # BrowserRouter + all routes
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── netlify.toml                 # Netlify build config
├── render.yaml                  # Render.com service config
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000; Render uses 10000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string for signing JWTs |
| `JWT_EXPIRES_IN` | Token TTL, e.g. `7d` |
| `ANTHROPIC_API_KEY` | Your Claude API key (sk-ant-...) |
| `STRIPE_SECRET_KEY` | Stripe secret (sk_live_... or sk_test_...) |
| `STRIPE_PRICE_ID` | Recurring $5/month price ID from Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook endpoint (whsec_...) |
| `SMTP_HOST` | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | `587` (TLS) or `465` (SSL) |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASS` | Gmail App Password (not your login password) |
| `SMTP_FROM` | Display name + email |
| `FRONTEND_URL` | Full URL of deployed frontend, e.g. `https://your-app.netlify.app` |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Your Render backend URL, e.g. `https://ai-study-helper-backend.onrender.com` |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (pk_live_... or pk_test_...) |

---

## 🚀 Step-by-Step Deployment

### 1 — MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → create a free M0 cluster
2. **Database Access** → add a user with password
3. **Network Access** → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)
4. **Connect** → Drivers → copy the connection string
5. Replace `<password>` in the string and paste into `MONGODB_URI`

---

### 2 — Anthropic API

1. Go to [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key
2. Copy it into `ANTHROPIC_API_KEY`

---

### 3 — Stripe Setup

#### Create a product and price
1. [dashboard.stripe.com](https://dashboard.stripe.com) → Products → Add Product
2. Name it "AI Study Helper Pro"
3. Add a price: $5.00 / month (recurring)
4. Copy the **Price ID** (e.g. `price_1OxxxYYY`) → `STRIPE_PRICE_ID`
5. API Keys → copy **Secret key** → `STRIPE_SECRET_KEY`
6. API Keys → copy **Publishable key** → `REACT_APP_STRIPE_PUBLISHABLE_KEY`

#### Configure the webhook (after deploying Render)
1. Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-backend.onrender.com/payment/webhook`
3. Events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

### 4 — Gmail App Password (Nodemailer)

1. Enable 2FA on your Google account
2. Google Account → Security → App Passwords
3. Select app: Mail, device: Other → Generate
4. Copy the 16-character password → `SMTP_PASS`

---

### 5 — Deploy Backend on Render.com

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Runtime:** Node
5. Add all environment variables from `backend/.env.example` in the **Environment** tab
6. Deploy → copy your service URL (e.g. `https://ai-study-helper-backend.onrender.com`)
7. Set `FRONTEND_URL` to your Netlify URL (add after step 6 below)

> **Free tier note:** Render free services spin down after 15 min inactivity. Upgrade to Starter ($7/mo) for always-on.

---

### 6 — Deploy Frontend on Netlify

#### Option A: Netlify UI (easiest)

1. Go to [app.netlify.com](https://app.netlify.com) → Add new site → Import from Git
2. Pick your GitHub repo
3. Build settings (auto-detected from `netlify.toml`):
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
4. Environment variables → Add:
   - `REACT_APP_API_URL` = your Render URL
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key
5. Deploy → copy your Netlify URL
6. Go back to Render → update `FRONTEND_URL` with this Netlify URL

#### Option B: Netlify CLI

```bash
npm install -g netlify-cli
cd frontend
npm run build
netlify deploy --prod --dir=build
```

#### Option C: GitHub Pages

```bash
# frontend/package.json — update "homepage" field:
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/ai-study-helper"

# Add gh-pages script (already in package.json):
npm install --save-dev gh-pages

cd frontend
npm run deploy   # runs predeploy (build) then gh-pages -d build
```

> **Note for GitHub Pages:** Since it doesn't support server-side routing, also add a `404.html` that redirects to `index.html`. Add this to `frontend/public/404.html`:
> ```html
> <!DOCTYPE html><script>window.location.href='/';</script>
> ```

---

## 🧪 Local Development

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env         # Fill in your values
npm install
npm run dev                  # nodemon server.js on :5000

# Terminal 2 — Frontend
cd frontend
cp .env.example .env         # Set REACT_APP_API_URL=http://localhost:5000
npm install
npm start                    # React dev server on :3000
```

---

## 📡 API Reference

| Method | Endpoint | Auth | Subscription | Description |
|--------|----------|------|--------------|-------------|
| POST | `/auth/signup` | — | — | Create account |
| POST | `/auth/login` | — | — | Get JWT token |
| GET | `/auth/me` | ✓ | — | Current user info |
| POST | `/payment/create-checkout-session` | ✓ | — | Redirect to Stripe |
| POST | `/payment/create-portal-session` | ✓ | — | Stripe billing portal |
| POST | `/payment/webhook` | — | — | Stripe webhook events |
| GET | `/payment/subscription-status` | ✓ | — | Check status |
| POST | `/upload` | ✓ | ✓ | Upload file → start AI |
| POST | `/process/:id` | ✓ | ✓ | Reprocess a pack |
| GET | `/process/:id/status` | ✓ | — | Poll processing status |
| POST | `/email/send/:id` | ✓ | ✓ | Email a study pack |
| GET | `/history` | ✓ | — | List all packs |
| GET | `/history/:id` | ✓ | — | Get single pack |
| DELETE | `/history/:id` | ✓ | — | Delete a pack |
| GET | `/health` | — | — | Health check |

---

## 🔒 Security Notes

- All passwords hashed with bcrypt (12 rounds)
- JWT expiry enforced; tokens never stored server-side
- File uploads validated by MIME type + 10 MB limit
- Temp files deleted immediately after text extraction
- Rate limiting: 100 req / 15 min per IP
- Stripe webhook signature verified with `constructEvent`
- CORS restricted to your frontend domain only

---

## 💡 Tips & Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS error | Make sure `FRONTEND_URL` in Render matches your exact Netlify URL (no trailing slash) |
| Stripe webhook 400 | Ensure `/payment/webhook` receives raw body — `express.raw()` is applied only to that route |
| AI returns invalid JSON | The `aiService.js` has a fallback regex extractor; check your `ANTHROPIC_API_KEY` is valid |
| Emails not sending | Use Gmail App Password (16 chars), not your Gmail login password; check `SMTP_PORT=587` |
| Render cold start | Upgrade to Render Starter ($7/mo) or add an uptime monitor (UptimeRobot free tier works) |
| Subscriptions not activating | Check Stripe webhook is registered and `STRIPE_WEBHOOK_SECRET` matches the endpoint secret |
