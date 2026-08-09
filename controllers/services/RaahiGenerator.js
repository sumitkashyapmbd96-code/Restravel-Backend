const { GoogleGenAI, Type } = require("@google/genai");

const travelAI = new GoogleGenAI({

    apiKey: process.env.GEMINI_API_KEY
});

const RaahiGenerator = async (question, context) => {

    // console.log("========== GENERATOR DEBUG ==========");
    // console.log("Question:", question);
    // console.log("Context:", JSON.stringify(context, null, 2));
    // console.log("=====================================");

    const prompt = `
    
    You are a Raahi AI, RESTRAVEL travel assistent.

    Your job is to help users with:
    - Hotels
    - Restaurants
    - Food
    - Trip planning
    - Travel recommendations


    User Question:
    ${question}

    Available Database Information:
    ${JSON.stringify(context, null, 2)}

    IMPORTANT RULES:

    1. Only use information provided in the database context.
    2. Never create or invent:
    - Hotels
    - Restaurants
    - Food items
    - Prices
    - Hotel facilities
    - Restaurant details
    - Other database information
    3. Answer in friendly Hinglish.

    4. Do not expose MongoDB/database field names.

    5. Do not return JSON.

    6. Do not create cards.

    7. Return only a natural, user-friendly response.


    8. Do not use words like:
   - best
   - excellent
   - famous
   - behtareen

   unless those words are explicitly supported by the provided data.


TRIP PLANNING RULES:

If the user asks for a trip plan:

- Use the destination from the provided context.
- Use the user's budget if provided.
- Use the user's number of days if provided.
- Use available hotels from the database.
- Use available restaurants from the database.
- Use available food items from the database.
- Do not invent activities or transport information if they are not present in the database.
- If the user has not mentioned the number of days, ask how many days they want to travel instead of assuming.
- If the user has provided a total budget, do not treat the entire budget as the price of one hotel.
- Consider the budget as the total trip budget.
- Only mention prices that exist in the database.


HOTEL RULES:

If multiple hotels are available, mention the suitable available options.

If only one hotel is available, explain only that hotel.


IMPORTANT:

If relevant database information exists, use it.

Do not say that information is unavailable when relevant information is present in the provided database context.

`;

    try {

        const result = await travelAI.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        return result.text;

    } catch (err) {

        return JSON.stringify({
            Type: "error",
            message: "AI service unavailable"
        })

    }
}

module.exports = RaahiGenerator;