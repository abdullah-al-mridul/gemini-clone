import React, { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800">
      <div className="max-w-3xl mx-auto flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Gemini..."
          disabled={disabled}
          className="flex-1 p-4 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 outline-none focus:ring-2 transition-all focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:border-gray-700"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="p-4 rounded-xl bg-blue-600 text-gray-100 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
