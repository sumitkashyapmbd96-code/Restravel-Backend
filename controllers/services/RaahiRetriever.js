const FoodMenu = require("../../models/Restaurants/AddMenu");
const Hotel = require('../../models/Hotels/HotelModel');
const AddRestaurent = require('../../models/Restaurants/AddRestaurent');

const RaahiRetriever = async (intent) => {

    let data = {};

    const entity = intent.entities || {};

    switch (intent.intent) {

        case "hotel_search":

            let hotelFilter = {};

            if (entity.city) {

                hotelFilter.city = entity.city
            }

            if (entity.budget) {

                hotelFilter.price = {
                    $lte: Number(entity.budget)
                }
            }

            data.hotels = await Hotel.find(hotelFilter).limit(10);

            break;


        case "restaurant_search":

            let restaurantFilter = {};

            if (entity.city) {

                restaurantFilter.city = entity.city
            }

            if (entity.budget) {

                restaurantFilter.price = {
                    $lte: Number(entity.budget)
                }
            }

            data.restaurants = await AddRestaurent.find(restaurantFilter).limit(10);

            break;

        case "food_search":

            let foodFilter = {};

            if (entity.city) {

                foodFilter.city = entity.city
            }

            if (entity.budget) {

                foodFilter.price = {
                    $lte: Number(entity.budget)
                }
            }

            data.foods = await FoodMenu.find(foodFilter).limit(10);

            break;

            default:

            data.message = "No database search required"
    }

    return data;


}

module.exports = RaahiRetriever;