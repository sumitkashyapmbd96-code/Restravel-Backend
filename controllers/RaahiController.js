const RaahiIntent = require("./services/RaahiIntent");
const RaahiRetriever = require("./services/RaahiRetriever");
const ContextBuilder = require("./services/ContextBuilder");
const RaahiGenerator = require("./services/RaahiGenerator");


const RaahiAI = async (req, res) => {

    try {

        const { question } = req.body

        if (!question || !question.trim()) {

            return res.status(400).json({

                success: false,

                message: "Question is required."
            });
        }

        // 1. Intent Detection

        const intent = await RaahiIntent(question.trim());

        // console.log(intent)

        // 2. Retrieve Data from MongoDB

        const data = await RaahiRetriever(intent);

        // console.log(data);

        // 3. Build Context for LLM

        const context = ContextBuilder(data)

        // console.log("Context:", context)

        const answer = await RaahiGenerator(
            question.trim(),
            context
        )

        // console.log("========== AI ANSWER ==========");
        // console.log(answer);

        return res.status(200).json({
            success: true,
            data: answer
        })




    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Raahi AI service temporarily unavailable."
        })
    }
}

module.exports = RaahiAI;