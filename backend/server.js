const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔧 Force Content-Type to application/json for all API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT,
    display_order INTEGER
  )`);
});

// Routes

// 📩 Save contact
app.post('/api/contacts', (req, res) => {
  const { name, email, subject, message } = req.body;
  db.run(
    `INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)`,
    [name, email, subject, message],
    function (err) {
      if (err) {
        console.error('Error inserting contact:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('✅ Contact saved:', req.body);
      res.json({ success: true, id: this.lastID });
    }
  );
});

// 📜 Get contacts
app.get('/api/contacts', (req, res) => {
  db.all(`SELECT * FROM contacts ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) {
      console.error('Error fetching contacts:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('📤 Sending contacts:', rows);
    res.json(rows);
  });
});

// ❓ Get FAQs
app.get('/api/faqs', (req, res) => {
  db.all(`SELECT * FROM faqs ORDER BY display_order`, [], (err, rows) => {
    if (err) {
      console.error('Error fetching FAQs:', err.message);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).send(JSON.stringify({ error: err.message }));
    }
    console.log('📤 Sending FAQs:', rows);

    // ✅ Hard-force JSON headers and response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rows));
  });
});

// Serve Angular frontend in production
app.use(express.static(path.join(__dirname, '../frontend/dist/frontend/browser')));

// Fallback: send index.html for any unknown routes (Angular handles routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/frontend/browser/index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
