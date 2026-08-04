const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    
    filename: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    }
})

const AddrestSchema = new mongoose.Schema({

    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PartnerUser",
            required: true
        },

    restaurentname: {
        type: String,
        required: true,
        trim: true
    },

    city: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true
    },

    phonenumber: {
        type: String,
        match: /^[0-9]{10}$/,
        required: true,
    },

    embedding: {
    type: [Number],
    default: []
},

    // foodname: {
    //     type: String,
    //     required: true,
    // },

    // foodprice: {
    //     type: Number,
    //     min: 0,
    //     required: true,
    // },

    images: {
        type: [imageSchema],
        default: []
    },

},

    {
        timestamps: true
    }

);

module.exports = mongoose.model("AddRestaurent", AddrestSchema)