const express = require("express");
const router = express.Router();
const { listEntries, saveEntry, getEntry } = require("../util");
const md = require("markdown-it")();

// main page
router.get("/", async (req, res) => {
  let entries = await listEntries();
  const q = req.query.q;
  if (q) {
    entries = entries.filter((item) =>
      item.toLowerCase().includes(q.toLowerCase())
    );
  }

  res.render("index", { title: "Home", entries });
  // : JSON.stringify(entries)
});
router.get("/random", async (req, res) => {
  let entries = await listEntries();
  res.redirect(`/wiki/${entries[Math.floor(Math.random() * entries.length)]}`);
});
router.get("/wiki/:entry", async (req, res) => {
  const title = req.params.entry;
  const markDown = await getEntry(title);
  if (!markDown) {
    return res.status(404).render("404", { title: "404" });
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
router.post("/new-page", async (req, res) => {
  let error = false;
  let entries = await listEntries();
  let content = req.body;

  if (entries.includes(content.title)) {
    error = "Title already exists";
  }
  if (content.content.length < 10) {
    error = "Content is very short";
  }
  if (error === false) {
    await saveEntry(content.title, content.content)
  return res.redirect(`/wiki/${content.title}`)
}
  res.render(`new-entry`, {
    title: "New",
    content: JSON.stringify(content),
    error,
  });
});

// handling wrong URLs
router.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
module.exports = router;
