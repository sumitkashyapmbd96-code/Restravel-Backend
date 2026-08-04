const express = require('express');
const router = express.Router();
const Login = require('../models/userLoginModel');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        const existingUser = await Login.findOne({ $or: [{ username }, { email }] })
        if (existingUser) return res.status(400).json({ message: "username or email already exists." })

        const hasedPassword = await bycrypt.hash(password, 10)
        const userRegister = new Login({ username, email, password: hasedPassword })
        const savedLogin = await userRegister.save()

        res.json(savedLogin)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await Login.findOne({ username })
        if (!user) return res.status(404).json({ message: "user not found" })

        const isMatch = await bycrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid Credatials" })

        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.json({ 

            token,

           user: {
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role
           }
         })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/logout', async(req, res) => {
    res.json({message: 'Logged Out'})
})

module.exports = router