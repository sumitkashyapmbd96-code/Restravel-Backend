const express = require('express');
const router = express.Router()
const User = require('../models/userModel');

// get user api

router.get('/', async (req, res) => {
    try{
        const users = await User.find()
        res.json(users)

    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

// add new user 
router.post('/', async (req, res) => {
    try{
        const newUser = await User.create(req.body)
        res.status(201).json(newUser)

    }catch(err){
        res.status(400).json({ message: err.message })
    }
})

module.exports = router