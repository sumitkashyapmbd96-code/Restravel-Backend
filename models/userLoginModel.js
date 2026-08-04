const mongoose = require('mongoose');

const userLoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },

    password: {
        type: String,
        required: true,
        minlength: 10
    },

    role: {
        type: String,
        default: "customer"
    },    

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Login = mongoose.model('Login', userLoginSchema)

module.exports = Login