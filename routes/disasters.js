const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/v1/disasters
router.post('/', async (req, res) => {
  const {
    fisherfolk_id,
    disaster_event_name,
    hazard_type,
    estimated_financial_loss,
    recovery_status
  } = req.body;

  if (!fisherfolk_id || !disaster_event_name) {
    return res.status(400).json({
      success: false,
      message: 'Fisherfolk ID and disaster event name are required.'
    });
  }

  try {
    const sql = `
      INSERT INTO disaster_impacts 
      (fisherfolk_id, disaster_event_name, hazard_type, estimated_financial_loss, recovery_status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      fisherfolk_id,
      disaster_event_name,
      hazard_type || 'Typhoon',
      estimated_financial_loss || 0.00,
      recovery_status || 'Pending'
    ]);

    res.status(201).json({
      success: true,
      message: 'Disaster impact record logged successfully!',
      impact_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/disasters/fisherfolk/:fisherfolk_id
router.get('/fisherfolk/:fisherfolk_id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM disaster_impacts WHERE fisherfolk_id = ?',
      [req.params.fisherfolk_id]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;