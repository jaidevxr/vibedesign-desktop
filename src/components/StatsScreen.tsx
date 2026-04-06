import { useState, useMemo } from "react";
import BottomNav from "./BottomNav";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { getDailyEnergyHistory, getMoodDistribution, getCurrentStreak, getTotalSessionCount, getTotalMinutes, getSessions } from "@/lib/store";
import { Flame, Target, Clock, BarChart3 } from "lucide-react";

interface Props {
  onNavigate: (screen: "dashboard" | "stats" | "meditate" | "profile") => void;
}

const COLORS = ["hsl(152,35%,45%)", "hsl(18,60%,85%)", "hsl(175,30%,45%)", "hsl(38,40%,72%)", "hsl(18,70%,75%)", "hsl(152,25%,60%)"];

const StatsScreen = ({ onNavigate }: Props) => {
  const [activeTab, setActiveTab] = useState<"energy" | "sessions" | "mood">("energy");

  const energyData = useMemo(() => getDailyEnergyHistory(), []);
  const moodData = useMemo(() => getMoodDistribution(), []);
  const sessions = useMemo(() => getSessions(), []);
  const streak = getCurrentStreak();
  const totalSessions = getTotalSessionCount();
  const totalMinutes = getTotalMinutes();

  const sessionChartData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result: { day: string; count: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toDateString();
      const count = sessions.filter((s) => new Date(s.timestamp).toDateString() === ds).length;
      result.push({ day: days[d.getDay()], count });
    }
    return result;
  }, [sessions]);

  const energyStats = useMemo(() => {
    if (energyData.length === 0) return { highest: 0, highDay: "-", lowest: 0, lowDay: "-", avg: 0 };
    let highest = energyData[0], lowest = energyData[0];
    let sum = 0;
    energyData.forEach((d) => {
      sum += d.score;
      if (d.score > highest.score) highest = d;
      if (d.score < lowest.score) lowest = d;
    });
    return { highest: highest.score, highDay: highest.day, lowest: lowest.score, lowDay: lowest.day, avg: Math.round(sum / energyData.length) };
  }, [energyData]);

  const hasData = sessions.length > 0 || moodData.length > 0;

  return (
    <div className="gradient-calm relative flex h-[100dvh] flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 -left-10 h-60 w-60 rounded-full bg-peach/25 blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 right-0 h-40 w-40 rounded-full bg-sage/20 blur-2xl animate-float" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col pb-4 sm:pb-6 pt-10 sm:pt-14 overflow-hidden">
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-5 pb-2">
          {/* Header */}
          <div className="mb-6 shrink-0 animate-fade-up">
            <p className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground/70">Insights</p>
            <h1 className="font-heading text-[1.75rem] text-foreground leading-tight">Your Trends</h1>
          </div>
          {/* Tabs */}
          <div className="glass-strong flex rounded-2xl p-1.5 mb-5 animate-fade-up shrink-0" style={{ animationDelay: "0.1s" }}>
          {(["energy", "sessions", "mood"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all duration-300 ${activeTab === tab ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-white/10"}`}>
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>

        {!hasData ? (
          <div className="glass-strong rounded-[1.75rem] p-8 text-center flex-1 flex flex-col items-center justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 size={28} strokeWidth={1.5} className="text-primary" />
            </div>
            <h2 className="font-heading text-lg text-foreground mb-2">No Data Yet</h2>
            <p className="text-[11px] text-muted-foreground max-w-[220px]">Complete your first session to see your stats come alive here!</p>
          </div>
        ) : (
          <>
            <div className="glass-strong rounded-[1.75rem] p-5 mb-5 animate-fade-up flex flex-col" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-foreground">{activeTab === "energy" ? "Energy Score" : activeTab === "sessions" ? "Sessions" : "Mood Balance"}</h2>
                <span className="text-[10px] text-primary font-medium bg-primary/10 rounded-full px-2 py-0.5">Last 7 Days</span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-4">{activeTab === "energy" ? "Your calculated wellness energy." : activeTab === "sessions" ? "Daily session frequency." : "Distribution of your mood check-ins."}</p>

              <div className="w-full h-[180px]">
                {activeTab === "energy" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={energyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs><linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", fontSize: "11px" }} />
                      <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                {activeTab === "sessions" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sessionChartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "11px" }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {activeTab === "mood" && moodData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={moodData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {moodData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {activeTab === "energy" && (
                <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center text-center">
                  <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Highest</p><p className="text-sm font-bold text-foreground">{energyStats.highest} <span className="text-[9px] font-normal text-muted-foreground">{energyStats.highDay}</span></p></div>
                  <div className="w-[1px] h-6 bg-border/50" />
                  <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Average</p><p className="text-sm font-bold text-foreground">{energyStats.avg}</p></div>
                  <div className="w-[1px] h-6 bg-border/50" />
                  <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Lowest</p><p className="text-sm font-bold text-foreground">{energyStats.lowest} <span className="text-[9px] font-normal text-muted-foreground">{energyStats.lowDay}</span></p></div>
                </div>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2.5 mb-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="glass rounded-2xl p-3 text-center flex flex-col items-center gap-1">
                <Flame size={18} className="text-accent" />
                <p className="text-lg font-bold text-foreground">{streak}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Streak</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center flex flex-col items-center gap-1">
                <Target size={18} className="text-primary" />
                <p className="text-lg font-bold text-foreground">{totalSessions}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Sessions</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center flex flex-col items-center gap-1">
                <Clock size={18} className="text-teal" />
                <p className="text-lg font-bold text-foreground">{totalMinutes}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Minutes</p>
              </div>
            </div>
          </>
        )}
        </div>

        <div className="px-4 sm:px-5 shrink-0 mt-2">
          <BottomNav currentScreen="stats" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;
