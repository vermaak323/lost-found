const express = require("express");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const db = require("./db");

const app = express();
const PORT = 3000;

/* -------------------- Middleware -------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "lostfound_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Make session user available to all EJS views
app.use((req, res, next) => {
  res.locals.user = req.session.userId || null;
  next();
});


app.use(express.static("public"));

app.set("view engine", "ejs");

/* -------------------- Multer Config -------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* -------------------- Auth Middleware -------------------- */
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

/* -------------------- Routes -------------------- */

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Register page
app.get("/register", (req, res) => {
  res.render("register");
});

// Handle register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("Email and password required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    (err) => {
      if (err) {
        return res.send("User already exists");
      }
      res.redirect("/login");
    }
  );
});

// Handle login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (!user) {
        return res.send("Invalid credentials");
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.send("Invalid credentials");
      }

      req.session.userId = user.id;
      res.redirect("/");
    }
  );
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Show add item form (PROTECTED)
app.get("/add", isAuthenticated, (req, res) => {
  res.render("add");
});

// Handle add item form (PROTECTED)
app.post("/add", isAuthenticated, upload.single("image"), (req, res) => {
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

// View all items
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
