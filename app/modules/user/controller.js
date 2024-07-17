const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./model');
const key = "74b15e3c7e4ff240879ba82a7f4e084069742e973c3e37e0e02589c53efc7ec4eccc1a238062bf9fc1b89a2a850863d012930e3d12d0fee6e2cce6537e909f10";

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

    try {
        // Check if email is provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
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

controller.register = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user
        await User.create({
            userName,
            email,
            password: hashPassword
        });

        res.json({ msg: 'Register successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ msg: 'Registration failed', error });
    }
};

module.exports = controller;
