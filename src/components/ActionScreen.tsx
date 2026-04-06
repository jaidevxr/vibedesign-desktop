import { useState, useRef, useEffect } from "react";
import { streamChat, type ChatMessage } from "@/lib/ai";
import { addSession, getTotalSessionCount } from "@/lib/store";

interface Props {
  onBack: () => void;
  onComplete: (sessionData: { duration: number; wordCount: number }) => void;
  onNavigateMeditate: () => void;
}

const suggestedPrompts = [
  "I'm feeling overwhelmed at work",
  "Help me process today's emotions",
  "I need motivation right now",
  "I'm anxious and can't calm down",
];

const ActionScreen = ({ onBack, onComplete, onNavigateMeditate }: Props) => {
  const [activeTab, setActiveTab] = useState<"therapist" | "reset">("therapist");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const [sessionStart] = useState(Date.now());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const totalWordCount = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    setError("");

    const userMsg: ChatMessage = { role: "user", content: text.trim(), timestamp: Date.now() };
    totalWordCount.current += text.trim().split(/\s+/).length;
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsStreaming(true);

    let accumulated = "";
    const assistantMsg: ChatMessage = { role: "assistant", content: "", timestamp: Date.now() };

    // Add empty assistant message that we'll fill via streaming
    setMessages([...updated, assistantMsg]);

    await streamChat(
      updated,
      (chunk) => {
        accumulated += chunk;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { ...copy[copy.length - 1], content: accumulated };
          return copy;
        });
      },
      () => {
        setIsStreaming(false);
      },
      (err) => {
        setIsStreaming(false);
        setError(err);
        // remove the empty assistant message on error
        if (!accumulated) {
          setMessages(updated);
        }
      }
    );
  };

  const handleFinishSession = () => {
    const duration = Math.round((Date.now() - sessionStart) / 1000);
    addSession({
      type: "chat",
      duration,
      wordCount: totalWordCount.current,
      moodBefore: undefined,
      moodAfter: undefined,
    });
    onComplete({ duration, wordCount: totalWordCount.current });
  };

  const sessionCount = getTotalSessionCount();
  const elapsed = Math.floor((Date.now() - sessionStart) / 1000);

  return (
    <div className="gradient-calm relative flex h-[100dvh] flex-col overflow-hidden">
      {/* Decorative */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-16 right-4 h-24 w-24 rounded-full bg-peach/20 blur-2xl animate-float-slow" />
        <div className="absolute bottom-32 left-4 h-20 w-20 rounded-full bg-sage/15 blur-xl animate-float" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-4 pt-14">
        {/* Header */}
        <div className="mb-4 animate-fade-up flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="glass-subtle inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
              Back
            </button>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleFinishSession}
              className="glass-subtle inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-primary font-semibold transition-all active:scale-95"
            >
              End Session ✓
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <h1 className="font-heading text-xl text-foreground">Your Session</h1>
          {messages.length > 0 && (
            <span className="text-[10px] text-muted-foreground font-mono glass-subtle rounded-full px-2 py-0.5">
              {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}
            </span>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="glass-strong flex rounded-2xl p-1.5 mb-4 animate-fade-up shrink-0" style={{ animationDelay: "0.1s" }}>
          {(["therapist", "reset"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <span>{tab === "therapist" ? "🎙️" : "🌿"}</span>
              {tab === "therapist" ? "AI Therapist" : "Quick Reset"}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {activeTab === "therapist" ? (
          <div className="flex flex-1 flex-col min-h-0">
            {/* Chat Messages or Welcome */}
            <div className="flex-1 overflow-y-auto chat-scroll pr-1">
              {messages.length === 0 ? (
                /* Welcome State */
                <div className="animate-fade-up space-y-4">
                  <div className="glass-strong rounded-[1.75rem] p-5 text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-sage-light/60">
                      <span className="text-[2rem]">🧠</span>
                    </div>
                    <h2 className="font-heading text-lg text-foreground">Talk to MindSync</h2>
                    <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed max-w-[240px] mx-auto">
                      Share what's on your mind. I'll listen and help you find clarity with real techniques.
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-3">
                      {[
                        { label: "Sessions", value: String(sessionCount) },
                        { label: "Model", value: "Llama 3.3" },
                        { label: "Powered by", value: "Groq" },
                      ].map((s) => (
                        <div key={s.label} className="glass-subtle rounded-lg px-2.5 py-1.5">
                          <p className="text-[11px] font-bold text-foreground">{s.value}</p>
                          <p className="text-[8px] text-muted-foreground">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-3.5">
                    <p className="mb-2 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/70">Try saying...</p>
                    <div className="space-y-1.5">
                      {suggestedPrompts.map((p) => (
                        <button
                          key={p}
                          onClick={() => sendMessage(p)}
                          className="glass-subtle w-full text-left rounded-xl px-3.5 py-2.5 text-[11px] text-foreground/70 transition-all active:scale-[0.98] hover:bg-white/50"
                        >
                          "{p}"
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Bubbles */
                <div className="space-y-3 py-2">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} ${
                        msg.role === "user" ? "animate-slide-in-right" : "animate-slide-in-left"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-md"
                            : "glass-strong text-foreground rounded-tl-md"
                        }`}
                      >
                        {msg.role === "assistant" && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-[10px]">🧠</span>
                            <span className="text-[9px] font-semibold text-primary uppercase tracking-wider">MindSync</span>
                          </div>
                        )}
                        <p className="text-[12px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-[8px] mt-1.5 ${msg.role === "user" ? "text-primary-foreground/50 text-right" : "text-muted-foreground/50"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isStreaming && messages[messages.length - 1]?.content === "" && (
                    <div className="flex justify-start animate-slide-in-left">
                      <div className="glass-strong rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px]">🧠</span>
                          <span className="text-[9px] font-semibold text-primary">MindSync</span>
                        </div>
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="h-2 w-2 rounded-full bg-primary/40 animate-typing-dot"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="glass-subtle rounded-xl px-3 py-2 mb-2 border border-accent/30">
                <p className="text-[10px] text-accent font-medium">⚠️ {error}</p>
              </div>
            )}

            {/* Input Bar */}
            <div className="glass-strong rounded-2xl p-2 flex items-center gap-2 mt-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your thoughts..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                disabled={isStreaming}
                className="flex-1 bg-transparent border-none outline-none text-[12px] text-foreground placeholder:text-muted-foreground/50 px-3 py-2 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isStreaming}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all active:scale-90 disabled:opacity-30 disabled:active:scale-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* Quick Reset Tab */
          <div className="flex-1 overflow-y-auto chat-scroll animate-fade-up space-y-4">
            <div className="glass-strong rounded-[1.75rem] p-5 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-peach/40">
                <span className="text-[2rem]">🌿</span>
              </div>
              <h2 className="font-heading text-lg text-foreground">Quick Reset Ritual</h2>
              <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed max-w-[240px] mx-auto">
                A guided exercise to calm your nervous system and bring you back to center.
              </p>
            </div>

            <div className="glass rounded-2xl p-3.5">
              <p className="mb-2 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/70">Choose a ritual</p>
              <div className="space-y-2">
                {[
                  { emoji: "🫁", name: "Box Breathing", time: "4-4-4-4", desc: "Calm your mind" },
                  { emoji: "🧘", name: "Body Scan", time: "2 min", desc: "Release tension" },
                  { emoji: "🙏", name: "Gratitude Pause", time: "1 min", desc: "Shift perspective" },
                ].map((r) => (
                  <button
                    key={r.name}
                    onClick={onNavigateMeditate}
                    className="glass-subtle w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all active:scale-[0.98] hover:bg-white/40"
                  >
                    <span className="text-xl">{r.emoji}</span>
                    <div className="flex-1 text-left">
                      <p className="text-[12px] font-semibold text-foreground">{r.name}</p>
                      <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                    </div>
                    <span className="text-[10px] text-primary font-medium bg-primary/10 rounded-full px-2 py-0.5">{r.time}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionScreen;
