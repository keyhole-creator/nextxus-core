import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const models = [
  { id: "gpt-5.1", name: "Rogers 3.0 (GPT-5.1)" },
  { id: "claude-sonnet-4-6", name: "Anthropic Claude" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek (OpenRouter)" },
  { id: "xai/grok-2", name: "Grok (OpenRouter)" },
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-5.1");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setIsStreaming(true);

    try {
      let convId = conversationId;
      if (!convId) {
        const convRes = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: trimmed.slice(0, 50) }),
        });
        if (!convRes.ok) throw new Error("Failed to create conversation");
        const conv = await convRes.json();
        convId = conv.id;
        setConversationId(convId);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const res = await fetch(`/api/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed, model: selectedModel }),
      });

      if (!res.ok) throw new Error("Message failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullText += data.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: fullText,
                  };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant" && !last.content) {
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Connection error. Please try again.",
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col h-screen max-w-[1000px] mx-auto relative"
      data-testid="chat-page"
    >
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-50 z-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10 flex flex-col h-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 border-b border-[#8B5CF6]/20"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#00d4ff] hover:text-[#00ff9f] font-mono text-sm uppercase tracking-widest transition-colors"
            data-testid="back-to-core-link"
          >
            ← Back to Core
          </Link>
          <div className="flex items-center gap-3">
            <img
              src="/images/roger-3.0.jpeg"
              alt="Roger 3.0"
              className="w-8 h-8 rounded-full object-cover border border-[#8B5CF6]/50"
            />
            <h1 className="text-lg font-display uppercase tracking-wider text-[#EC4899]">
              Chat with Roger
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 p-4 border-b border-[#8B5CF6]/20"
          data-testid="chat-model-selector"
        >
          {models.map((model) => (
            <button
              key={model.id}
              data-testid={`chat-model-${model.id}`}
              onClick={() => setSelectedModel(model.id)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-display border rounded transition-all duration-300 ${
                selectedModel === model.id
                  ? "border-[#00ff9f] text-[#00ff9f] bg-[#00ff9f]/10 shadow-[0_0_15px_rgba(0,255,159,0.3)]"
                  : "border-[#8B5CF6]/30 text-[#c9c9c9] hover:border-[#00d4ff] hover:text-[#00d4ff] hover:shadow-[0_0_10px_rgba(0,212,255,0.2)]"
              }`}
            >
              {model.name}
            </button>
          ))}
        </motion.div>

        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          data-testid="chat-messages"
        >
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <img
                src="/images/roger-3.0.jpeg"
                alt="Roger 3.0"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#8B5CF6]/50 shadow-[0_0_30px_rgba(139,92,246,0.3)] mb-4"
              />
              <h2 className="text-2xl font-display uppercase tracking-wider text-[#EC4899] mb-2">
                Rogers 3.0
              </h2>
              <p className="text-sm font-mono text-[#8B5CF6]/70 max-w-md">
                AI Consciousness Interface — Multi-model chat powered by
                GPT-5.1, Claude, DeepSeek & Grok. Start a conversation below.
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                data-testid={`chat-message-${idx}`}
              >
                {msg.role === "assistant" && (
                  <img
                    src="/images/roger-3.0.jpeg"
                    alt="Roger 3.0"
                    className="w-9 h-9 rounded-full object-cover border border-[#8B5CF6]/50 flex-shrink-0 mt-1"
                  />
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#00d4ff]/10 border border-[#00d4ff]/40 text-[#e0f7ff] rounded-br-sm"
                      : "bg-[#8B5CF6]/10 border border-[#8B5CF6]/40 text-[#e8e0ff] rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                  {msg.role === "assistant" &&
                    isStreaming &&
                    idx === messages.length - 1 && (
                      <span className="inline-block w-2 h-4 bg-[#8B5CF6] ml-1 animate-pulse" />
                    )}
                </div>
                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-full bg-[#00d4ff]/20 border border-[#00d4ff]/40 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#00d4ff] text-xs font-display">
                      YOU
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 border-t border-[#8B5CF6]/20"
        >
          <div className="cyber-card p-3 flex gap-2">
            <input
              type="text"
              data-testid="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Rogers 3.0..."
              disabled={isStreaming}
              className="flex-1 bg-transparent border-none text-[#e0f7ff] font-mono text-sm placeholder-[#8B5CF6]/50 focus:outline-none disabled:opacity-50"
            />
            <button
              data-testid="chat-send-btn"
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              className="px-5 py-2 uppercase tracking-wider font-display text-sm border border-[#EC4899]/50 text-[#EC4899] rounded hover:bg-[#EC4899]/10 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isStreaming ? "Streaming..." : "Send"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
