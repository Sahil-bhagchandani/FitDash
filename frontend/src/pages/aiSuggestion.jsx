import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { getChatbotSuggestion } from "../services/chatbotService";

const predefinedQuestions = [
  "How many calories should I consume daily?",
  "Suggest a healthy dinner option.",
  "How much water should I drink today?",
  "Give me a workout routine.",
];

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function AISuggestions() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const username = localStorage.getItem("username");

  const sendMessage = async (text, fromUser = true) => {
    const timestamp = new Date().toLocaleTimeString();
    const userMsg = { text, fromUser, timestamp };
    setMessages((prev) => [...prev, userMsg]);

    if (fromUser) {
      const thinkingMsg = {
        text: "Thinking...",
        fromUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, thinkingMsg]);

      try {
        const aiResponse = await getChatbotSuggestion(username, text, formatLocalDate(new Date()));
        const aiMsg = {
          text: aiResponse || "Sorry, I couldn't understand that.",
          fromUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessageIndex = updatedMessages.findLastIndex((msg) => msg.text === "Thinking...");
          if (lastMessageIndex !== -1) {
            updatedMessages[lastMessageIndex] = aiMsg;
          } else {
            updatedMessages.push(aiMsg);
          }
          return updatedMessages;
        });
      } catch {
        const errorMsg = {
          text: "Something went wrong, please try again later.",
          fromUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex min-h-0 flex-1 flex-col p-4 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">AI coach</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">AI Suggestions</h2>
              <p className="mt-2 text-sm text-slate-500">Ask questions using your food and water history.</p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700">
              <Sparkles className="h-4 w-4" />
              Context aware
            </div>
          </div>

          <section className="grid min-h-[620px] flex-1 gap-6 xl:grid-cols-[320px_1fr]">
            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-950">Quick prompts</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">Start with a common question, then continue naturally.</p>

              <div className="mt-5 space-y-3">
                {predefinedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </aside>

            <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
                {messages.length === 0 && (
                  <div className="flex h-full min-h-80 items-center justify-center text-center">
                    <div>
                      <Bot className="mx-auto h-12 w-12 text-slate-300" />
                      <h3 className="mt-4 text-lg font-black text-slate-900">Ask for nutrition guidance</h3>
                      <p className="mt-2 max-w-sm text-sm text-slate-500">
                        Your assistant can use logged meals and hydration history to suggest next steps.
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div key={idx} className={`mb-4 flex ${msg.fromUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.fromUser ? "bg-blue-600 text-white" : "bg-white text-slate-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-6">{msg.text}</div>
                      <div className={`mt-2 text-right text-[10px] ${msg.fromUser ? "text-blue-100" : "text-slate-400"}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-slate-200 bg-white p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="Ask something..."
                  />
                  <button
                    onClick={() => {
                      if (input.trim()) {
                        sendMessage(input.trim());
                        setInput("");
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
