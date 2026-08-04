const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddRestaurent",
        required: true
    },

    foodName: {
        type: String,
        required: true,
        trim: true
    },

    foodCategory: {
        type: String,
        required: true,
        enum: ["Starter", "Main Course", "Breads", "Rice & Biryani", "Snacks", "Desserts", "Beverages", "Burger", "Pizza"]
    },

    price: {
        type: Number,
        required: true,
        min: [1, "Price must be grater than 0"]
    },

    description: {
        type: String,
        required: true,
        maxlength: 500
    },

    embedding: {
    type: [Number],
    default: []
},

    foodImages: {
        type: [
            {
                filename: String,
                url: String
            }
        ],
        // validate: {
        //     validator: function (val) {
        //         return val.length > 0;
        //     },
        //     message: "At least one image is required"
        // }
    },

    foodVideo: {
        filename: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: ""
        }
    }

    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }

},

    { timestamps: true }

)

module.exports = mongoose.model("FoodMenu", menuSchema)