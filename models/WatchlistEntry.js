const mongoose = require("mongoose");

const watchlistEntrySchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tmdbId:     { type: Number, required: true },
  title:      { type: String, required: true },
  type:       { type: String, enum: ["movie", "tv"], required: true },
  status:     {
    type: String,
    enum: ["watching", "completed", "plan to watch", "dropped"],
    default: "plan to watch"
  },
  rating:     { type: Number, min: 1, max: 10, default: null },
  notes:      { type: String, default: "" },
  posterPath: { type: String, default: null },
  tmdbRating: { type: Number, default: null },
  addedAt:    { type: Date, default: Date.now }
});

watchlistEntrySchema.index({ userId: 1, tmdbId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("WatchlistEntry", watchlistEntrySchema);
