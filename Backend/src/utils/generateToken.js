// Generate JWT Token helper placeholder
const jwt = require('jsonwebtoken');

module.exports = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321', {
    expiresIn: '24h'
  });
};
