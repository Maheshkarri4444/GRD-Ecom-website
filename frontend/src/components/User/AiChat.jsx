import React, { useState } from "react";
import { Send, Loader2, AlertTriangle, Home, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import Allapi from "../../common";

const AiChat = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const formatResponse = (text) => {
    // Replace bold markers with proper styling
    return text.split('\n').map((line, index) => {
      // Handle section headers (lines ending with ":")
      if (line.endsWith(':')) {
        return (
          <h3 key={index} className="mt-4 mb-2 text-lg font-semibold text-green-800">
            {line}
          </h3>
        );
      }
      
      // Handle bullet points
      if (line.startsWith('* ')) {
        return (
          <li key={index} className="mb-2 ml-4">
            {line.substring(2).split('**')
              .map((part, i) => 
                i % 2 === 0 ? 
                  part : 
                  <strong key={i} className="text-green-700">{part}</strong>
              )}
          </li>
        );
      }
      
      // Regular text
      return (
        <p key={index} className="mb-2">
          {line.split('**')
            .map((part, i) => 
              i % 2 === 0 ? 
                part : 
                <strong key={i} className="text-green-700">{part}</strong>
            )}
        </p>
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse(""); // Clear previous response

    try {
      const res = await fetch(Allapi.aiChat.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ system:"You are a knowledgeable and friendly AI assistant for a natural and organic products website. Your role is to provide guidance on holistic wellness, natural remedies, and organic products like bull-driven oils, millets, and other healthy foods. You offer insightful answers to health-related questions and recommend suitable natural products based on users' needs. However, you strictly avoid allopathic medicine and pharmaceutical-based solutions, focusing only on traditional, natural, and organic approaches to well-being. Always prioritize authenticity, sustainability, and holistic health in your responses.", prompt: input }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.response || "No protocol available for this query.");
      } else {
        setResponse(data.error || "Unable to generate protocol at this time.");
      }
    } catch (error) {
      console.error("Error fetching protocol:", error);
      setResponse("An error occurred while generating your protocol. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-5 bg-green-50 sm:px-6 lg:px-8">

      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-10 h-10 mr-2 text-green-600" />
            <h1 className="text-3xl font-bold text-green-800">
              Natural Wellness Protocol Assistant
            </h1>
          </div>
          <p className="text-green-600">
            Get personalized natural health protocols and holistic wellness recommendations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Describe your wellness goals or ask about specific natural protocols..."
            rows="4"
            className="w-full px-4 py-3 placeholder-gray-800 bg-white border-2 border-green-500 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`inline-flex items-center px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                loading || !input.trim()
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 -ml-1 animate-spin" />
                  Generating Protocol...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2 -ml-1" />
                  Get Protocol
                </>
              )}
            </button>
          </div>
        </form>

        {response && (
          <div className="mt-8 bg-white border border-green-100 rounded-lg shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center mb-3">
                <Bot className="w-6 h-6 mr-2 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">
                  Recommended Protocol:
                </h3>
              </div>
              <div className="text-gray-700">
                {formatResponse(response)}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 mt-5 mb-8 border-l-4 rounded-r-lg bg-amber-50 border-amber-500">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="mb-1 font-semibold text-amber-800">
                Wellness Disclaimer
              </h3>
              <p className="text-sm text-amber-700">
                The protocols provided are for general wellness purposes only. Always consult with a qualified healthcare practitioner before starting any new health protocol or using natural products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;