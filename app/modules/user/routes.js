const express = require('express');
const router = express.Router();
const controller = require('./controller'); // Import your controller

// Define routes
router.get('/get', controller.get); // Example GET route
router.post('/login', controller.login); // Example POST route for login
router.post('/register', controller.register);
router.get('/profile/:id', controller.getProfileById);
router.post('/resetpassword', controller.requestPasswordReset);








module.exports = router;
