const express = require("express");
const router = express.Router();
const { listEntries, saveEntry, getEntry } = require("../util");
const md = require("markdown-it")();

// main page
router.get("/", async (req, res) => {
  const entries = await listEntries();
  console.log(req.query.q);
  console.log(entries)
  res.render("index", { title: "Home", entries });
  // : JSON.stringify(entries)
});

router.get("/wiki/:entry", async (req, res) => {
  const title = req.params.entry;
  const markDown = await getEntry(title);
  if (!markDown) {
    return res.render("entry", { title: "404", content: "Entry NOT found" });
  }
  const content = md.render(markDown);
  req.app.set("layout", "layouts/layout2");
  res.render("entry", { title, content });
  // res.send(req.params.entry);
  req.app.set("layout", "layouts/layout");
});

// new entry page
router.get("/new-page", (req, res) => {
  res.render("new-page", { title: "Create New Entry" });
});

// receive data from new-page
router.post("/new-page", (req, res) => {
  res.render("new-page");
});

// handling wrong URLs
router.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
module.exports = router;
