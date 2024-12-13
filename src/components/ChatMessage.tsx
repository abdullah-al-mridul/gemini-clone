import React from "react";
import { Bot, User } from "lucide-react";
import type { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "assistant";

  return (
    <div className={`flex gap-4 p-6 ${isBot ? "bg-gray-800" : "bg-gray-900"}`}>
      <div className="flex-shrink-0">
        {isBot ? (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-gray-900" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-900" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-gray-100 whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
