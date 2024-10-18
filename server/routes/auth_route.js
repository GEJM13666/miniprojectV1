const express = require('express');
const router  = express.Router();

const authenticateToken = require('../middlewares/auth_middlewares');

const {
    register,
    login,
    isLoggedIn,
    refreshToken,
    logout,
} = require('../controllers/auth_controller');

router.post('/', async (req, res) => {
    res.sendStatus(404);
});

// User registration
router.post('/register', register);

// User login
router.post('/login',login);

// Check session
router.get('/isLoggedIn',isLoggedIn);
router.post('/refresh-token',refreshToken);
// Logout
router.post('/logout',logout);




module.exports = router;