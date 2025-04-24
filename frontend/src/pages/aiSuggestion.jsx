import { useState, useEffect, useRef } from 'react';
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { getChatbotSuggestion } from "../services/chatbotService"; // Import the function

const predefinedQuestions = [
  "How many calories should I consume daily?",
  "Suggest a healthy dinner option.",
  "How much water should I drink today?",
  "Give me a workout routine."
];

export default function AISuggestions() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const username = localStorage.getItem("username");

  const sendMessage = async (text, fromUser = true) => {
    const timestamp = new Date().toLocaleTimeString();
    const userMsg = { text, fromUser, timestamp };
    setMessages(prev => [...prev, userMsg]);

    if (fromUser) {
      // Show a placeholder message while waiting for AI response
      const thinkingMsg = {
        text: "Thinking...",
        fromUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, thinkingMsg]);

      // Send the user's message to the API for a response
      try {
        const aiResponse = await getChatbotSuggestion(username, text); // Use the function to get the AI response
        console.log("hello" + " " + aiResponse)
        const aiMsg = {
          text: aiResponse || "Sorry, I couldn't understand that.",
          fromUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };

        // Update messages with AI response (replace "thinking..." message)
        setMessages(prev => {
          // Find the last "thinking..." message and replace it with the AI response
          const updatedMessages = [...prev];
          const lastMessageIndex = updatedMessages.findIndex(msg => msg.text === "Thinking...");
          if (lastMessageIndex !== -1) {
            updatedMessages[lastMessageIndex] = aiMsg; // Replace the thinking message with AI response
          } else {
            updatedMessages.push(aiMsg); // If no "thinking..." message found, add the response at the end
          }
          return updatedMessages;
        });
      } catch (error) {
        const errorMsg = {
          text: "Something went wrong, please try again later.",
          fromUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, errorMsg]); // Show error message if AI request fails
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      console.log(input.trim)
      sendMessage(input.trim());
      setInput('');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex min-h-screen w-screen bg-gradient-to-br from-blue-50 to-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex flex-col h-200 p-4 bg-gray-100">
          <div className="text-lg text-black font-semibold mb-2">AI Suggestions</div>

          {/* Predefined Questions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {predefinedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto bg-white rounded-lg p-4 shadow">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${msg.fromUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-150 ${msg.fromUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  <div className="text-m">{msg.text}</div>
                  <div className="text-[10px] text-right mt-5 opacity-70">{msg.timestamp}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="mt-4 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-black border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none "
              placeholder="Ask something..."
            />
            <button
              onClick={() => {
                if (input.trim()) {
                  sendMessage(input.trim());
                  setInput('');
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
