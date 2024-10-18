const jwt = require('jsonwebtoken');

// Middleware to authenticate the user
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token invalid, forbidden
        req.user = user; // Save user info to request
        next(); // Proceed to the next middleware or route handler
    });
};

// Middleware to authorize user roles
const roleAuthorization = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = { authenticateToken, roleAuthorization };
