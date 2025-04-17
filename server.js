const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create or open DB
const db = new sqlite3.Database('./organization.db');

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    description TEXT,
    requirements TEXT,
    location TEXT,
    applyLink TEXT
  )
`);

// Add new activity
app.post('/activities', (req, res) => {
  const { name, type, description, requirements, location, applyLink } = req.body;
  db.run(`
    INSERT INTO activities (name, type, description, requirements, location, applyLink)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [name, type, description, requirements, location, applyLink], function(err) {
    if (err) return res.status(500).send(err);
    res.json({ id: this.lastID });
  });
});

// Get all activities
app.get('/activities', (req, res) => {
  db.all('SELECT * FROM activities', [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

// Delete activity
app.delete('/activities/:id', (req, res) => {
  db.run('DELETE FROM activities WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).send(err);
    res.json({ deleted: this.changes });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
