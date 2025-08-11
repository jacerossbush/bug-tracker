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

router.post('/new', async (req, res) => {
	const { title, description, assigned_to, status_id, priority, due_date } = req.body;
	const user = req.user.userId;
	const assigned = assigned_to ?? user;
	if (!title || !description || !status_id || !priority || !user || !assigned || !due_date) {
		return res.status(400).json({ error: 'Missing Required Issue fields.' });
	}
	try {
		const insertResult = await pool.query(
			`INSERT INTO issues (title, description, created_by, assigned_to, status_id, priority, due_date)
			 VALUES ($1, $2, $3, $4, $5, $6, $7)
			 RETURNING id`,
			[title, description, user, assigned, status_id, priority, due_date]
		);
		const newIssueId = insertResult.rows[0].id;
		res.status(201).json({ message: 'Issue created successfully', id: newIssueId });
	} catch (err) {
		res.status(500).json({ error: 'Issue failed to create' });
	}
});

module.exports = router;