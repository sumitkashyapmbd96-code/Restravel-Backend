const { GoogleGenAI, Type } = require("@google/genai");

const travelAI = new GoogleGenAI({

    apiKey: process.env.GEMINI_API_KEY
});

const RaahiGenerator = async (question, context) => {

    const prompt = `
    
    You are a Raahi AI, RESTRAVEL travel assistent.

    Your job:
    Help users with hotels, restaurants, food and travel.


    User Question:
    ${question}

    Available Database Information:
    ${context}

    Rules:

    - Only use provided information.
    - Do not create fake hotels.
    - Do not create fake price.
    - Answer in friendly Hinglish.
    - Do not return database fields.
    - Do not return JSON.
    - Do not create cards.
    - Explain recommendations naturally.
    - Return only user friendly response.


    If multiple hotels are available, mention all suitable options.

    If only one hotel is available, explain only that hotel.

    Do not use words like:
    best
    excellent
    famous
    behtareen
    unless it is present in database.

    Only explain available information.
    
    `;

    try {

        const result = await travelAI.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
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