const express = require('express');
const app = express();
const mongoose = require('./app/config/db');

app.use(express.json()); // Ensure JSON parsing middleware is enabled

// Other routes and middleware...

app.use('/api', require('./app/router'));

app.listen(2000, () => {
    console.log('Server is running on port 2000');
});
