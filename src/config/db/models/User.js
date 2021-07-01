const { model } = require('mongoose');
const userSchema = require('../schemas/userSchema');

const User = model('users', userSchema);

module.exports = User;