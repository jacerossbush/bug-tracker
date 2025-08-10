const express = require('express');
const app = express();
const port = 3000;
const {pool, ensureUsersTable} = require('./db');
const bcrypt = require('bcrypt');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('server is running')
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    try {
        // Check if username already exists
        const userCheck = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [username, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.listen(port, async () => {
    await ensureUsersTable();
    console.log(`Server running at http://localhost:${port}`);
});