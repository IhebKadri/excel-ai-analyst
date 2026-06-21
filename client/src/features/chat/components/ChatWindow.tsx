import { useState } from "react";
import { useChat } from "../hooks/useChat";
import { ChatMessage } from "./ChatMessage";

interface Props {
  fileId: string;
}

export function ChatWindow({ fileId }: Props) {
  const { messages, send, isLoading, error } = useChat(fileId);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    send(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl border overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 min-h-0">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center pt-8 text-sm">
            Ask anything about your spreadsheet...
          </p>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {isLoading && (
          <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 max-w-[80%]">
            Thinking...
          </div>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What was total revenue in Q1?"
          maxLength={300}
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
