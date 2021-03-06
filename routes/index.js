const express = require("express");
const router = express.Router();
const { listEntries, saveEntry, getEntry } = require("../util");
const { check, validationResult } = require("express-validator");

const md = require("markdown-it")();

router.get("/edit/:entry", async (req, res) => {
  const markDown = await getEntry(req.params.entry);
  res.render("new-page", {
    title: "Edit Entry",
    markDown,
    name: req.params.entry,
    isEdit: true,
  });
});

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
  res.render("new-page", { title: "Create New Entry", isEdit: false });
});

// receive data from new-page

// router.post("/new-page", async (req, res) => {
//   let error = false;
//   let entries = await listEntries();
//   let content = req.body;

//   if (entries.includes(content.name)) {
//     error = "Title already exists";
//   }
//   if (content.content.length < 10) {
//     error = "Content is very short";
//   }
//   if (error === false) {
//     await saveEntry(content.name, content.content);
//     return res.redirect(`/wiki/${content.name}`);
//   }
//   // res.redirect(`/wiki/${content.name}`);

//   res.render(`new-entry`, {
//     title: content.title,
//     error,
//   });
// });
router.post(
  "/new-page",
  [
    check("name", "Title must be at least 3 characters long")
      .exists()
      .isLength({ min: 3 }),
    check("content", "Content is very short").exists().isLength({ min: 10 }),
  ],
  async (req, res) => {
    let body = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array());
      const alert = errors.array();
      res.render("new-page", {
        title: "Create New Entry",
        alert,
        isEdit: false,
      });
    }
    await saveEntry(body.name, body.content);
    return res.redirect(`/wiki/${body.name}`);
  }
);

// handling wrong URLs
router.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
module.exports = router;
