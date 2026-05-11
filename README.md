# CineLog

**Submitted by:** Dylan Pierce (dpierce5)
**Group Members:** Dylan Pierce (dpierce5)
**App Description:** Search movies and TV shows via the TMDB API and track them in a personal watchlist with status, personal rating, and notes.
**YouTube Video Link:** <!-- TODO: add demo video link -->
**APIs:** TMDB (https://developer.themoviedb.org/reference/intro/getting-started)
**Contact Email:** dpierce5@terpmail.umd.edu
**Deployed App Link:** https://cinelog-6zio.onrender.com/
**AI Use:** 1. Claude Code

---

## Features

- Search movies and TV shows via the TMDB API (posters, ratings, overviews)
- Add titles to a personal watchlist with a status, personal rating, and notes
- Filter watchlist by status: Watching, Completed, Plan to Watch, Dropped
- Edit or remove entries at any time
- User accounts with hashed passwords and persistent sessions

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root with:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `SESSION_SECRET` | Any long random string |
| `TMDB_API_KEY` | Free API key from [themoviedb.org](https://www.themoviedb.org/settings/api) |
| `PORT` | Optional, defaults to 3000 |

### 3. Run locally
```bash
npm run dev   # with nodemon (auto-restart)
npm start     # production
```

## Deployment (Render.com)

1. Push this project to a GitHub repo.
2. Create a new **Web Service** on Render, connect the repo.
3. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Add your environment variables in the Render dashboard (omit `PORT` — Render injects it).
5. In MongoDB Atlas, allow Render to connect via Network Access (`0.0.0.0/0` is simplest for the free tier).

## Project Structure

```
project/
├── server.js            Main Express app
├── .env                 Environment variables (not committed)
├── models/
│   ├── User.js          Mongoose user schema
│   └── WatchlistEntry.js  Mongoose watchlist schema
├── routes/
│   ├── auth.js          Register, login, logout
│   ├── search.js        TMDB search
│   └── watchlist.js     CRUD for watchlist entries
├── views/
│   ├── partials/nav.ejs  Shared navigation
│   ├── index.ejs        Landing page
│   ├── login.ejs
│   ├── register.ejs
│   ├── search.ejs
│   ├── watchlist.ejs
│   └── edit.ejs
└── public/
    └── style.css        Styles (Google Fonts, dark theme)
```
