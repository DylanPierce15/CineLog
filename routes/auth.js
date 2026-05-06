const express = require("express");
const router  = express.Router();
const User    = require("../models/User");

router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.render("register", { error: "Passwords do not match." });
  }
  try {
    const user = new User({ username, email, password });
    await user.save();
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect("/watchlist");
  } catch (err) {
    const msg = err.code === 11000 ? "Username or email already taken." : "Registration failed.";
    res.render("register", { error: msg });
  }
});

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render("login", { error: "Invalid email or password." });
    }
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect("/watchlist");
  } catch {
    res.render("login", { error: "Login failed. Try again." });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
