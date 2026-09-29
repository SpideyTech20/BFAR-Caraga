const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/v1/aquaculture
router.post('/', async (req, res) => {
  const {
    fisherfolk_id,
    culture_type,
    culture_facility,
    water_type,
    annual_production_kg,
    estimated_annual_income
  } = req.body;

  if (!fisherfolk_id) {
    return res.status(400).json({ success: false, message: 'Fisherfolk ID is required.' });
  }

  try {
    const sql = `
      INSERT INTO aquaculture_profiles 
      (fisherfolk_id, culture_type, culture_facility, water_type, annual_production_kg, estimated_annual_income)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      fisherfolk_id,
      culture_type || null,
      culture_facility || null,
      water_type || 'Freshwater',
      annual_production_kg || 0.00,
      estimated_annual_income || 0.00
    ]);

    res.status(201).json({
      success: true,
      message: 'Aquaculture profile created successfully!',
      profile_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/aquaculture/fisherfolk/:fisherfolk_id
router.get('/fisherfolk/:fisherfolk_id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM aquaculture_profiles WHERE fisherfolk_id = ?',
      [req.params.fisherfolk_id]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;