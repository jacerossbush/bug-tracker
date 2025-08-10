const express = require('express');
const app = express();
const port = 3000;
const {pool, ensureUsersTable} = require('./db');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const authenticateToken = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('server is running')
});

app.use('/register', registerRouter);
app.use('/login', loginRouter);

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You are authenticated', user: req.user });
});


app.listen(port, async () => {
    await ensureUsersTable();
    console.log(`Server running at http://localhost:${port}`);
});