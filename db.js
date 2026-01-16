const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("❌ DB connection error:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    category TEXT,
    location TEXT,
    date TEXT,
    description TEXT,
    image TEXT
  )
`);

});

module.exports = db;
