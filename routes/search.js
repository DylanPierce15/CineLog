const express = require("express");
const router  = express.Router();
const fetch   = require("node-fetch");

const TMDB_BASE  = "https://api.themoviedb.org/3";
const IMG_BASE   = "https://image.tmdb.org/t/p/w342";

function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

router.get("/", requireLogin, async (req, res) => {
  const query = (req.query.q || "").trim();
  const type  = req.query.type === "tv" ? "tv" : "movie";

  if (!query) {
    return res.render("search", { results: [], query: "", type, imgBase: IMG_BASE, error: null });
  }

  try {
    const url = `${TMDB_BASE}/search/${type}?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`;
    const resp = await fetch(url);
    const data = await resp.json();

    const results = (data.results || []).slice(0, 20).map(item => ({
      tmdbId:     item.id,
      title:      item.title || item.name,
      type,
      posterPath: item.poster_path ? IMG_BASE + item.poster_path : null,
      tmdbRating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
      year:       (item.release_date || item.first_air_date || "").slice(0, 4),
      overview:   item.overview
    }));

    res.render("search", { results, query, type, imgBase: IMG_BASE, error: null });
  } catch {
    res.render("search", { results: [], query, type, imgBase: IMG_BASE, error: "Failed to reach TMDB. Try again." });
  }
});

module.exports = router;
