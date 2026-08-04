const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bycrypt = require('bcryptjs');
const PartnerUser = require('../models/Hotels/PartnerUser');
const { getAuth } = require('firebase-admin/auth');
const admin = require('../config/firebase')
// const serviceAccount = require("../firebaseServiceKey.json");
const partnerAuth = require('../middleware/partner_auth');
const dotenv = require('dotenv')

dotenv.config()

router.post('/partner-login', async (req, res) => {
    // const { name, email, photo } = req.body;
    const { idToken } = req.body

    try {

        if (!idToken) {
            return res.status(400).json({ message: "ID Token required" })
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET missing");
        }

        // veryfy firebase token here 

        const decoded = await getAuth().verifyIdToken(idToken);

        const email = decoded.email?.toLowerCase().trim();
        const name = decoded.name;
        const photo = decoded.picture;

        const normalizedEmail = email.toLowerCase().trim()

        let partneruser = await PartnerUser.findOne({ email: normalizedEmail })

        if (!partneruser) {
            partneruser = await PartnerUser.create({
                name,
                email: normalizedEmail,
                photo,
                role:"partner"
            })
        }

        // create token

        const token = jwt.sign(
            { 
                partneruserId: partneruser._id, 
                name: partneruser.name,
                role: "partner"
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.json({

            user: {
                id: partneruser._id,
                name: partneruser.name,
                email: partneruser.email,
                photo: partneruser.photo,
                role: "partner"
            },
            
            token
        });

    } catch (err) {
        res.status(500).json({ message: "Invalid Token" })
    }
})

// get method

router.get("/partnerDashboard", partnerAuth, (req, res) => {
    res.json({
        message: "Welcome to dashboard",
        user: req.user
    })

})

router.post('/logout', async (req, res) => {
    res.json({message: 'Logged Out'})
})

module.exports = router
