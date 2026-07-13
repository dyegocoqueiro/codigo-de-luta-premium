import { useState, useRef, useEffect } from "react";
import { getKodeResponse, SUGGESTED_QUESTIONS } from "../data/kodeAI";
import kodeAvatar from "@assets/kode-avatar_1782758047742.png";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: number;
}

let msgIdCounter = 0;

export default function KodeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: msgIdCounter++,
      role: "assistant",
      content: "Saudações, guerreiro. Sou o **Kode**, seu treinador de combate híbrido.\n\nEstou aqui para guiar seu treino no sistema Código de Luta — Boxe, Muay Thai, Kickboxing, Sanda, BJJ Solo, Sambo/Wrestling, Krav Maga e MMA Integrado.\n\nMe pergunte sobre técnicas, combos, condicionamento, o programa de 3 meses ou qualquer combo de 1 a 140. Estou pronto.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { id: msgIdCounter++, role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await simulateTyping(getKodeResponse(text));
  };

  const simulateTyping = async (response: string) => {
    const delay = Math.min(800 + response.length * 8, 2500);
    await new Promise(r => setTimeout(r, delay));
    setIsTyping(false);
    setMessages(prev => [...prev, { id: msgIdCounter++, role: "assistant", content: response }]);
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={j} style={{ color: "#f8c54d" }}>{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-full" style={{ maxHeight: "600px" }}>
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ minHeight: "300px", maxHeight: "420px" }}
        data-testid="chat-messages"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 msg-in ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            data-testid={`chat-message-${msg.role}-${msg.id}`}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-red-600/30 rounded-full" />
                  <img src={kodeAvatar} alt="Kode" className="w-8 h-8 object-cover relative z-10" />
                </div>
              </div>
            )}
            <div
              className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={
                msg.role === "assistant"
                  ? {
                      background: "rgba(16,22,33,0.9)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#e8edf5",
                    }
                  : {
                      background: "linear-gradient(135deg, #d50f32, #a00924)",
                      color: "#fff",
                    }
              }
            >
              {renderContent(msg.content)}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 msg-in">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img src={kodeAvatar} alt="Kode" className="w-8 h-8 object-cover" />
            </div>
            <div
              className="px-4 py-3 rounded-2xl"
              style={{ background: "rgba(16,22,33,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#d50f32",
                      animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isTyping}
              className="text-xs px-3 py-1.5 rounded-full transition-all disabled:opacity-40"
              style={{
                background: "rgba(213,15,50,0.1)",
                border: "1px solid rgba(213,15,50,0.2)",
                color: "#f8c54d",
              }}
              data-testid={`suggested-question-${q.slice(0, 10)}`}
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte ao Kode sobre treino, técnicas, combos..."
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
            data-testid="chat-input"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #d50f32, #a00924)",
              color: "#fff",
              border: "none",
            }}
            data-testid="chat-send"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
