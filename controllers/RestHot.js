const FoodMenu = require("../models/Restaurants/AddMenu");
const Hotel = require("../models/Hotels/HotelModel");
const AddRestaurent = require("../models/Restaurants/AddRestaurent");

const { getSignedImageUrl } = require("./services/s3Service");

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

        // =========================================
        // HOTEL SIGNED URLS
        // =========================================

        const hotelsWithSignedUrls = await Promise.all(
            hotels.map(async (hotel) => {

                const hotelData = hotel.toObject();

                if (hotelData.hotelImages?.length) {

                    hotelData.hotelImages = await Promise.all(
                        hotelData.hotelImages.map(async (image) => {

                            if (image.key) {
                                image.url = await getSignedImageUrl(image.key);
                            }

                            return image;
                        })
                    );
                }

                return hotelData;
            })
        );

        // =========================================
        // RESTAURANT + FOOD SIGNED URLS
        // =========================================

        const restaurantWithMenu = await Promise.all(

            restaurants.map(async (restaurant) => {

                const restaurantData = restaurant.toObject();

                // Restaurant images
                if (restaurantData.images?.length) {

                    restaurantData.images = await Promise.all(
                        restaurantData.images.map(async (image) => {

                            if (image.key) {
                                image.url = await getSignedImageUrl(image.key);
                            }

                            return image;
                        })
                    );
                }

                // Restaurant menu
                const menu = foodMenus.filter(
                    food =>
                        food.restaurant.toString() ===
                        restaurant._id.toString()
                );

                // Food images
                const signedMenu = await Promise.all(

                    menu.map(async (food) => {

                        const foodData = food.toObject();

                        if (foodData.foodImages?.length) {

                            foodData.foodImages = await Promise.all(
                                foodData.foodImages.map(async (image) => {

                                    if (image.key) {
                                        image.url =
                                            await getSignedImageUrl(image.key);
                                    }

                                    return image;
                                })
                            );
                        }

                        return foodData;
                    })
                );

                return {
                    ...restaurantData,
                    menu: signedMenu
                };
            })
        );

        // =========================================
        // RESPONSE
        // =========================================

        res.json({
            success: true,
            data: {
                hotels: hotelsWithSignedUrls,
                restaurants: restaurantWithMenu
            }
        });

    } catch (err) {

        console.log("Error:", err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = getRestHot;