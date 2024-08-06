const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./model');
const key = "74b15e3c7e4ff240879ba82a7f4e084069742e973c3e37e0e02589c53efc7ec4eccc1a238062bf9fc1b89a2a850863d012930e3d12d0fee6e2cce6537e909f10";
const mongoose = require('mongoose'); 


let controller= {};


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

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Create JWT token
        const token = jwt.sign({ email: user.email, id: user._id }, key, { expiresIn: "7d" });

        // Verify the token
        jwt.verify(token, key, (err, decodedToken) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(401).json({ message: 'Invalid token' });
            } else {
                console.log('Decoded Token:', decodedToken);
                res.json({ token, message: "Login successful" });
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

controller.register = async (req, res) => {
    const { userName, email, password, phone, addresse } = req.body;

    console.log('Register request received:', { userName, email, phone, addresse });

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
        if (existingUser) {
            console.log('User already exists:', existingUser);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user with default role 'secretary'
        const newUser = new User({
            userName,
            email,
            password: hashPassword,
            role: 'secretary',  // Default role set to 'secretary'
            phone,
            addresse
        });

        await newUser.save();

        console.log('New user registered:', newUser);
        res.json({ msg: 'Register successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ msg: 'Registration failed', error: error.message });
    }
};


controller.getProfileById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Validate the ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error fetching user by ID:', err.message);
        res.status(500).send('Internal server error');
    }
};

module.exports = controller;
