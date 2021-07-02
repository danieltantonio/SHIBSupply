const { Schema } = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
        validate(val){
            if(!validator.isEmail(val)) {
                throw new Error('Email is not valid please provide valid email');
            } else {
                return val;
            }
        }
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(val) {
            if(!validator.isStrongPassword(val)) {
                // Must contain 1 uppercase, 1 special, 8 characters, 1 number
                throw new Error('Password is not secure, please try again.');
            } else {
                return val;
            }
        }
    },
    tfaSecret: {
        type: String,
        trim: true
    },
    tmpSecret: {
        type: String,
        trim: true
    },
    tmpOTPAuth: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now(),
        required: true
    },
    trustedSeller: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, 14);
    next();
});

userSchema.post('save', function(next) {
    console.log('User has been successfuly saved 💽');
});

module.exports = userSchema;