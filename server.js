require("dotenv").config();
const express      = require("express");
const mongoose     = require("mongoose");
const session      = require("express-session");
const MongoStore   = require("connect-mongo");
const path         = require("path");

const authRoutes      = require("./routes/auth");
const searchRoutes    = require("./routes/search");
const watchlistRoutes = require("./routes/watchlist");

const app  = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => { console.error("MongoDB connection error:", err); process.exit(1); });

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
}));

// Make session username available to all views
app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  res.locals.userId   = req.session.userId   || null;
  next();
});

// Routes
app.get("/", (req, res) => res.render("index"));
app.use("/", authRoutes);
app.use("/search", searchRoutes);
app.use("/watchlist", watchlistRoutes);

// 404
app.use((req, res) => res.status(404).render("404"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
