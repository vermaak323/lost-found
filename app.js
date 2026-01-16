const express = require("express");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


const DATA_FILE = "./data/items.json";

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Add Item Page
app.get("/add", (req, res) => {
  res.render("add");
});

// Save Item
app.post("/add", (req, res) => {
  const items = JSON.parse(fs.readFileSync(DATA_FILE));
  const newItem = {
    id: Date.now(),
    ...req.body
  };
  items.push(newItem);
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
  res.redirect("/items");
});

// View All Items
app.get("/items", (req, res) => {
  let items = JSON.parse(fs.readFileSync(DATA_FILE));

  if (req.query.type) {
    items = items.filter(i => i.type === req.query.type);
  }

  res.render("items", { items });
});


// Item Detail
app.get("/items/:id", (req, res) => {
  const items = JSON.parse(fs.readFileSync(DATA_FILE));
  const item = items.find(i => i.id == req.params.id);

  const matches = items.filter(i =>
    i.category === item.category &&
    i.type !== item.type
  );

  res.render("detail", { item, matches });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
