const ContextBuilder = (data) => {

    let context = "";

    if (data.trip) {
        context += `
        
        Trip Information:

        Destination: ${data.trip.destination || ""}
        Budget: ₹${data.trip.budget || ""}
        Days: ${data.trip.days || ""}
        
        `;
    }

    if (data.trip?.hotels?.length) {

        context += `
        Available Hotels:
        ${data.trip.hotels.map(hotel => `
            
            Name: ${hotel.hotelname}
            City: ${hotel.city}
            Price: ₹${hotel.price}
            Address: ${hotel.address}
            Amenities: ${hotel.amenities?.join(", ") || ""}
            
            `).join("")}
        
        `;
    }

    if (data.trip?.restaurants?.length) {

        context += `
        Available Restaurants:
        ${data.trip.restaurants.map(res => `
            
            Name: ${res.restaurentname}
            City: ${res.city}
            Address: ${res.address}
            
            `).join("")}
        
        `;
    }

    if (data.trip?.foods?.length) {

        context += `
        Available Foods:
        ${data.trip.foods.map(menu => `
            
            Name: ${menu.foodName}
            Category: ${menu.foodCategory}
            Price: ₹${menu.price}
            
            `).join("")}
        
        `;
    }

    return context;
}

module.exports = ContextBuilder;