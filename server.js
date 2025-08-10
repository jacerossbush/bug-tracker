const express = require('express');
const app = express();
const port = 3000;
const {pool, ensureUsersTable} = require('./db');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('server is running')
});

app.use('/register', registerRouter);

app.use('/login', loginRouter);

app.listen(port, async () => {
    await ensureUsersTable();
    console.log(`Server running at http://localhost:${port}`);
});