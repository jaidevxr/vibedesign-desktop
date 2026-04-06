import { useEffect, useState } from "react";
import { getCurrentStreak } from "@/lib/store";
import { quickChat } from "@/lib/ai";
import { Sparkles, MessageCircle, Wind, Home } from "lucide-react";

interface Props {
  onReset: () => void;
  sessionData?: { duration: number; wordCount?: number; type?: string };
}

const ConfirmationScreen = ({ onReset, sessionData }: Props) => {
  const streak = getCurrentStreak();
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [loadingTakeaways, setLoadingTakeaways] = useState(true);

  const duration = sessionData?.duration || 0;
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const durationStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const wordCount = sessionData?.wordCount || 0;
  const sessionType = sessionData?.type || "chat";

  useEffect(() => {
    const fetchTakeaways = async () => {
      setLoadingTakeaways(true);
      const prompt = sessionType === "chat"
        ? `The user just finished a ${durationStr} minute AI therapy chat session where they typed ${wordCount} words. Give 3 very short wellness takeaways (1 line each, with an emoji at start). Be encouraging and specific to their session length.`
        : `The user just completed a ${durationStr} minute breathing/meditation exercise. Give 3 very short wellness takeaways (1 line each, with an emoji at start). Celebrate their practice.`;
      const response = await quickChat(prompt);
      if (response) {
        const lines = response.split("\n").filter((l) => l.trim().length > 5).slice(0, 3);
        setTakeaways(lines);
      } else {
        setTakeaways([
          "🫁 Deep breathing activates your parasympathetic nervous system",
          "⏰ Regular sessions build lasting mental resilience",
          "📝 You're building a powerful self-care habit",
        ]);
      }
      setLoadingTakeaways(false);
    };
    fetchTakeaways();
  }, []);

  return (
    <div className="gradient-calm relative flex h-[100dvh] flex-col overflow-y-auto overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-primary/8 blur-3xl animate-breathe" />
        <div className="absolute bottom-32 right-8 h-24 w-24 rounded-full bg-peach/20 blur-2xl animate-float" />
        <div className="absolute top-1/3 left-6 h-16 w-16 rounded-full bg-sage/15 blur-xl animate-float-slow" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-8 pt-14">
        {/* Success */}
        <div className="animate-scale-in text-center mb-6">
          <div className="relative mx-auto mb-5">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 animate-breathe" />
            </div>
            <div className="relative flex h-20 w-20 mx-auto items-center justify-center rounded-full glass-strong shadow-xl">
              <Sparkles size={32} strokeWidth={1.5} className="text-primary" />
            </div>
          </div>
          <h1 className="font-heading text-[2rem] text-foreground leading-tight">Session Complete</h1>
          <p className="mt-2 text-[12px] text-muted-foreground max-w-[240px] mx-auto">
            {sessionType === "chat" ? "Great job opening up. Every conversation builds self-awareness." : "Beautiful practice. Your body and mind thank you."}
          </p>
        </div>

        {/* Streak */}
        <div className="glass-strong rounded-[1.75rem] p-6 mb-4 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/70">Progress Streak</p>
            <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2.5 py-0.5 flex items-center gap-1">
              <span className="text-xs">🔥</span> {streak} {streak === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-1.5">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-[11px] font-semibold transition-all duration-300 ${i < Math.min(streak, 7) ? "bg-primary text-primary-foreground shadow-sm" : "glass-subtle text-muted-foreground/40"}`}>
                  {i < Math.min(streak, 7) ? "✓" : d}
                </div>
                <span className="text-[8px] text-muted-foreground/50">{d}</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-4 text-[11px] text-muted-foreground">
            {streak >= 7 ? "🎉 Amazing streak! You're unstoppable!" : streak >= 3 ? "🔥 You're on a roll!" : streak === 1 ? "Great start! Come back tomorrow 💪" : "Start your streak today!"}
          </p>
        </div>

        {/* Session Stats */}
        <div className="glass rounded-2xl p-4 mb-4 animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{durationStr}<span className="text-[10px] text-muted-foreground font-normal"> min</span></p>
              <p className="text-[9px] text-muted-foreground">Duration</p>
            </div>
            {wordCount > 0 && (
              <>
                <div className="w-[1px] h-8 bg-border/50" />
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{wordCount}</p>
                  <p className="text-[9px] text-muted-foreground">Words</p>
                </div>
              </>
            )}
            <div className="w-[1px] h-8 bg-border/50" />
            <div className="text-center flex flex-col items-center">
              {sessionType === "chat" ? <MessageCircle size={18} className="text-primary mb-0.5" /> : <Wind size={18} className="text-primary mb-0.5" />}
              <p className="text-[9px] text-muted-foreground">{sessionType === "chat" ? "AI Chat" : "Meditation"}</p>
            </div>
          </div>
        </div>

        {/* AI Takeaways */}
        <div className="glass-strong rounded-[1.75rem] p-5 mb-4 animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} className="text-primary" />
            <p className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/70">AI-Powered Takeaways</p>
          </div>
          <div className="space-y-2.5">
            {loadingTakeaways ? (
              [0, 1, 2].map((i) => (
                <div key={i} className="glass-subtle rounded-xl px-4 py-3 h-10 animate-shimmer" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 100%)", backgroundSize: "200% 100%", animationDelay: `${i * 0.2}s` }} />
              ))
            ) : (
              takeaways.map((t, i) => (
                <div key={i} className="glass-subtle flex items-start gap-3 rounded-xl px-4 py-3 animate-fade-up" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                  <p className="text-[12px] text-foreground/75 leading-relaxed">{t}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto space-y-3 animate-fade-up" style={{ animationDelay: "0.5s" }}>
          <button onClick={onReset} className="w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 active:scale-[0.97] hover:shadow-lg flex items-center justify-center gap-2">
            <Home size={16} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
