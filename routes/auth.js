const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// POST /api/v1/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simple authentication check (replace with DB lookup if needed)
  if (username === 'admin' && password === 'bfar2026') {
    const token = jwt.sign(
      { user: username, role: 'Administrator' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      success: true,
      message: 'Authentication successful',
      token
    });
  }

  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

module.exports = router;