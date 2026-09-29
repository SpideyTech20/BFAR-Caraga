const express = require('express');
const router = express.Router();
const pool = require('../db'); //  Points to db.js at the root level

// GET /api/v1/assistance/:fisherfolk_id - Retrieve history and summary (Module 10)
router.get('/:fisherfolk_id', async (req, res) => {
  try {
    const { fisherfolk_id } = req.params;

    const recordsQuery = `
      SELECT * FROM assistance_records 
      WHERE fisherfolk_id = $1 
      ORDER BY date_received DESC;
    `;

    const summaryQuery = `
      SELECT 
        COUNT(assistance_id) AS total_assistance_received,
        COALESCE(SUM(estimated_value), 0) AS total_assistance_value,
        MAX(date_received) AS most_recent_assistance_date
      FROM assistance_records 
      WHERE fisherfolk_id = $1;
    `;

    const records = await db.query(recordsQuery, [fisherfolk_id]);
    const summary = await db.query(summaryQuery, [fisherfolk_id]);

    res.json({
      summary: summary.rows[0],
      records: records.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch assistance history' });
  }
});

// POST /api/v1/assistance - Add new government assistance record
router.post('/', async (req, res) => {
  try {
    const {
      fisherfolk_id, program_name, category, date_received,
      implementing_office, funding_source, quantity, unit,
      estimated_value, reference_document, status, remarks
    } = req.body;

    const sql = `
      INSERT INTO assistance_records (
        fisherfolk_id, program_name, category, date_received,
        implementing_office, funding_source, quantity, unit,
        estimated_value, reference_document, status, remarks
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;

    const values = [
      fisherfolk_id, program_name, category, date_received,
      implementing_office || 'BFAR Region XIII', funding_source, quantity,
      unit, estimated_value, reference_document, status || 'Distributed', remarks
    ];

    const result = await db.query(sql, values);
    res.status(201).json({ message: 'Assistance logged', record: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert assistance record' });
  }
});

module.exports = router;