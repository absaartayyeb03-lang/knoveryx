"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiChatWidgetProps {
  role: "student" | "tutor";
}

const SUGGESTIONS: Record<"student" | "tutor", string[]> = {
  student: [
    "How do I book a lesson?",
    "How do Zoom classes work?",
    "How can I track my progress?",
  ],
  tutor: [
    "How do I get paid?",
    "How do I start a Zoom class?",
    "How do I update my availability?",
  ],
};

export default function AiChatWidget({ role }: AiChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accentColor = role === "student" ? "#033D8B" : "#174933";
  const greeting =
    role === "student"
      ? "Hi! I'm Kova, your Knoveryx assistant. I can help you with bookings, your schedule, Zoom classes, and more. What do you need?"
      : "Hi! I'm Kova, your Knoveryx assistant. I can help you with lessons, payments, Zoom classes, and platform questions. What can I help with?";

  useEffect(() => {
    if (open && !started) {
      setMessages([{ role: "assistant", content: greeting }]);
      setStarted(true);
    }
  }, [open, started, greeting]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function send(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Something went wrong. Try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 right-5 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95"
        style={{ backgroundColor: accentColor }}
        aria-label="Open AI assistant"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-36 right-5 md:bottom-24 md:right-6 z-50 w-[calc(100vw-2.5rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: "420px" }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 text-white" style={{ backgroundColor: accentColor }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">Kova</p>
              <p className="text-xs text-white/70 mt-0.5">Knoveryx AI Assistant</p>
            </div>
            <span className="ml-auto flex items-center gap-1 text-xs text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Online
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                  style={msg.role === "user" ? { backgroundColor: accentColor } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                </div>
              </div>
            )}

            {/* Quick suggestions — only on first message */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS[role].map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs border rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors font-medium text-gray-600 border-gray-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t bg-gray-50 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask me anything…"
              className="flex-1 text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-gray-400 transition-colors"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ backgroundColor: accentColor }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
