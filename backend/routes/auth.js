const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if username already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route (optional, if not added yet)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful', user: { username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});
// Example route in Express
router.post('/register-token', async (req, res) => {
  const { empnumber, token } = req.body;
  try {
    await pool.query(
      `INSERT INTO "DeviceTokens" ("EmpNumber", "Token") 
       VALUES ($1, $2)
       ON CONFLICT (EmpNumber) DO UPDATE SET Token = $2, UpdatedAt = CURRENT_TIMESTAMP`,
      [empnumber, token]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('Token Save Error:', err);
    res.status(500).send('Error saving token');
  }
});
module.exports = router;
