const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const { authenticateToken, roleAuthorization } = require('../middlewares/auth_middlewares'); // Adjust the path

// Create a new user (no authentication required)
router.post('/users', userController.createUser);

// Get all users (only admin can access)
router.get('/users', authenticateToken, roleAuthorization(['1']), userController.getAllUsers); // Assuming '1' is the admin role

// Get a single user by ID (only admin can access)
router.get('/users/:id', authenticateToken, roleAuthorization(['1']), userController.getUserById); // Both admin and user roles can access

// Update a user by ID (only admin can access)
router.put('/users/:id', authenticateToken, roleAuthorization(['1']), userController.updateUserById); // Only admin can access

// Delete a user by ID (only admin can access)
router.delete('/users/:id', authenticateToken, roleAuthorization(['1']), userController.deleteUserById); // Only admin can access

module.exports = router;
