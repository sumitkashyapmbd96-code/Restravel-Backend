const FoodMenu = require("../../models/Restaurants/AddMenu");
const Hotel = require("../../models/Hotels/HotelModel");
const AddRestaurent = require("../../models/Restaurants/AddRestaurent");

const RaahiRetriever = async (intent) => {

    // =========================================
    // HELPER FUNCTIONS
    // =========================================

    const extractNumber = (value) => {

        if (!value) return null;

        const match = value.toString().match(/\d+/);

        return match ? Number(match[0]) : null;
    };


    // Escape special regex characters
    const escapeRegex = (value) => {

        if (!value) return "";

        return value
            .toString()
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };


    // =========================================
    // INITIAL DATA
    // =========================================

    let data = {};

    const entity = intent?.entities || {};

    const budget = extractNumber(entity.budget);

    const days = extractNumber(entity.days);


    // =========================================
    // DESTINATION
    // =========================================

    const destination =
        entity.destination ||
        entity.city ||
        null;


    const destinationRegex = destination
        ? new RegExp(
            escapeRegex(destination),
            "i"
        )
        : null;


    // =========================================
    // INTENT
    // =========================================

    switch (intent?.intent) {


        // =========================================
        // HOTEL SEARCH
        // =========================================

        case "hotel_search": {

            let hotelFilter = {};


            // Destination
            if (destinationRegex) {

                hotelFilter.city = destinationRegex;
            }


            // Location / Landmark
            //
            // Example:
            // "Mall Road ke paas hotel"

            if (entity.location) {

                hotelFilter.address = {
                    $regex: escapeRegex(entity.location),
                    $options: "i"
                };
            }


            // Budget
            //
            // Example:
            // "5000 ke andar hotel"

            if (budget !== null) {

                hotelFilter.price = {
                    $lte: budget
                };
            }


            // Hotel preference
            //
            // Example:
            // "Nainital me resort batao"

            if (entity.hotel_preference) {

                hotelFilter.category = {
                    $regex: escapeRegex(
                        entity.hotel_preference
                    ),
                    $options: "i"
                };
            }


            const hotels = await Hotel
                .find(hotelFilter)
                .limit(10);


            data.hotels = hotels;

            break;
        }


        // =========================================
        // RESTAURANT SEARCH
        // =========================================

        case "restaurant_search": {

            let restaurantFilter = {};


            // Destination / City
            if (destination) {

                restaurantFilter.city = {
                    $regex: escapeRegex(destination),
                    $options: "i"
                };
            }


            // Location / Address
            if (entity.location) {

                restaurantFilter.address = {
                    $regex: escapeRegex(entity.location),
                    $options: "i"
                };
            }


            const restaurants = await AddRestaurent
                .find(restaurantFilter)
                .limit(10);


            data.restaurants = restaurants;

            break;
        }


        // =========================================
        // FOOD SEARCH
        // =========================================

        case "food_search": {

            let foodFilter = {};


            // Food budget
            if (budget !== null) {

                foodFilter.price = {
                    $lte: budget
                };
            }


            // Food preference
            //
            // NOTE:
            // Ye tabhi work karega agar FoodMenu
            // mein "category" field available hai.

            if (entity.food_preference) {

                foodFilter.category = {
                    $regex: escapeRegex(
                        entity.food_preference
                    ),
                    $options: "i"
                };
            }


            const foods = await FoodMenu
                .find(foodFilter)
                .populate("restaurant")
                .limit(20);


            // Destination filtering
            const filteredFoods = foods.filter((item) => {

                // Agar destination mention nahi hai
                // toh saare retrieved foods allow karo.

                if (!destination) {
                    return true;
                }


                // Restaurant missing hai
                if (
                    !item.restaurant ||
                    !item.restaurant.city
                ) {
                    return false;
                }


                return item.restaurant.city
                    .toLowerCase()
                    .includes(
                        destination.toLowerCase()
                    );
            });


            data.foods = filteredFoods;

            break;
        }


        // =========================================
        // TRIP PLAN
        // =========================================

        case "trip_plan": {

            let tripHotelFilter = {};

            let tripRestaurantFilter = {};

            let tripFoodFilter = {};


            // -----------------------------------------
            // DESTINATION
            // -----------------------------------------

            if (destinationRegex) {

                tripHotelFilter.city =
                    destinationRegex;

                tripRestaurantFilter.city =
                    destinationRegex;
            }


            // -----------------------------------------
            // HOTEL BUDGET
            // -----------------------------------------

            if (budget !== null) {

                tripHotelFilter.price = {
                    $lte: budget
                };
            }


            // -----------------------------------------
            // HOTELS
            // -----------------------------------------

            const tripHotels = await Hotel
                .find(tripHotelFilter)
                .limit(10);


            // -----------------------------------------
            // RESTAURANTS
            // -----------------------------------------

            const tripRestaurants = await AddRestaurent
                .find(tripRestaurantFilter)
                .limit(10);


            // -----------------------------------------
            // FOOD
            // -----------------------------------------

            const tripFoods = await FoodMenu
                .find(tripFoodFilter)
                .populate("restaurant")
                .limit(30);


            // -----------------------------------------
            // FILTER FOOD BY DESTINATION
            // -----------------------------------------

            const filteredTripFoods =
                tripFoods.filter((item) => {

                    if (!destination) {
                        return true;
                    }


                    if (
                        !item.restaurant ||
                        !item.restaurant.city
                    ) {
                        return false;
                    }


                    return item.restaurant.city
                        .toLowerCase()
                        .includes(
                            destination.toLowerCase()
                        );
                });


            // -----------------------------------------
            // FINAL TRIP DATA
            // -----------------------------------------

            data.trip = {

                destination:
                    destination || "",

                budget:
                    budget || "",

                days:
                    days || "",

                hotels:
                    tripHotels,

                restaurants:
                    tripRestaurants,

                foods:
                    filteredTripFoods
            };


            break;
        }


        // =========================================
        // DEFAULT
        // =========================================

        default: {

            data.message =
                "No database search required.";

            break;
        }
    }


    // =========================================
    // RETURN
    // =========================================

    return data;
};


module.exports = RaahiRetriever;