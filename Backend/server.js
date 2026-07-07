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