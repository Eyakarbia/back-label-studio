const express = require('express');
const session = require('express-session');
const app = express();
const mongoose = require('./app/config/db');

// Middleware to parse JSON request bodies
app.use(express.json());

// Configure session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Other routes and middleware...
app.use('/api', require('./app/router'));

app.listen(2000, () => {
    console.log('Server is running on port 2000');
});
