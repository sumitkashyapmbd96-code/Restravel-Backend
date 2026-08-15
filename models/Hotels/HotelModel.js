const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PartnerUser",
        required: true
    },

    hotelname: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true,
        enum: ["Hotel", "Resort", "Villa"]
    },

    city: {
        type: String,
        required: true,
        index: true
    },

    address: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: [1, "Price must be greater than 0"]
    },

    rooms: {
        type: Number,
        required: true,
        min: 1
    },

    amenities: {
        type: [{
            type: String,
            enum: ["WiFi", "AC", "Parking", "Pool", "Restaurant", "Gym", "Spa"]
        }],
        required: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 500
    },

//     embedding: {
//     type: [Number],
//     default: []
// },

    hotelImages: {
        type: [
            {
                filename: String,
                key: String,
                url: String
            }
        ],
        default: [],
    },

},

    { timestamps: true }

)

module.exports = mongoose.model("Hotel", hotelSchema)