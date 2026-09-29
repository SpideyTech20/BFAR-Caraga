const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/v1/gears - Register a new fishing gear for a fisherfolk
router.post('/', async (req, res) => {
  const {
    fisherfolk_id,
    gear_type,
    quantity,
    ownership,
    estimated_value
  } = req.body;

  if (!fisherfolk_id || !gear_type) {
    return res.status(400).json({
      success: false,
      message: 'Fisherfolk ID and gear type are required.'
    });
  }

  try {
    const sql = `
      INSERT INTO fishing_gears (fisherfolk_id, gear_type, quantity, ownership, estimated_value)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      fisherfolk_id,
      gear_type,
      quantity || 1,
      ownership || 'Owned',
      estimated_value || 0.00
    ]);

    res.status(201).json({
      success: true,
      message: 'Fishing gear added successfully!',
      gear_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/gears/fisherfolk/:fisherfolk_id - Get all gears registered to a specific fisherfolk
router.get('/fisherfolk/:fisherfolk_id', async (req, res) => {
  const { fisherfolk_id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM fishing_gears WHERE fisherfolk_id = ?',
      [fisherfolk_id]
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;