const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/v1/socioeconomic
router.post('/', async (req, res) => {
  const {
    fisherfolk_id,
    dependents_count,
    monthly_household_income,
    fisheries_income,
    housing_type,
    educational_attainment
  } = req.body;

  if (!fisherfolk_id) {
    return res.status(400).json({ success: false, message: 'Fisherfolk ID is required.' });
  }

  try {
    const sql = `
      INSERT INTO socioeconomic_profiles 
      (fisherfolk_id, dependents_count, monthly_household_income, fisheries_income, housing_type, educational_attainment)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        dependents_count = VALUES(dependents_count),
        monthly_household_income = VALUES(monthly_household_income),
        fisheries_income = VALUES(fisheries_income),
        housing_type = VALUES(housing_type),
        educational_attainment = VALUES(educational_attainment)
    `;

    await pool.query(sql, [
      fisherfolk_id,
      dependents_count || 0,
      monthly_household_income || 0.00,
      fisheries_income || 0.00,
      housing_type || null,
      educational_attainment || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Socioeconomic profile updated successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/socioeconomic/fisherfolk/:fisherfolk_id
router.get('/fisherfolk/:fisherfolk_id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM socioeconomic_profiles WHERE fisherfolk_id = ?',
      [req.params.fisherfolk_id]
    );
    res.json({ success: true, data: rows[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;