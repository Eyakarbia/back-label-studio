const express = require('express');
const router = express.Router();
const controller = require('./controller'); // Import your controller

// Define routes
router.get('/get', controller.get); // Example GET route
router.post('/login', controller.login); // Example POST route for login
router.post('/register', controller.register);

module.exports = router;
