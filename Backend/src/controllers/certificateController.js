// certificateController.js — Full implementation
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const CertificateModel = require('../models/Certificate');

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';