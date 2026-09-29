const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/v1/fisherfolk - Register a new fisherfolk
router.post('/', async (req, res) => {
  let {
    fisherfolk_id,
    last_name,
    first_name,
    middle_name,
    extension_name,
    sex,
    date_of_birth,
    civil_status,
    contact_number,
    location_id,
    household_members_count,
    primary_occupation,
    secondary_occupation,
    primary_livelihood_source,
    secondary_livelihood_source,
    rsbsa_status,
    rsbsa_number,
    fisherfolk_reg_status,
    validation_status
  } = req.body;

  // Validate required fields based on TiDB schema
  if (!first_name || !last_name || !sex || !date_of_birth) {
    return res.status(400).json({
      success: false,
      message: 'First name, last name, sex, and date of birth are required fields.'
    });
  }

  // Auto-generate a unique fisherfolk_id if missing or empty
  if (!fisherfolk_id || fisherfolk_id.trim() === '') {
    fisherfolk_id = `CARAGA-${Date.now()}`;
  }

  try {
    const sql = `
      INSERT INTO fisherfolk (
        fisherfolk_id, last_name, first_name, middle_name, extension_name,
        sex, date_of_birth, civil_status, contact_number, location_id,
        household_members_count, primary_occupation, secondary_occupation,
        primary_livelihood_source, secondary_livelihood_source,
        rsbsa_status, rsbsa_number, fisherfolk_reg_status, validation_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      fisherfolk_id,
      last_name,
      first_name,
      middle_name || null,
      extension_name || null,
      sex,
      date_of_birth,
      civil_status || null,
      contact_number || null,
      location_id || null,
      household_members_count || 1,
      primary_occupation || null,
      secondary_occupation || null,
      primary_livelihood_source || null,
      secondary_livelihood_source || null,
      rsbsa_status || false,
      rsbsa_number || null,
      fisherfolk_reg_status || null,
      validation_status || 'For Validation'
    ]);

    res.status(201).json({
      success: true,
      message: 'Fisherfolk record registered successfully!',
      fisherfolk_id
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: `Fisherfolk ID '${fisherfolk_id}' already exists. Please provide a unique ID.`
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/v1/fisherfolk/clean-invalid - Purge blank/invalid primary key records
router.delete('/clean-invalid', async (req, res) => {
  try {
    const [result] = await pool.query(`
      DELETE FROM fisherfolk WHERE fisherfolk_id = '' OR fisherfolk_id IS NULL
    `);

    res.json({
      success: true,
      message: `Cleaned up ${result.affectedRows} invalid record(s).`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/fisherfolk - Fetch all fisherfolk
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, g.province, g.municipality, g.barangay 
      FROM fisherfolk f
      LEFT JOIN geographic_locations g ON f.location_id = g.location_id
      ORDER BY f.created_at DESC
    `);

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