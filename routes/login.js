const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const bcrypt = require('bcrypt'); 

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const user = userResult.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;