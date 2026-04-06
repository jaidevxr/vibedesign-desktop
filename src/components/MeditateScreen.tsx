import { useState, useEffect, useCallback } from "react";
import BottomNav from "./BottomNav";
import { addSession } from "@/lib/store";
import { ChevronLeft, Play, Pause, Square, Wind, Waves, CloudRain } from "lucide-react";

interface Props {
  onNavigate: (screen: "dashboard" | "stats" | "meditate" | "profile") => void;
  onSessionComplete: (data: { duration: number }) => void;
}

type Exercise = {
  name: string;
  icon: typeof Wind;
  desc: string;
  color: string;
  phases: { label: string; duration: number }[];
  totalDuration: number;
};

const exercises: Exercise[] = [
  {
    name: "Box Breathing",
    icon: Wind,
    desc: "Equal inhale, hold, exhale, hold — calms the nervous system",
    color: "bg-primary/10 text-primary",
    phases: [
      { label: "Breathe In", duration: 4 },
      { label: "Hold", duration: 4 },
      { label: "Breathe Out", duration: 4 },
      { label: "Hold", duration: 4 },
    ],
    totalDuration: 120,
  },
  {
    name: "4-7-8 Breathing",
    icon: Waves,
    desc: "Inhale 4s, hold 7s, exhale 8s — deeply relaxing",
    color: "bg-peach/20 text-accent",
    phases: [
      { label: "Breathe In", duration: 4 },
      { label: "Hold", duration: 7 },
      { label: "Breathe Out", duration: 8 },
    ],
    totalDuration: 120,
  },
  {
    name: "Calm Breathing",
    icon: CloudRain,
    desc: "Slow 6s in, 6s out — simple and centering",
    color: "bg-sage/20 text-teal",
    phases: [
      { label: "Breathe In", duration: 6 },
      { label: "Breathe Out", duration: 6 },
    ],
    totalDuration: 120,
  },
];

const MeditateScreen = ({ onNavigate, onSessionComplete }: Props) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [sessionStart, setSessionStart] = useState(0);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const iv = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(iv);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (!isActive || !selectedExercise) return;
    const phases = selectedExercise.phases;
    const currentPhase = phases[phaseIndex];
    setPhase(currentPhase.label);
    setPhaseTimeLeft(currentPhase.duration);
    const timer = setTimeout(() => {
      const nextIndex = (phaseIndex + 1) % phases.length;
      setPhaseIndex(nextIndex);
      if (nextIndex === 0) setCycleCount((c) => c + 1);
    }, currentPhase.duration * 1000);
    return () => clearTimeout(timer);
  }, [isActive, phaseIndex, selectedExercise]);

  useEffect(() => {
    if (!isActive || phaseTimeLeft <= 0) return;
    const iv = setInterval(() => setPhaseTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(iv);
  }, [isActive, phaseTimeLeft]);

  useEffect(() => {
    if (isActive && timeLeft <= 0) {
      setIsActive(false);
      const duration = Math.round((Date.now() - sessionStart) / 1000);
      addSession({ type: "meditation", duration, exerciseType: selectedExercise?.name });
      onSessionComplete({ duration });
    }
  }, [timeLeft, isActive]);

  const startExercise = useCallback((ex: Exercise) => {
    setSelectedExercise(ex);
    setTimeLeft(ex.totalDuration);
    setPhaseIndex(0);
    setCycleCount(0);
    setIsActive(true);
    setSessionStart(Date.now());
  }, []);

  const togglePause = () => setIsActive(!isActive);

  const stopSession = () => {
    const duration = Math.round((Date.now() - sessionStart) / 1000);
    setIsActive(false);
    if (duration > 5) {
      addSession({ type: "meditation", duration, exerciseType: selectedExercise?.name });
      onSessionComplete({ duration });
    } else {
      setSelectedExercise(null);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const getCircleScale = () => {
    if (!isActive) return "scale-100";
    if (phase === "Breathe In") return "scale-[1.4]";
    if (phase === "Breathe Out") return "scale-[0.7]";
    return "scale-100";
  };

  // Exercise selection
  if (!selectedExercise) {
    return (
      <div className="gradient-forest relative flex h-[100dvh] flex-col overflow-y-auto overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 mix-blend-screen">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-teal/20 blur-3xl animate-breathe" />
        </div>
        <div className="relative z-10 flex flex-1 flex-col px-5 pb-8 pt-14 text-center">
          <div className="mb-8 animate-fade-up">
            <p className="text-[11px] font-medium tracking-wider uppercase text-white/50">Mindful Practice</p>
            <h1 className="font-heading text-[1.75rem] leading-tight text-white mt-1">Choose Your Exercise</h1>
          </div>
          <div className="space-y-3 mb-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {exercises.map((ex) => {
              const Icon = ex.icon;
              return (
                <button
                  key={ex.name}
                  onClick={() => startExercise(ex)}
                  className="w-full glass-strong rounded-2xl p-5 flex items-center gap-4 text-left transition-all duration-300 active:scale-[0.98] hover:bg-white/20"
                >
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${ex.color}`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{ex.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{ex.desc}</p>
                  </div>
                  <div className="text-[10px] text-primary font-medium bg-primary/10 rounded-full px-2.5 py-1 shrink-0">2 min</div>
                </button>
              );
            })}
          </div>
          <BottomNav currentScreen="meditate" onNavigate={onNavigate} />
        </div>
      </div>
    );
  }

  // Active Exercise
  return (
    <div className="gradient-forest relative flex h-[100dvh] flex-col overflow-hidden text-white/90">
      <div className="pointer-events-none absolute inset-0 mix-blend-screen">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/20 blur-3xl transition-all ease-in-out duration-[4000ms] ${isActive ? (phase === "Breathe In" ? "h-[500px] w-[500px]" : phase === "Breathe Out" ? "h-32 w-32" : "h-64 w-64") : "h-64 w-64 animate-breathe"}`} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-8 pt-14 text-center">
        <div className="flex items-center justify-between mb-6 animate-fade-up">
          <button onClick={stopSession} className="glass-subtle inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-white/70 transition-all duration-300 active:scale-95">
            <ChevronLeft size={14} />
            Stop
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50 font-mono glass-subtle rounded-full px-2.5 py-0.5">Cycle {cycleCount + 1}</span>
          </div>
        </div>

        {/* Breathing Circle */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[280px]">
          <div className="relative flex items-center justify-center">
            <div className={`absolute h-56 w-56 rounded-full border border-white/5 transition-all ease-in-out duration-[4000ms] ${getCircleScale()}`} />
            <div className={`absolute h-64 w-64 rounded-full border border-white/[0.03] transition-all ease-in-out duration-[4000ms] ${getCircleScale()}`} />
            <div className={`relative z-10 flex h-48 w-48 flex-col items-center justify-center rounded-full glass-strong border-white/20 shadow-2xl shadow-teal/10 transition-transform ease-in-out duration-[4000ms] ${getCircleScale()}`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative z-20 flex flex-col items-center">
                <span className="text-4xl font-heading text-white tabular-nums">{phaseTimeLeft}</span>
                <span className="text-sm font-heading text-white/80 mt-1">{phase}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-white/40 text-[11px] font-mono tracking-widest mb-5 tabular-nums">{formatTime(timeLeft)} remaining</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={stopSession} className="h-12 w-12 rounded-full glass-subtle flex items-center justify-center text-white/70 transition-all duration-300 active:scale-90 hover:bg-white/10">
              <Square size={18} />
            </button>
            <button onClick={togglePause} className="h-16 w-16 rounded-full bg-white text-forest shadow-lg flex items-center justify-center transition-all duration-300 active:scale-90 hover:shadow-xl">
              {isActive ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditateScreen;
