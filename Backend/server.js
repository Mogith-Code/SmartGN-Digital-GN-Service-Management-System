const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./src/config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// Ensure uploads directory exists
// ============================================================
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory at:', uploadsDir);
}

// ============================================================
// CORS — Allow frontend (Vite dev server) requests
// ============================================================
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================================
// Body parsers
// ============================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// Serve uploaded files as static assets
// ============================================================
app.use('/uploads', express.static(uploadsDir));

// ============================================================
// Health check route
// ============================================================
app.get('/', (req, res) => {
    res.json({
        message: 'SmartGN Backend API is running.',
        version: '1.0.0',
        endpoints: [
            '/api/auth', '/api/chat', '/api/residents', '/api/users',
            '/api/certificates', '/api/allowances', '/api/appointments',
            '/api/disasters', '/api/announcements',
            '/api/request-otp', '/api/verify-otp'
        ]
    });
});

// ============================================================
// Route Registrations
// ============================================================

// Auth & chat (existing)
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const chatRoutes = require('./src/routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Residents (profile, household, family, announcements for residents)
const residentRoutes = require('./src/routes/residentRoutes');
app.use('/api/residents', residentRoutes);

// / Officers (officer profile, dashboard stats)
const userRoutes = require('./src/routes/officerRoutes');
app.use('/api/officer', userRoutes);

// // Certificates
// const certificateRoutes = require('./src/routes/certificateRoutes');
// app.use('/api/certificates', certificateRoutes);

// Allowances
const allowanceRoutes = require('./src/routes/allowanceRoutes');
app.use('/api/allowances', allowanceRoutes);

// Appointments
const appointmentRoutes = require('./src/routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

// Disaster reports
const disasterRoutes = require('./src/routes/disasterRoutes');
app.use('/api/disasters', disasterRoutes);

// Announcements (separate prefix to match frontend fetch calls)
const announcementRoutes = require('./src/routes/announcementRoutes');
app.use('/api/announcements', announcementRoutes);

// OTP — Email One-Time Password generation & verification
const otpRoutes = require('./src/routes/otpRoutes');
app.use('/api', otpRoutes);

// ============================================================
// 404 handler for unknown API routes
// ============================================================
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// ============================================================
// Global error handler
// ============================================================
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal server error.', message: err.message });
});

// ============================================================
// Start Server
// ============================================================
async function startServer() {
    try {
        console.log('🔌 Connecting to database and verifying schemas...');
        await db.getPool();
        console.log('✅ Database connected and schemas verified.');

        app.listen(PORT, () => {
            console.log('');
            console.log('🚀 SmartGN Backend Server is running!');
            console.log(`📍 Local: http://localhost:${PORT}`);
            console.log('');
            console.log('📋 Default Credentials (Dev Mode):');
            console.log('   Admin    : admin / admin123');
            console.log('   Officer  : kamal_gn / password123');
            console.log('   Resident : nimal@example.com / password123');
            console.log('');
            console.log('📧 Email Mode: Console log (no SMTP configured)');
            console.log('   OTP codes will be printed here in the terminal.');
            console.log('');
        });
    } catch (error) {
        console.error('❌ Server startup failed:', error.message);
        process.exit(1);
    }
}

startServer();
