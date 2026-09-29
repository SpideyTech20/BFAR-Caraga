const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/v1/boats - Register a new fishing boat
router.post('/', async (req, res) => {
  const {
    fisherfolk_id,
    boat_registration_no,
    boat_name,
    boat_type,
    boat_material,
    boat_length_ft,
    is_motorized,
    boat_status,
    estimated_value
  } = req.body;

  if (!fisherfolk_id) {
    return res.status(400).json({
      success: false,
      message: 'Fisherfolk ID is required.'
    });
  }

  try {
    const sql = `
      INSERT INTO fishing_boats (
        fisherfolk_id, boat_registration_no, boat_name, boat_type,
        boat_material, boat_length_ft, is_motorized, boat_status, estimated_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      fisherfolk_id,
      boat_registration_no || null,
      boat_name || null,
      boat_type || 'Motorized',
      boat_material || 'Fiberglass',
      boat_length_ft || 0.00,
      is_motorized !== undefined ? is_motorized : true,
      boat_status || 'Active',
      estimated_value || 0.00
    ]);

    res.status(201).json({
      success: true,
      message: 'Fishing boat registered successfully!',
      boat_id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Boat registration number already exists.'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/boats/fisherfolk/:fisherfolk_id - Get all boats owned by a fisherfolk
router.get('/fisherfolk/:fisherfolk_id', async (req, res) => {
  const { fisherfolk_id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM fishing_boats WHERE fisherfolk_id = ?',
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