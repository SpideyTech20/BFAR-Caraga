const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const initializeDatabase = require('./routes/initDb');
const authRoutes = require('./routes/auth');
const fisherfolkRoutes = require('./routes/fisherfolk');
const assistanceRoutes = require('./routes/assistance');
const locationRoutes = require('./routes/locations');
const verifyToken = require('./middleware/auth'); // Import Auth Middleware

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Public Route (Generate Token)
app.use('/api/v1/auth', authRoutes);

// Protected API Routes (Requires Bearer Token)
app.use('/api/v1/fisherfolk', verifyToken, fisherfolkRoutes);
app.use('/api/v1/assistance', verifyToken, assistanceRoutes);
app.use('/api/v1/locations', verifyToken, locationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await initializeDatabase();
});