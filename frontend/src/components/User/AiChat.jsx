import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, Loader2, AlertTriangle, Home, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const AiChat = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use environment variable for the API key for security
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      console.log("apikey",apiKey)

      // Initialize the Gemini API
      const genAI = new GoogleGenerativeAI(AIzaSyDPSznE8zXlSQp3paWKdIAjOZMTx7lBWe8);

      // Create a generative model instance
      const model = await genAI.getGenerativeModel({ model: "gemini-pro" });

      // Define the prompt for the model
      const prompt = `As a natural healthcare assistant, please provide evidence-based information about: ${input}. 
                     Focus on natural remedies and wellness while emphasizing the importance of consulting healthcare professionals.`;

      // Generate the response from the model
      const result = await model.generateContent(prompt);

      // Set the response text
      setResponse(result.text); // Use result.text directly
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setResponse('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-green-50 sm:px-6 lg:px-8">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="fixed inline-flex items-center px-4 py-2 text-green-700 transition-colors bg-white border border-green-100 rounded-lg shadow-sm top-4 left-4 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <Home className="w-5 h-5 mr-2" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-10 h-10 mr-2 text-green-600" />
            <h1 className="text-3xl font-bold text-green-800">Natural Health Assistant</h1>
          </div>
          <p className="text-green-600">Powered by Google Gemini AI</p>
          <p className="mt-2 text-green-600">Ask questions about natural remedies and wellness</p>
        </div>

        {/* Medical Disclaimer */}
        <div className="p-4 mb-8 border-l-4 rounded-r-lg bg-amber-50 border-amber-500">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="mb-1 font-semibold text-amber-800">Medical Disclaimer</h3>
              <p className="text-sm text-amber-700">
                The information provided by this AI assistant is for general informational purposes only and is not a substitute for professional medical advice. Always consult with a qualified healthcare provider for medical diagnosis and treatment. In case of emergency, please contact emergency services immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about natural remedies, wellness tips, or general health information..."
              rows="4"
              className="w-full px-4 py-3 placeholder-green-400 bg-white border-2 border-green-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`inline-flex items-center px-6 py-3 rounded-lg text-white font-medium transition-colors
                ${loading || !input.trim() 
                  ? 'bg-green-300 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 -ml-1 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2 -ml-1" />
                  Ask AI
                </>
              )}
            </button>
          </div>
        </form>

        {/* Response Section */}
        {response && (
          <div className="mt-8 overflow-hidden bg-white border border-green-100 rounded-lg shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center mb-3">
                <Bot className="w-6 h-6 mr-2 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">AI Response:</h3>
              </div>
              <div className="prose prose-green max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{response}</p>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-green-100 bg-green-50">
              <p className="text-xs text-green-600">
                Remember: This response is generated by AI and should not replace professional medical advice.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiChat;
