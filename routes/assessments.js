const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/v1/assessments
router.post('/', async (req, res) => {
  const {
    fisherfolk_id,
    engagement_status,
    is_senior_citizen,
    is_pwd,
    reason_for_status,
    date_of_assessment
  } = req.body;

  if (!fisherfolk_id) {
    return res.status(400).json({ success: false, message: 'Fisherfolk ID is required.' });
  }

  try {
    const sql = `
      INSERT INTO status_assessments 
      (fisherfolk_id, engagement_status, is_senior_citizen, is_pwd, reason_for_status, date_of_assessment)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      fisherfolk_id,
      engagement_status || 'Full-time fisherfolk',
      is_senior_citizen || false,
      is_pwd || false,
      reason_for_status || null,
      date_of_assessment || new Date().toISOString().split('T')[0]
    ]);

    res.status(201).json({
      success: true,
      message: 'Status assessment recorded successfully!',
      assessment_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/assessments/fisherfolk/:fisherfolk_id
router.get('/fisherfolk/:fisherfolk_id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM status_assessments WHERE fisherfolk_id = ?',
      [req.params.fisherfolk_id]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;