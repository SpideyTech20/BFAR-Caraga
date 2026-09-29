// routes/initDb.js
const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function initializeDatabase() {
  try {
    const sqlPath = path.join(__dirname, '../db/schema.sql');
    if (!fs.existsSync(sqlPath)) return;

    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    // Split on semicolons to execute statements sequentially
    const queries = sqlScript
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    const connection = await pool.getConnection();
    for (const query of queries) {
      await connection.query(query);
    }
    connection.release();

    console.log('⚡ TiDB Database schema & tables initialized successfully!');
  } catch (err) {
    console.error(' Error executing schema in TiDB:', err.message);
  }
}

module.exports = initializeDatabase;