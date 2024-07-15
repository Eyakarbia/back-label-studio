const User = require('./model'); // Correct import path assuming 'model.js' is in the same directory

let controller = {};


controller.get = async (req, res) => {
    try {
        let userData = await User.find();
        res.send(userData);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).send('Internal server error');
    }
};

controller.login = async (req, res) => {
    const { email, password } = req.body;

    console.log('Request Body:', req.body); // Log request body for debugging

    try {
        // Check if email is provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if password matches
        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Set session or JWT token for authenticated user
        req.session.user = user; // Example using session (requires express-session)

        res.json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = controller;
