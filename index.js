const express = require('express');
const session = require('express-session');
const cors = require('cors'); // Import the CORS package
const app = express();
const mongoose = require('./app/config/db');

// Middleware to parse JSON request bodies
app.use(express.json());

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:4200', // Allow requests from this origin
    optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions)); // Use the CORS middleware

// Configure session middleware
app.use(session({
    secret: 'TRLZuw/dkAobKVMRFj6ydoFV09lZ4vyXMsJkIe9KDno=', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Other routes and middleware...
app.use('/api', require('./app/router'));

app.listen(2000, () => {
    console.log('Server is running on port 2000');
});
