const express = require("express");
const path = require("path");
const multer = require("multer");
const db = require("./db");

const app = express();
const PORT = 3000;

/* -------------------- Middleware -------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

/* -------------------- Multer Config -------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* -------------------- Routes -------------------- */

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Show add item form
app.get("/add", (req, res) => {
  res.render("add");
});

// Handle add item form
app.post("/add", upload.single("image"), (req, res) => {
  const { name, type, category, location, date, description } = req.body;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  db.run(
    `INSERT INTO items (name, type, category, location, date, description, image)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, type, category, location, date, description, imagePath],
    (err) => {
      if (err) {
        console.error("Insert error:", err);
      }
      res.redirect("/items");
    }
  );
});

// View all items (with optional filter)
app.get("/items", (req, res) => {
  let query = "SELECT * FROM items";
  const params = [];

  if (req.query.type) {
    query += " WHERE type = ?";
    params.push(req.query.type);
  }

  db.all(query, params, (err, items) => {
    if (err) items = [];
    res.render("items", { items, query: req.query });
  });
});


// View item details
app.get("/items/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM items WHERE id = ?", [id], (err, item) => {
    if (!item) {
      return res.redirect("/items");
    }

    db.all(
      "SELECT * FROM items WHERE category = ? AND type != ?",
      [item.category, item.type],
      (err, matches) => {
        if (err) matches = [];
        res.render("detail", { item, matches });
      }
    );
  });
});

/* -------------------- Server -------------------- */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
