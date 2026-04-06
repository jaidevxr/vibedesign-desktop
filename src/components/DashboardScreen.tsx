import { useEffect, useState, useMemo } from "react";
import BottomNav from "./BottomNav";
import { User, Brain, Zap, Moon, Heart, Lightbulb, Flame, Mic, Leaf } from "lucide-react";
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

  useEffect(() => {
    const timer = setTimeout(() => setScore(targetScore), 400);
    return () => clearTimeout(timer);
  }, [targetScore]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const moodLabel: Record<string, string> = { calm: "😌 Calm", happy: "😊 Happy", low: "😔 Low", stressed: "😤 Stressed", tired: "😴 Tired", anxious: "🤔 Anxious" };

  const insights = useMemo(() => {
    const items = [];
    if (score >= 70) {
      items.push({ icon: Brain, title: "Great Energy!", desc: `Your score is ${score}/100 — keep it up`, trend: `+${Math.min(score - 50, 30)}%`, color: "bg-primary/10 text-primary" });
    } else {
      items.push({ icon: Brain, title: "Room to Grow", desc: `Score is ${score}/100 — try a session`, trend: `${score - 60}%`, color: "bg-primary/10 text-primary" });
    }
    if (streak > 0) {
      items.push({ icon: Flame, title: `${streak}-Day Streak`, desc: streak >= 7 ? "Incredible consistency!" : "Keep building momentum", trend: `+${streak * 3}%`, color: "bg-peach/20 text-accent" });
    } else {
      items.push({ icon: Flame, title: "Start a Streak", desc: "Complete a session today!", trend: "0%", color: "bg-peach/20 text-accent" });
    }
    const moodTip: Record<string, string> = {
      stressed: "Try a breathing exercise", anxious: "Box breathing may help",
      low: "A quick reset could lift you", tired: "Consider a mindful pause",
      calm: "Perfect time for reflection", happy: "Channel this into gratitude",
    };
    items.push({ icon: Lightbulb, title: "Suggestion", desc: moodTip[mood] || "Take a mindful moment", trend: "", color: "bg-sage/20 text-teal" });
    return items;
  }, [score, streak, mood]);

  return (
    <div className="gradient-calm relative flex h-[100dvh] flex-col overflow-y-auto overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-peach/25 blur-3xl" />
        <div className="absolute top-1/3 -left-16 h-40 w-40 rounded-full bg-sage/20 blur-2xl" />
        <div className="absolute bottom-20 right-0 h-32 w-32 rounded-full bg-primary/8 blur-2xl animate-breathe" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-4 sm:px-5 pb-6 sm:pb-8 pt-10 sm:pt-14">
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
            <button onClick={() => onNavigate("profile")} className="glass h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 hover:shadow-md">
              <User size={16} strokeWidth={2} className="text-foreground/70" />
            </button>
          </div>
        </div>

        {/* Energy Score Card */}
        <div className="glass-strong rounded-[1.75rem] p-6 mb-5 animate-fade-up border-primary/10 shadow-xl shadow-primary/5 cursor-pointer transition-all duration-300 active:scale-[0.98] hover:shadow-2xl" onClick={() => onNavigate("stats")} style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-primary" />
              <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70">AI Energy Score</p>
            </div>
            <span className="text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Live
            </span>
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
              <p className="text-[11px] text-muted-foreground leading-relaxed">Based on mood, sessions, and activity streak.</p>
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
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-semibold transition-all duration-300 ${weekActivity[i] > 0 ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground/40"}`}>
                  {weekActivity[i] > 0 ? "✓" : d}
                </div>
                <span className="text-[8px] text-muted-foreground/50">{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="mb-5 animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70 mb-3">Today's Insights</p>
          <div className="space-y-2.5">
            {insights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="glass-strong flex items-center gap-3.5 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/50 active:scale-[0.98]" onClick={() => onNavigate("stats")}>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                  </div>
                  {item.trend && (
                    <span className={`text-[11px] font-semibold shrink-0 ${item.trend.startsWith("+") ? "text-primary" : "text-accent"}`}>{item.trend}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-up mb-6" style={{ animationDelay: "0.4s" }}>
          <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70 mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onNavigate("action")} className="glass-strong flex flex-col items-center gap-2.5 rounded-2xl p-5 transition-all duration-300 active:scale-95 hover:shadow-lg group">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 group-active:bg-primary/20 transition-colors duration-300">
                <Mic size={24} strokeWidth={1.8} className="text-primary" />
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-foreground block">Talk to AI</span>
                <span className="text-[10px] text-muted-foreground">Chat session</span>
              </div>
            </button>
            <button onClick={() => onNavigate("meditate")} className="glass-strong flex flex-col items-center gap-2.5 rounded-2xl p-5 transition-all duration-300 active:scale-95 hover:shadow-lg group">
              <div className="h-14 w-14 rounded-2xl bg-peach/20 flex items-center justify-center group-hover:bg-peach/30 group-active:bg-peach/40 transition-colors duration-300">
                <Leaf size={24} strokeWidth={1.8} className="text-peach-deep" />
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
