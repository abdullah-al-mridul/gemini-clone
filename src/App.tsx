import { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import type { ChatState, Message } from "./types";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Fetching from an API
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  throw new Error("API key is missing! Check your environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

const fetchResponseFromAPI = async (message: string): Promise<string> => {
  try {
    const result = await model.generateContent([message]);
    return result.response.text();
  } catch (error) {
    console.error("Error fetching API response:", error);
    return "Something went wrong. Please try again later.";
  }
};

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = { role: "user", content };
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      // Get AI response
      const response = await fetchResponseFromAPI(content);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error:", error);
      setChatState((prev) => ({ ...prev, isLoading: false }));
    }
  };
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatState.messages]);
  // Get screen height
  useEffect(() => {
    const updateScreenHeight = () => {
      document.documentElement.style.setProperty(
        "--screen-height",
        `${window.innerHeight}px`
      );
    };

    // Set initial value
    updateScreenHeight();

    // Add resize event listener
    window.addEventListener("resize", updateScreenHeight);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updateScreenHeight);
    };
  }, []);
  return (
    <div className="flex flex-col h-[var(--screen-height)] bg-gray-900">
      {/* Header */}
      <header className="flex items-center gap-2 p-4 border-b border-gray-700 bg-gray-800">
        <Bot className="w-6 h-6 text-blue-400" />
        <h1 className="text-xl font-semibold text-gray-100">Gemini Clone</h1>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {chatState.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Bot className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <p className="text-xl">How can I help you today?</p>
              <p className=" text-xs mt-1 font-medium">
                Designed and Developed by{" "}
                <a
                  className=" hover:text-[#60A5FA] transition-all relative after:absolute after:content-[''] after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#60A5FA] hover:after:w-full after:transition-all"
                  href="https://abdullah-al-mridul-dev.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abdullah
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl pb-5 mx-auto">
            {chatState.messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {chatState.isLoading && (
              <div className="p-4 text-center text-gray-400">Thinking...</div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={handleSendMessage}
            disabled={chatState.isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
