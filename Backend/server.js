const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./src/config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, 'uploads');
// Resident photo directories
const profileDir = path.join(uploadsDir, 'profile');
const nicFrontDir = path.join(uploadsDir, 'nic_front');
const nicBackDir = path.join(uploadsDir, 'nic_back');
// GN Officer photo directories
const gnProfileDir = path.join(uploadsDir, 'gn_profile');
const gnFrontDir = path.join(uploadsDir, 'gn_front');
const gnBackDir = path.join(uploadsDir, 'gn_back');

[uploadsDir, profileDir, nicFrontDir, nicBackDir, gnProfileDir, gnFrontDir, gnBackDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});
console.log('✅ Uploads and subdirectories initialized at:', uploadsDir);

// CORS Configuration - Support frontend cross-origin access in local and production
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

// Silence favicon 404 logs
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Determine frontend dist directory if built
const frontendDistPath = path.join(__dirname, '../SmartGN/dist');
const localDistPath = path.join(__dirname, 'dist');
const distDir = fs.existsSync(frontendDistPath) ? frontendDistPath : (fs.existsSync(localDistPath) ? localDistPath : null);

if (distDir) {
    app.use(express.static(distDir));
    console.log('✅ Serving frontend static build from:', distDir);
}

app.get('/', (req, res) => {
    if (distDir && req.headers.accept && req.headers.accept.includes('text/html')) {
        return res.sendFile(path.join(distDir, 'index.html'));
    }
    res.json({
        status: 'success',
        message: 'SmartGN Backend API is running.',
        version: '1.0.0',
        endpoints: [
            '/api/auth', '/api/chat', '/api/residents', '/api/officer',
            '/api/certificates', '/api/allowances', '/api/appointments',
            '/api/disasters', '/api/announcements'
        ]
    });
});

// Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const chatRoutes = require('./src/routes/chatRoutes');
app.use('/api/chat', chatRoutes);

const residentRoutes = require('./src/routes/residentRoutes');
app.use('/api/residents', residentRoutes);

const userRoutes = require('./src/routes/officerRoutes');
app.use('/api/officer', userRoutes);

// Certificate routes - UNCOMMENTED
const certificateRoutes = require('./src/routes/certificateRoutes');
app.use('/api/certificates', certificateRoutes);

const allowanceRoutes = require('./src/routes/allowanceRoutes');
app.use('/api/allowances', allowanceRoutes);

const appointmentRoutes = require('./src/routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

const disasterRoutes = require('./src/routes/disasterRoutes');
app.use('/api/disasters', disasterRoutes);

const announcementRoutes = require('./src/routes/announcementRoutes');
app.use('/api/announcements', announcementRoutes);

app.use('/api/*', (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// SPA wildcard fallback for all non-API GET requests
if (distDir) {
    app.get('*', (req, res, next) => {
        if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
            return next();
        }
        res.sendFile(path.join(distDir, 'index.html'));
    });
}

app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal server error.', message: err.message });
});

async function startServer() {
    try {
        console.log('Connecting to database...');
        await db.getPool();
        console.log('Database connected and schemas verified.'); 

        app.listen(PORT, () => {
            console.log('');
            console.log('SmartGN Backend Server is running!');
            console.log(`Local: http://localhost:${PORT}`);
            console.log('');
            console.log('Default Credentials (Dev Mode):');
            console.log('   Admin    : admin / admin123');
            console.log('   Officer  : kamal_gn / password123');
            console.log('   Resident : nimal@example.com / password123');
            console.log('');
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
}

startServer();