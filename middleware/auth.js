const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from Header: "Authorization: Bearer <token>"
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: No Bearer Token Provided'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // Pass control to the next route handler
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid or Expired Token' });
  }
};