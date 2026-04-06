import { useState, useEffect, useCallback } from "react";
import BottomNav from "./BottomNav";
import { addSession } from "@/lib/store";

interface Props {
  onNavigate: (screen: "dashboard" | "stats" | "meditate" | "profile") => void;
  onSessionComplete: (data: { duration: number }) => void;
}

type Exercise = {
  name: string;
  emoji: string;
  desc: string;
  phases: { label: string; duration: number }[];
  totalDuration: number;
};

const exercises: Exercise[] = [
  {
    name: "Box Breathing",
    emoji: "🫁",
    desc: "Equal inhale, hold, exhale, hold — calms the nervous system",
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
    emoji: "💨",
    desc: "Inhale 4s, hold 7s, exhale 8s — deeply relaxing",
    phases: [
      { label: "Breathe In", duration: 4 },
      { label: "Hold", duration: 7 },
      { label: "Breathe Out", duration: 8 },
    ],
    totalDuration: 120,
  },
  {
    name: "Calm Breathing",
    emoji: "🌊",
    desc: "Slow 6s in, 6s out — simple and centering",
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

  // Timer countdown
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const iv = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(iv);
  }, [isActive, timeLeft]);

  // Phase cycling
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

  // Phase countdown
  useEffect(() => {
    if (!isActive || phaseTimeLeft <= 0) return;
    const iv = setInterval(() => setPhaseTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(iv);
  }, [isActive, phaseTimeLeft]);

  // Session complete
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

  // Compute scale for circle animation
  const getCircleScale = () => {
    if (!isActive) return "scale-100";
    if (phase === "Breathe In") return "scale-[1.4]";
    if (phase === "Breathe Out") return "scale-[0.7]";
    return "scale-100"; // Hold
  };

  // Exercise selection screen
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
            {exercises.map((ex) => (
              <button
                key={ex.name}
                onClick={() => startExercise(ex)}
                className="w-full glass-strong rounded-2xl p-5 flex items-center gap-4 text-left transition-all active:scale-[0.98] hover:bg-white/20"
              >
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-2xl">{ex.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{ex.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{ex.desc}</p>
                </div>
                <div className="text-[10px] text-primary font-medium bg-primary/10 rounded-full px-2 py-0.5 shrink-0">
                  2 min
                </div>
              </button>
            ))}
          </div>

          <BottomNav currentScreen="meditate" onNavigate={onNavigate} />
        </div>
      </div>
    );
  }

  // Active Exercise Screen
  return (
    <div className="gradient-forest relative flex h-[100dvh] flex-col overflow-hidden text-white/90">
      {/* Reactive background orb */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/20 blur-3xl transition-all ease-in-out ${
            isActive ? `duration-[${selectedExercise.phases[phaseIndex]?.duration || 4}000ms]` : "duration-1000"
          } ${isActive ? (phase === "Breathe In" ? "h-[500px] w-[500px]" : phase === "Breathe Out" ? "h-32 w-32" : "h-64 w-64") : "h-64 w-64 animate-breathe"}`}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-8 pt-14 text-center">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-up">
          <button onClick={stopSession} className="glass-subtle inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-white/70">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            Stop
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50 font-mono glass-subtle rounded-full px-2 py-0.5">
              Cycle {cycleCount + 1}
            </span>
            <span className="text-[10px] text-white/50">{selectedExercise.emoji} {selectedExercise.name}</span>
          </div>
        </div>

        {/* Breathing Circle */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[280px]">
          <div className="relative flex items-center justify-center">
            {/* Outer pulsing rings */}
            <div className={`absolute h-56 w-56 rounded-full border border-white/5 transition-all ease-in-out duration-[${selectedExercise.phases[phaseIndex]?.duration || 4}000ms] ${getCircleScale()}`} />
            <div className={`absolute h-64 w-64 rounded-full border border-white/[0.03] transition-all ease-in-out duration-[${selectedExercise.phases[phaseIndex]?.duration || 4}000ms] ${getCircleScale()}`} />

            {/* Core circle */}
            <div
              className={`relative z-10 flex h-48 w-48 flex-col items-center justify-center rounded-full glass-strong border-white/20 shadow-2xl shadow-teal/10 transition-transform ease-in-out duration-[${selectedExercise.phases[phaseIndex]?.duration || 4}000ms] ${getCircleScale()}`}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative z-20 flex flex-col items-center">
                <span className="text-3xl font-heading text-white">{phaseTimeLeft}</span>
                <span className="text-sm font-heading text-white/80 mt-1">{phase}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timer + Controls */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-white/40 text-[11px] font-mono tracking-widest mb-5">{formatTime(timeLeft)} remaining</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={stopSession}
              className="h-12 w-12 rounded-full glass-subtle flex items-center justify-center text-white/70 transition-transform active:scale-90"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
            </button>
            <button
              onClick={togglePause}
              className="h-16 w-16 rounded-full bg-white text-forest shadow-lg flex items-center justify-center transition-transform active:scale-90"
            >
              {isActive ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditateScreen;
