const express = require('express');
const app = express();
const mongoose = require('./app/config/db');

app.use(express.json()); // For parsing application/json

app.use('/health', (req, res) => {
    res.send('Server is running');
});

app.use('/api', require('./app/router'));

app.listen(2000, () => {
    console.log('Server is running on port 2000');
});

