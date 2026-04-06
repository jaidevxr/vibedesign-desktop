import { useEffect, useState, useMemo } from "react";
import BottomNav from "./BottomNav";
import { calculateEnergyScore, getWeeklyActivity, getCurrentStreak, getPreferences, getDailyEnergyHistory } from "@/lib/store";

interface Props {
  mood: string;
  onNavigate: (screen: "dashboard" | "stats" | "meditate" | "profile" | "action") => void;
}

const weekDayLabels = ["M", "T", "W", "T", "F", "S", "S"];

const DashboardScreen = ({ mood, onNavigate }: Props) => {
  const [score, setScore] = useState(0);
  const targetScore = useMemo(() => calculateEnergyScore(), [mood]);
  const weekActivity = useMemo(() => getWeeklyActivity(), []);
  const streak = getCurrentStreak();
  const activeDays = weekActivity.filter((d) => d > 0).length;
  const userName = getPreferences().name;
  const energyHistory = useMemo(() => getDailyEnergyHistory(), []);

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => setScore(targetScore), 400);
    return () => clearTimeout(timer);
  }, [targetScore]);

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const moodLabel: Record<string, string> = { calm: "😌 Calm", happy: "😊 Happy", low: "😔 Low", stressed: "😤 Stressed", tired: "😴 Tired", anxious: "🤔 Anxious" };

  // Dynamic insights based on real data
  const insights = useMemo(() => {
    const items = [];
    if (score >= 70) {
      items.push({ icon: "🧠", title: "Great Energy!", desc: `Your score is ${score}/100 — keep it up`, trend: `+${Math.min(score - 50, 30)}%` });
    } else {
      items.push({ icon: "🧠", title: "Room to Grow", desc: `Score is ${score}/100 — try a session`, trend: `${score - 60}%` });
    }
    if (streak > 0) {
      items.push({ icon: "🔥", title: `${streak}-Day Streak`, desc: streak >= 7 ? "Incredible consistency!" : "Keep building momentum", trend: `+${streak * 3}%` });
    } else {
      items.push({ icon: "💤", title: "Start a Streak", desc: "Complete a session today!", trend: "0%" });
    }
    const moodTip: Record<string, string> = {
      stressed: "💆 Try a breathing exercise",
      anxious: "🫁 Box breathing may help",
      low: "🌿 A quick reset could lift you",
      tired: "😴 Consider a mindful pause",
      calm: "🧘 Perfect time for reflection",
      happy: "✨ Channel this into gratitude",
    };
    items.push({ icon: "💡", title: "Suggestion", desc: moodTip[mood] || "Take a mindful moment", trend: "" });
    return items;
  }, [score, streak, mood]);

  return (
    <div className="gradient-calm relative flex h-[100dvh] flex-col overflow-y-auto overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-peach/25 blur-3xl" />
        <div className="absolute top-1/3 -left-16 h-40 w-40 rounded-full bg-sage/20 blur-2xl" />
        <div className="absolute bottom-20 right-0 h-32 w-32 rounded-full bg-primary/8 blur-2xl animate-breathe" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-8 pt-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-up">
          <div>
            <p className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground/70">{greeting}</p>
            <h1 className="font-heading text-[1.75rem] text-foreground leading-tight">{userName}'s Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass-subtle flex items-center gap-1.5 rounded-full px-3 py-1.5">
              <span className="text-xs">{moodLabel[mood] || "😌 Calm"}</span>
            </div>
            <button onClick={() => onNavigate("profile")} className="glass h-10 w-10 rounded-full flex items-center justify-center transition-transform active:scale-95">
              <span className="text-base">👤</span>
            </button>
          </div>
        </div>

        {/* Energy Score Card */}
        <div className="glass-strong rounded-[1.75rem] p-6 mb-5 animate-fade-up border-primary/10 shadow-xl shadow-primary/5 cursor-pointer transition-transform active:scale-[0.98]" onClick={() => onNavigate("stats")} style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70">AI Energy Score</p>
            <span className="text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">Live</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative flex h-[110px] w-[110px] shrink-0 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="7" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${score * 2.51} 251`} className="transition-all duration-[1.2s] ease-out" />
              </svg>
              <div className="text-center w-full relative z-10 flex flex-col items-center">
                <span className="font-heading text-[2rem] leading-none text-foreground">{score}</span>
                <p className="text-[9px] text-muted-foreground mt-0.5">/ 100</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">
                {score >= 70 ? "You're doing great!" : score >= 50 ? "Room to grow" : "Let's work on this"}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Based on mood, sessions, and activity streak.
              </p>
              {/* Mini bar chart from real data */}
              <div className="flex items-end gap-1 mt-3 h-8 w-full">
                {energyHistory.map((d, i) => (
                  <div key={i} className="flex-1 rounded-full bg-primary/20 relative overflow-hidden">
                    <div className="absolute bottom-0 w-full rounded-full bg-primary transition-all duration-700" style={{ height: `${d.score}%`, transitionDelay: `${i * 100}ms` }} />
                    <div style={{ height: "32px" }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1 w-full">
                {energyHistory.map((d, i) => (
                  <span key={i} className="text-[8px] text-muted-foreground/50 flex-1 text-center">{d.day.charAt(0)}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="glass rounded-2xl p-4 mb-5 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70">This Week</p>
            <p className="text-[10px] text-primary font-medium">{activeDays} of 7 days ✓</p>
          </div>
          <div className="flex gap-2">
            {weekDayLabels.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-semibold transition-all ${weekActivity[i] > 0 ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground/40"}`}>
                  {weekActivity[i] > 0 ? "✓" : d}
                </div>
                <span className="text-[8px] text-muted-foreground/50">{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Insights */}
        <div className="mb-5 animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70 mb-3">Today's Insights</p>
          <div className="space-y-2.5">
            {insights.map((item, i) => (
              <div key={i} className="glass-strong flex items-center gap-3.5 rounded-2xl p-4 cursor-pointer hover:bg-white/40 transition-colors" onClick={() => onNavigate("stats")}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-light/60">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                </div>
                {item.trend && (
                  <span className={`text-[11px] font-semibold shrink-0 ${item.trend.startsWith("+") ? "text-primary" : "text-accent"}`}>
                    {item.trend}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-up mb-6" style={{ animationDelay: "0.4s" }}>
          <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70 mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onNavigate("action")} className="glass-strong flex flex-col items-center gap-2.5 rounded-2xl p-5 transition-all active:scale-95 group">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-active:bg-primary/20 transition-colors">
                <span className="text-2xl">🎙️</span>
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-foreground block">Talk to AI</span>
                <span className="text-[10px] text-muted-foreground">Chat session</span>
              </div>
            </button>
            <button onClick={() => onNavigate("meditate")} className="glass-strong flex flex-col items-center gap-2.5 rounded-2xl p-5 transition-all active:scale-95 group">
              <div className="h-14 w-14 rounded-2xl bg-peach/30 flex items-center justify-center group-active:bg-peach/50 transition-colors">
                <span className="text-2xl">🌿</span>
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-foreground block">Quick Reset</span>
                <span className="text-[10px] text-muted-foreground">Breathing exercise</span>
              </div>
            </button>
          </div>
        </div>

        <BottomNav currentScreen="dashboard" onNavigate={onNavigate as any} />
      </div>
    </div>
  );
};

export default DashboardScreen;
