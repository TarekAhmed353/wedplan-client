# WedPlan (client)

WedPlan is a wedding planning platform. Couples browse wedding services and send booking requests. Vendors list their services, answer booking requests and can upgrade to Premium. Admins review services, manage users and see every payment.

This repository is the website, built with Next.js. The API lives in a separate repository.

## Links

- Live website: https://wedplan-client-taupe.vercel.app
- Live API: https://wedplan-server-ochre.vercel.app
- Client repository: https://github.com/TarekAhmed353/wedplan-client
- Server repository: https://github.com/TarekAhmed353/wedplan-server

## Important features

- Sign up and sign in with email and password, or with Google. Passwords need at least 6 characters with one uppercase and one lowercase letter.
- Choose to join as a customer or a vendor. Google users pick their role once after their first sign in. Admin accounts can only be created by a server script.
- Optional profile photo, uploaded to ImgBB.
- Browse services with word search, category and location filters, and price sorting (low to high, high to low).
- Service details with a photo gallery and a booking form. Signed-out visitors are sent to sign in first.
- Role-based dashboards with a sidebar. Typing another role's address sends you back to your own dashboard.
- Customer dashboard: overview numbers, My bookings with details and cancel for pending requests, Profile settings.
- Vendor dashboard: overview numbers, Add service, My services (edit, delete, switch on or off), Booking requests (accept or reject once), Subscription, Profile settings.
- Free vendors can have 3 active services. Premium ($9.99 per month through Stripe Checkout in test mode) removes the limit and adds a Premium badge. Premium is switched on only by a verified Stripe webhook.
- Admin dashboard: overview numbers, Manage users (search, filter by role, details, block and unblock), Manage services (search, filter, approve, reject, change status, delete) and a read-only Transactions page.
- Blocked users are signed out at once and cannot use protected features.
- Toast messages for every action, loading skeletons, friendly error and 404 pages, and Motion animations on the home page.
- Fully responsive on phone, tablet and desktop.

## Technology stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS 4 and shadcn/ui (Radix, Lucide icons), react-icons
- Better Auth with the MongoDB adapter and the JWT plugin
- MongoDB (shared with the API)
- Motion (Framer Motion) for home page animations
- Sonner for toast messages
- ImgBB for image hosting
- Deployed on Vercel

## How it works with the API

The browser signs in with Better Auth on this site. Before calling the API, it gets a short-lived JWT from `/api/auth/token` and sends it as `Authorization: Bearer <token>`. The API checks the token against this site's public keys at `/api/auth/jwks`, then loads the user's role and blocked status from the database. Roles are never taken from the request.

## Installation

You need Node.js 20 or newer, a MongoDB database, an ImgBB API key and a Google OAuth client.

```bash
git clone https://github.com/TarekAhmed353/wedplan-client.git
cd wedplan-client
npm install
```

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | What it is |
|---|---|
| `BETTER_AUTH_SECRET` | A long random string used to sign sessions |
| `BETTER_AUTH_URL` | The address of this site, for example `http://localhost:3000` |
| `MONGODB_URI` | MongoDB connection string (same database as the API) |
| `DB_NAME` | Database name, for example `wedplan` |
| `IMGBB_API_KEY` | ImgBB API key for photo uploads |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_API_URL` | Address of the API, for example `http://localhost:8000` |

In Google Cloud Console, add `http://localhost:3000` as an authorized JavaScript origin and `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.

## Run the project locally

Start the API first (see the server repository), then:

```bash
npm run dev
```

Open http://localhost:3000.

Other commands:

```bash
npm run lint
npm run build
npm start
```

## Testing payments

Payments use Stripe test mode. Use the card `4242 4242 4242 4242` with any future date, any CVC and any name. No real money is charged.
