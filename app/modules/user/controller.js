const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./model');
const key = "74b15e3c7e4ff240879ba82a7f4e084069742e973c3e37e0e02589c53efc7ec4eccc1a238062bf9fc1b89a2a850863d012930e3d12d0fee6e2cce6537e909f10";
const mongoose = require('mongoose'); 
const crypto = require('crypto');
const nodemailer = require('nodemailer');
let controller = {};

const generateRandomPassword = (length = 12) => {
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const allChars = upperCaseChars + lowerCaseChars + numberChars;

    if (length < 8) {
        throw new Error('Password length must be at least 8 characters');
    }

    let password = '';
    password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
    password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
    password += numberChars[Math.floor(Math.random() * numberChars.length)];

    for (let i = 3; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    console.log('Generated Password:', password);  // Debug log
    return password;
};

controller.requestPasswordReset = async (req, res) => {
    try {
        console.log('Request Body:', req.body);  // Debug log

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPassword = generateRandomPassword();
        console.log('New Password:', newPassword);  // Debug log

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'tasnimmtir586@gmail.com',
                pass: 'tdzo fbhl xecd opuv'  // Use environment variables for sensitive info
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'tasnimmtir586@gmail.com',
            subject: 'Password Reset',
            text: `Your password has been reset.\n\n
                   Your new password is: ${newPassword}\n\n
                   Please log in with this new password and change it as soon as possible.\n`
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');  // Debug log

        res.status(200).json({ message: 'Password has been reset and new password sent to email' });
    } catch (err) {
        console.error('Error sending password reset email:', err);
        res.status(500).send('Internal server error');
    }
};





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
        const token = jwt.sign({ email: user.email, id: user.id }, key, { expiresIn: "7d" });

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
    const { userName, email, password, phone } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user with default role 'secretary'
        await User.create({
            userName,
            email,
            password: hashPassword,
            phone,  
            role: 'secretary'  // Default role set to 'secretary'
        });

        res.json({ msg: 'Register successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ msg: 'Registration failed', error });
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

controller.updateUser = async (req, res) => {
    const { id } = req.params;
    const { userName, email, password, phone } = req.body;

    try {
        // Validate the ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        if (userName) user.userName = userName;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(password, salt);
        }
        if (phone) user.phone = phone;
        // Save the updated user
        await user.save();

        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).send('Internal server error');
    }
};


module.exports = controller;
