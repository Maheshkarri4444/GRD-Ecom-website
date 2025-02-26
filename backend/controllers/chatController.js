const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// Chat function to handle AI interactions
async function runChat(userInput, chatHistory) {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("api key, ",apiKey)
  // Initialize Google Generative AI client
  const genAI = new GoogleGenerativeAI(apiKey);

  // Load the generative model
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Configuration for AI generation
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  // Safety settings for content moderation
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // Add other safety categories if needed
  ];

  // Start or continue the chat session
  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: chatHistory || [], // Initialize history if empty
  });

  // Send user input as a message to AI
  const result = await chat.sendMessage(userInput);

  // Extract and return the AI's response
  const response = result.response;
  return response.text();
}

// Controller for handling chat requests
const getChatResponse = async (req, res) => {
  try {
    const { prompt, chatHistory } = req.body; // Expecting both prompt and chat history
    // console.log('Incoming /chat request:', { prompt, chatHistory });

    // Validate request body
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // Run the chat function
    const response = await runChat(prompt, chatHistory);

    // Send the AI response
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getChatResponse };


