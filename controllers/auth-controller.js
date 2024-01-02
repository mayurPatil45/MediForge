const User = require('../models/User');

const signup = async (req, res) => {
    try {
        const { email, firstname, password } = req.body;
        if (!(email && firstname && password)) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        const newUser = new User({
            email: email,
            firstname: firstname,
            password: password,
        });

        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist'
            });
        }

        const isPasswordCorrect = await existingUser.comparePassword(password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Credentials'
            });
        }

        const token = await existingUser.generateToken();
        res.cookie('AuthToken', token, {
            maxAge: 3600000,
            httpOnly: true,
            secure: true,
        });

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error: ' + error.message,
        });
    }
};

const logout = async (req, res) => {
    try {
        res.cookie('AuthToken', '', { maxAge: 0 });
        return res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { signup, login, logout };