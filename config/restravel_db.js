const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('connected to mongoDB Atlas'))
    .catch(err => console.log(err))
    
}

module.exports = connectDB

