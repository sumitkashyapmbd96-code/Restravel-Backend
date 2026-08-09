const { GoogleGenAI } = require("@google/genai");

const travelAI = new GoogleGenAI({

    apiKey: process.env.GEMINI_API_KEY
});

const RaahiIntent = async (question) => {

    const prompt = `
    
    You are a intent classifier for travel application.

    Analyze user query.

    Return JSON only.

    Possible intent:

    hotel_search
    restaurant_search
    food_search
    activity_search
    trip_plan
    package_search
    destination_search
    weather_query
    transport_query
    price_query
    booking_query
    general_question

    User Question:
    ${question}

    Return JSOn:

    {
 "intent":"",
 "entities":{
    "destination":"",
    "city":"",
    "location":"",
    "budget":"",
    "days":"",
    "traveller_type":"",
    "occasion":"",
    "month":"",
    "food_preference":"",
    "hotel_preference":""
 }
}

Rules:
- Extract ONLY what user explicitly mentions
- Do NOT assume missing values
- Entities are optional
- Return empty string "" if not present

    `;

    const result = await travelAI.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
    });

    const cleanJSON = result.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let aiResponse;

    try {

        aiResponse = JSON.parse(cleanJSON);

        return aiResponse

    } catch (err) {

        console.log("JSON parse failed:", result.text)

        return {
            intent: "general_question",
            entities: {
                destination: "",
                city: "",
                location: "",
                budget: "",
                days: "",
                traveller_type: "",
                occasion: "",
                month: "",
                food_preference: "",
                hotel_preference: ""
            }
        };

    }

}

module.exports = RaahiIntent;