const ContextBuilder = (data) => {

    let context = "";

    if (data.hotels?.length) {

        context += `
        Available Hotels:
        ${data.hotels.map(hotel => `
            
            Name: ${hotel.hotelname}
            City: ${hotel.city}
            Price: ₹${hotel.price}
            Address: ${hotel.address}
            AmEnities: ${hotel.amenities.join(", ")}
            
            `).join("")}
        
        `;
    }

    if (data.restaurants?.length) {

        context += `
        Available Restaurants:
        ${data.restaurants.map(res => `
            
            Name: ${res.restaurentname}
            City: ${res.city}
            Address: ${res.address}
            
            `).join("")}
        
        `;
    }

    if (data.foods?.length) {

        context += `
        Available Foods:
        ${data.foods.map(menu => `
            
            Name: ${menu.foodName}
            Category: ${menu.foodCategory}
            Price: ₹${menu.price}
            
            `).join("")}
        
        `;
    }

    return context;
}

module.exports = ContextBuilder;