const jwt = require('jsonwebtoken')
const PartnerUser = require('../models/Hotels/PartnerUser');

const partnerAuth = async (req, res, next) => {
    
    try {
        const bearerHeader = req.headers['authorization']
        if (!bearerHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = bearerHeader.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // role check

        if (decoded.role !== "partner") {
            return res.status(403).json({ message: 'Partner access only' });
        }

        // DB check

        const user = await PartnerUser.findById(decoded.partneruserId)

        if (!user) {

            return res.status(401).json({ message: 'User not found' });

        }

        req.user = {
            id: user._id,
            role: user.role,
            name: user.name
        };

        next();

    } catch (err) {
        res.status(403).json({ message: 'Invalid or Expire Token' })
    }
}

module.exports = partnerAuth