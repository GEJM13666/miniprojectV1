const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 0 }, // Example roles: 'user', 'admin'
});

module.exports = mongoose.model('UserInfo', userSchema,'userInfo');
