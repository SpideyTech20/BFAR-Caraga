const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/v1/locations
router.post('/', async (req, res) => {
  const {
    region,
    province,
    municipality,
    barangay,
    coastal_type,
    fishing_area_name,
    management_area
  } = req.body;

  if (!province || !municipality || !barangay) {
    return res.status(400).json({
      success: false,
      message: 'Province, municipality, and barangay are required.'
    });
  }

  try {
    const sql = `
      INSERT INTO geographic_locations 
      (region, province, municipality, barangay, coastal_type, fishing_area_name, management_area)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      region || 'Region XIII (Caraga)',
      province,
      municipality,
      barangay,
      coastal_type || 'Coastal',
      fishing_area_name || null,
      management_area || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Location created successfully!',
      location_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/locations
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM geographic_locations ORDER BY province, municipality, barangay');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;