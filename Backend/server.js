const express = require('express');
const cors = require('cors');
const db = require('./db/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with support for frontend requests
app.use(cors());

// Body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test simple root route
app.get('/', (req, res) => {
  res.json({ message: 'SmartGN Authentication Service API is running.' });
});

// Import and mount authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Initialize DB and start server
async function startServer() {
  try {
    // This will trigger database creation, table setups, and seeding on startup
    console.log('Connecting to database and verifying schemas...');
    await db.getPool();
    
    app.listen(PORT, () => {
      console.log(`SmartGN Backend Server is running on port ${PORT}`);
      console.log(`Local address: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed due to database connection error:', error.message);
    process.exit(1);
  }
}

startServer();
