const ContextBuilder = (data) => {

    let context = "";

    // =========================================
    // TRIP INFORMATION
    // =========================================

    if (data?.trip) {
        context += `
        
        Trip Information:

        Destination: ${data.trip.destination || "Not provided"}
        Budget: ${data.trip.budget ? `₹${data.trip.budget}` : "Not provided"}
        Days: ${data.trip.days || "Not provided"}
        
        `;
    }

    // =========================================
    // HOTELS
    // =========================================

    if (data?.hotels?.length) {

        context += `
========================
AVAILABLE HOTELS
========================

`;

        data.hotels.forEach((hotel, index) => {

            context += `
Hotel ${index + 1}

Name: ${hotel.hotelname || "Not provided"}
City: ${hotel.city || "Not provided"}
Category: ${hotel.category || "Not provided"}
Price: ${hotel.price !== undefined ? `₹${hotel.price}` : "Not provided"}
Address: ${hotel.address || "Not provided"}
Amenities: ${hotel.amenities?.length
                    ? hotel.amenities.join(", ")
                    : "Not provided"}

`;
        });
    }

    // =========================================
    // RESTAURANTS
    // =========================================

    if (data?.restaurants?.length) {

        context += `
========================
AVAILABLE RESTAURANTS
========================

`;

        data.restaurants.forEach((restaurant, index) => {

            context += `
Restaurant ${index + 1}

Name: ${restaurant.restaurentname || "Not provided"}
City: ${restaurant.city || "Not provided"}
Address: ${restaurant.address || "Not provided"}
Phone: ${restaurant.phonenumber || "Not provided"}

`;
        });
    }

    // =========================================
    // FOODS
    // =========================================

    if (data?.foods?.length) {

        context += `
========================
AVAILABLE FOODS
========================

`;

        data.foods.forEach((food, index) => {

            context += `
Food ${index + 1}

Name: ${food.foodName || "Not provided"}
Category: ${food.foodCategory || "Not provided"}
Price: ${food.price !== undefined ? `₹${food.price}` : "Not provided"}
Description: ${food.description || "Not provided"}

`;
        });
    }

    // =========================================
    // NO DATA
    // =========================================

    if (!context.trim()) {

        context = `
No relevant information was retrieved from the available database.
`;
    }

   return context.trim();
}

module.exports = ContextBuilder;