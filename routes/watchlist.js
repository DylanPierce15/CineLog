const express = require("express");
const router  = express.Router();
const WatchlistEntry = require("../models/WatchlistEntry");

const IMG_BASE = "https://image.tmdb.org/t/p/w342";
const STATUSES = ["watching", "completed", "plan to watch", "dropped"];

function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

// Show watchlist, optionally filtered by status
router.get("/", requireLogin, async (req, res) => {
  const filter = { userId: req.session.userId };
  const statusFilter = req.query.status;
  if (statusFilter && STATUSES.includes(statusFilter)) filter.status = statusFilter;

  const entries = await WatchlistEntry.find(filter).sort({ addedAt: -1 });
  res.render("watchlist", {
    entries, statusFilter: statusFilter || "", statuses: STATUSES,
    username: req.session.username, imgBase: IMG_BASE
  });
});

// Add a new entry from search results
router.post("/add", requireLogin, async (req, res) => {
  const { tmdbId, title, type, posterPath, tmdbRating, status, rating, notes } = req.body;
  try {
    await WatchlistEntry.findOneAndUpdate(
      { userId: req.session.userId, tmdbId: Number(tmdbId), type },
      {
        title, posterPath: posterPath || null,
        tmdbRating: tmdbRating ? Number(tmdbRating) : null,
        status: STATUSES.includes(status) ? status : "plan to watch",
        rating: rating ? Number(rating) : null,
        notes: notes || ""
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch { /* ignore duplicate */ }
  res.redirect("/watchlist");
});

// Show edit form for an entry
router.get("/edit/:id", requireLogin, async (req, res) => {
  const entry = await WatchlistEntry.findOne({ _id: req.params.id, userId: req.session.userId });
  if (!entry) return res.redirect("/watchlist");
  res.render("edit", { entry, statuses: STATUSES, imgBase: IMG_BASE, error: null });
});

// Save edits
router.post("/edit/:id", requireLogin, async (req, res) => {
  const { status, rating, notes } = req.body;
  await WatchlistEntry.updateOne(
    { _id: req.params.id, userId: req.session.userId },
    {
      status: STATUSES.includes(status) ? status : "plan to watch",
      rating: rating ? Number(rating) : null,
      notes: notes || ""
    }
  );
  res.redirect("/watchlist");
});

// Delete an entry
router.post("/delete/:id", requireLogin, async (req, res) => {
  await WatchlistEntry.deleteOne({ _id: req.params.id, userId: req.session.userId });
  res.redirect("/watchlist");
});

module.exports = router;
