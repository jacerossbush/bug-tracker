require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

async function ensureDefaultTables() {
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    const createIssuesTableQuery = `
        CREATE TABLE IF NOT EXISTS issues (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
            assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
            status_id INTEGER NOT NULL,
            priority VARCHAR(50),
            due_date TIMESTAMP,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            closed_at TIMESTAMP
        );
    `;
    try {
        await pool.query(createUsersTableQuery);
        await pool.query(createIssuesTableQuery);
        console.log('Checked for users and issues tables (created if missing)');
    } catch (err) {
        console.error('Error ensuring tables:', err);
        process.exit(1);
    }
}

module.exports = {pool, ensureDefaultTables};