const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const initializeDatabase = require('./routes/initDb');
const authRoutes = require('./routes/auth');
const fisherfolkRoutes = require('./routes/fisherfolk');
const assistanceRoutes = require('./routes/assistance');
const locationRoutes = require('./routes/locations');
const gearsRoutes = require('./routes/gears');
const boatsRoutes = require('./routes/boats');
const aquacultureRoutes = require('./routes/aquaculture');
const disasterRoutes = require('./routes/disasters');
const verifyToken = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend dashboard
app.use(express.static(path.join(__dirname, 'public')));

// Public Auth Route
app.use('/api/v1/auth', authRoutes);

// Protected API Routes
app.use('/api/v1/fisherfolk', verifyToken, fisherfolkRoutes);
app.use('/api/v1/assistance', verifyToken, assistanceRoutes);
app.use('/api/v1/locations', verifyToken, locationRoutes);
app.use('/api/v1/gears', verifyToken, gearsRoutes);
app.use('/api/v1/boats', verifyToken, boatsRoutes);
app.use('/api/v1/aquaculture', verifyToken, aquacultureRoutes);
app.use('/api/v1/disasters', verifyToken, disasterRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await initializeDatabase();
});