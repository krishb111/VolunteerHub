const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database
const db = new sqlite3.Database('./opportunities.db');
db.run(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location TEXT NOT NULL,
    applyLink TEXT NOT NULL
  )
`);

// POST new activity
app.post('/add-activity', (req, res) => {
  const { name, type, description, requirements, location, applyLink } = req.body;
  db.run(
    `INSERT INTO activities (name, type, description, requirements, location, applyLink)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, type, description, requirements, location, applyLink],
    function (err) {
      if (err) return res.status(500).send("Database error.");
      res.status(200).json({ id: this.lastID });
    }
  );
});

// GET all activities
app.get('/activities', (req, res) => {
  db.all(`SELECT * FROM activities`, [], (err, rows) => {
    if (err) return res.status(500).send("Database error.");
    res.json(rows);
  });
});

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/volunteer.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
