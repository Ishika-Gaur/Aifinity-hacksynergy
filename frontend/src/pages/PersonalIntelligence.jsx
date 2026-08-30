import React, { useState, useEffect, useRef } from "react";
import { personalIntelligenceService } from "../services/personalIntelligenceService";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function PersonalIntelligence() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am AIFinity Personal Intelligence. I've analyzed your learning journey, assessment scores, and roadmap. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = [...messages, userMessage];
      const aiResponse = await personalIntelligenceService.chat(chatHistory);
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Unable to generate your insight right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (text) => {
    setInput(text);
  };

  const SUGGESTED_PROMPTS = [
    "What should I study today?",
    "Explain my weakest topic",
    "Analyze my mistakes",
    "How can I improve my score?",
    "Create a study plan for me",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] bg-[#FBF8F0] lg:px-8 px-4 py-6 mx-auto max-w-4xl w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1B332C]" style={{ fontFamily: "var(--font-display)" }}>
            Personal Intelligence
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Your AI learning companion tailored to your progress.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => navigate("/dashboard")}>
          Dashboard
        </Button>
      </div>

      <div className="flex-1 bg-white border border-[#2E4F42]/20 rounded-2xl shadow-[var(--shadow-card)] flex flex-col overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4" ref={scrollContainerRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1B332C] text-white rounded-br-sm shadow-md"
                    : "bg-[#F1EDE1] text-[#24413A] rounded-bl-sm shadow-sm"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#F1EDE1] text-[#24413A] rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm text-sm flex gap-2 items-center">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#1B332C]/50 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#1B332C]/50 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-[#1B332C]/50 rounded-full animate-bounce delay-150"></span>
                </div>
                <span className="text-xs font-medium text-[#24413A]/80 italic">Analyzing your learning data...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#2E4F42]/10 bg-white">
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handlePromptClick(prompt)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#C4952A]/40 text-[#1B332C] bg-[#FBF8F0] hover:bg-[#EDE6D3] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your learning journey..."
              className="flex-1 rounded-xl border border-[var(--color-border)] bg-[#FBF8F0] px-4 py-3 text-sm text-[var(--color-text-h)] focus:border-[#1B332C] focus:outline-none focus:ring-2 focus:ring-[#1B332C]/10 transition-shadow"
              disabled={loading}
            />
            <Button type="submit" disabled={!input.trim() || loading} className="shrink-0 px-6 shadow-sm">
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
