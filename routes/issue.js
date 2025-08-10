const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET / - Get all issues
router.get('/all', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM issues ORDER BY id');
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch issues' });
	}
});

module.exports = router;