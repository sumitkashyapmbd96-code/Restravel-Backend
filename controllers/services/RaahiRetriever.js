const FoodMenu = require("../../models/Restaurants/AddMenu");
const Hotel = require('../../models/Hotels/HotelModel');
const AddRestaurent = require('../../models/Restaurants/AddRestaurent');

const RaahiRetriever = async (intent) => {

    const extractNumber = (value) => {

        if (!value) return null;

        const match = value.toString().match(/\d+/);

        return match ? Number(match[0]) : null;

    }

    let data = {};

    const entity = intent.entities || {};

    const budget = extractNumber(entity.budget);

    // ADDED: Destination ko ek common variable me rakha
    // destination OR city OR location me se jo available ho use karega

    const destination =
        entity.destination ||
        entity.city ||
        entity.location;


    switch (intent.intent) {

        // =========================================
        // HOTEL SEARCH
        // =========================================

        case "hotel_search":

            let hotelFilter = {};

            if (entity.city) {

                hotelFilter.city = entity.city
            }

            if (budget) {

                hotelFilter.price = {
                    $lte: budget
                }

            }

            data.hotels = await Hotel.find(hotelFilter).limit(10);

            break;

        // =========================================
        // RESTAURANT SEARCH
        // =========================================

        case "restaurant_search":

            let restaurantFilter = {};

            if (entity.city) {

                restaurantFilter.city = {
                    $regex: entity.city,
                    $options: "i"
                }
            }

            data.restaurants = await AddRestaurent.find(restaurantFilter).limit(10);

            break;

        // =========================================
        // FOOD SEARCH
        // =========================================

        case "food_search":

            let foodFilter = {};

            if (budget) {
                foodFilter.price = {
                    $lte: budget
                }
            }

            const foods = await FoodMenu.find(foodFilter)
                .populate("restaurant");

            data.foods = foods.filter(item => {

                if (!entity.city) return true;

                return item.restaurant &&
                    item.restaurant.city
                        .toLowerCase()
                        .includes(
                            entity.city.toLowerCase()
                        );

            });

            break;

        // =========================================
        // ⭐ TRIP PLAN
        // =========================================

        case "trip_plan":

            const days = extractNumber(entity.days)

            let tripHotelFilter = {};

            let tripRestaurantFilter = {};

            // ADDED: Destination ke according hotel search

            if (destination) {

                tripHotelFilter.city = {
                    $regex: destination,
                    $options: "i"
                }
            }

            // ADDED: Destination ke according restaurant search

            if (destination) {
                tripRestaurantFilter.city = {
                    $regex: destination,
                    $options: "i"
                }
            }

            // ADDED: Hotels retrieve karna

            const tripHotels = await Hotel.find(tripHotelFilter).limit(10)

            // ADDED: Restaurant retrieve karna

            const tripRestaurants = await AddRestaurent.find(tripRestaurantFilter).limit(10)

            // ADDED: Food retrieve karna

            const tripFoods = await FoodMenu.find({}).populate("restaurant");

            // Sirf selected destination ke foods honge

            const filteredTripFoods = tripFoods.filter(item => {
                if (!destination)
                    return true;

                return item.restaurant &&
                    item.restaurant.city &&
                    item.restaurant.city
                        .toLowerCase()
                        .includes(
                            destination.toLowerCase()
                        );
            })

            // final trip data

            console.log("========== TRIP PLAN DEBUG ==========");

            console.log("Destination:", destination);
            console.log("Budget:", budget);
            console.log("Days:", days);

            console.log("Hotels Found:", tripHotels.length);
            console.log("Restaurants Found:", tripRestaurants.length);
            console.log("Foods Found:", filteredTripFoods.length);

            console.log("Hotels:", tripHotels);
            console.log("Restaurants:", tripRestaurants);
            console.log("Foods:", filteredTripFoods);

            console.log("=====================================");

            data.trip = {
                destination: destination || "",
                budget: budget || "",
                days: days || "",
                hotels: tripHotels,
                restaurants: tripRestaurants,
                foods: filteredTripFoods
            }

            break;

        default:

            data.message = "No database search required"
    }

    return data;


}

module.exports = RaahiRetriever;