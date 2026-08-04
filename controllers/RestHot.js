const FoodMenu = require("../models/Restaurants/AddMenu");
const Hotel = require('../models/Hotels/HotelModel');
const AddRestaurent = require('../models/Restaurants/AddRestaurent');

const getRestHot = async (req, res) => {

    try {

        const { city } = req.params;

        const [hotels, restaurants] = await Promise.all([
            Hotel.find({ city }),
            AddRestaurent.find({ city })
        ]);

        const restaurantIds = restaurants.map(r => r._id);

        const foodMenus = await FoodMenu.find({
            restaurant: { $in: restaurantIds }
        });

        // attach menu to each restaurant

        const restaurantWithMenu = restaurants.map( r => {
            const menu = foodMenus.filter(
                f => f.restaurant.toString() === r._id.toString()
            )

            return {
                ...r.toObject(),
                menu 
            }
        })


        res.json({

            success: true,
            data: {
                hotels,
                restaurants: restaurantWithMenu
            }
        })

    } catch (err) {
        console.log("Error:", err)
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }
}

module.exports = getRestHot