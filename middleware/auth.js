const jwt = require('jsonwebtoken')
const Login = require('../models/userLoginModel');

const auth = async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization']
        if (typeof bearerHeader != 'undefined') {

            const token = bearerHeader.split(' ')[1]

            const user = jwt.verify(token, process.env.JWT_SECRET)

            console.log(user)

            // check customer

            if (user.role !== "customer") {
                return res.status(403).json({
                    message: "Customer access only"
                })
            }

            req.user = user
            
            next()
            
        } else {
            res.status(401).json({ message: 'No Token Provide' })
        }
    } catch (err) {
        res.status(403).json({ message: 'Invalid or Expire Token' })
    }
}

module.exports = auth