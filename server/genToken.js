const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: 'test_uuid' }, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log('Valid Token:', token);
