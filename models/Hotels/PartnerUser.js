const mongoose = require("mongoose")

const partnerUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    photo: {
        type: String
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true
    },

    password: {
        type: String
    },

    authType: {
        type: String,
        enum: ["google", "local"],
        default: "google"
    },

    role: {
        type: String,
        default: "partner"
    }

}, { timestamps: true }

)

module.exports = mongoose.model("PartnerUser", partnerUserSchema)