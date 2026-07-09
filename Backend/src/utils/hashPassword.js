// Password hashing utility placeholder
const bcrypt = require('bcryptjs');

module.exports = {
  hash: async (password) => bcrypt.hash(password, 10),
  compare: async (password, hashed) => bcrypt.compare(password, hashed)
};
