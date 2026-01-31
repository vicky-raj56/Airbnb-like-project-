# #MajorProject (Airbnb Clone)

Overview

- A small Airbnb-like web application built with Node.js, Express, MongoDB and EJS templates. It supports user authentication, listings, reviews, image uploads (Cloudinary), and basic CRUD operations.

# Key Features

- User authentication (Passport + passport-local-mongoose)
- Create / Read / Update / Delete listings
- Reviews on listings
- Image uploads via Cloudinary
- EJS server-rendered views

# Tech Stack

- Node.js, Express
- MongoDB (Mongoose)
- EJS + ejs-mate
- Passport for auth
- Cloudinary for image hosting

# Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

# Environment Variables
Create a `.env` file in the project root with values like:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/wanderlust
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Note: `server.js` reads `.env` using `dotenv`. The app will default to `mongodb://127.0.0.1:27017/wanderlust` if `MONGO_URI` is not set.

Install

```
npm install
```

Run (development)

```
npm run dev
```

This uses `nodemon` (see `package.json`).

Run (production)

```
node server.js
```

Seed demo data
To initialize seed data (listings), run:

```
node init/index.js
```

Ensure `MONGO_URI` is set before running the initializer.

# Project structure (high level)

- `server.js` — application entry
- `db/` — DB connection helper
- `models/` — Mongoose models
- `routes/` — Express routers
- `controllers/` — route handlers
- `views/` — EJS templates
- `public/` — static assets
- `configs/cloudinary.js` — Cloudinary setup
- `init/` — demo data initializer

Notes & Tips

- `server.js` currently uses a hard-coded session secret in `sessionOptions`. For production, replace it with an environment variable and keep the secret outside source control.
- `package.json` defines `start` and `dev` scripts; `start` currently points to `server.js` (you can change to `node server.js` if needed).

Contributing

- Open an issue or submit a PR. Keep changes focused and add tests where possible.

License

- (or choose a license)

---
