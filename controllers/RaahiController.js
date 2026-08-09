const { GoogleGenAI } = require("@google/genai");
const RaahiIntent = require("./services/RaahiIntent");
const RaahiRetriever = require("./services/RaahiRetriever");
const ContextBuilder = require("./services/ContextBuilder");
const RaahiGenerator = require("./services/RaahiGenerator");

const travelAI = new GoogleGenAI({

    apiKey: process.env.GEMINI_API_KEY
});

const RaahiAI = async (req, res) => {

    try {

        const { question } = req.body

        // 1. Intent Detection

        const intent = await RaahiIntent(question);

        // console.log(intent);

        // 2. Retrieve Data from MongoDB

        const data = await RaahiRetriever(intent);

        // console.log(data);

         // 3. Build Context for LLM

        const context = ContextBuilder(data)

        // console.log("Context:", context)

        const answer = await RaahiGenerator(
            question,
            context
        )

        // console.log("========== AI ANSWER ==========");
        // console.log(answer);

        res.json({
            success: true,
            data:answer
        })

        
        

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = RaahiAI;