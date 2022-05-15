const startPrompt = require('.');
const db = require('./db/connection');
const PORT = process.env.PORT || 3001;

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  startPrompt;
});