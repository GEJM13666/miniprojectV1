const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Function to generate access and refresh tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '20m' }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// User registration
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                message: existingUser.username === username ? 'ชื่อผู้ใช้นี้มีอยู่ในระบบอยู่แล้ว' : 'อีเมลล์นี้มีอยู่ในระบบแล้ว'
            });
        }

        // Hash password and save new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// User login
// User login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'ไม่พบชื่อผู้ใช้นี้ในระบบ' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

        // Check user role and handle permissions
        if (user.role === '0') {
            return res.status(403).json({ message: 'Access denied: กรุณารอให้แอดมินอนุมัติสิทธิ์' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        // Respond with success message
        res.status(200).json({
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Check if user is logged in
exports.isLoggedIn = (req, res) => {
    res.json({ loggedIn: !!req.session.user, user: req.session.user || null });
};

// User logout
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

// Refresh access token
exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        const newAccessToken = jwt.sign(
            { userId: user.userId, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ accessToken: newAccessToken });
    });
};
