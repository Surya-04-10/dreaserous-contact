const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

const faqs = [
  { question: "What services does Dreaserous Productions offer?", answer: "We provide video production, post-production, and content strategy.", order: 1 },
  { question: "How do I request a quote?", answer: "Use the contact form on this page and choose 'General' or 'Partnership' as the subject.", order: 2 },
  { question: "What is your typical turnaround time?", answer: "Turnaround depends on scope — typically 7–21 business days.", order: 3 },
  { question: "Do you accept remote projects?", answer: "Yes — we work locally and remotely with clients worldwide.", order: 4 },
  { question: "What payment methods do you accept?", answer: "Bank transfer and major cards are accepted.", order: 5 }
];

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT,
    display_order INTEGER
  )`);

  const stmt = db.prepare("INSERT INTO faqs (question, answer, display_order) VALUES (?, ?, ?)");
  for (const f of faqs) {
    stmt.run(f.question, f.answer, f.order);
  }
  stmt.finalize(() => {
    console.log('Seeded FAQs.');
    db.close();
  });
});
