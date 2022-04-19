const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // res.render('index')
  res.render("index", { title: "Home" });
});
router.get("/new-page", (req, res) => {
  res.render("new-page", { title: "Create New Entry" });
});

router.post("/new-page", (req, res) => {
  // res.render('new-page')
  res.render("new-page");
});
router.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
module.exports = router;
