import { useState } from "react";
import bgNature from "@/assets/bg-nature.jpg";

const moods = [
  { emoji: "😌", label: "Calm", value: "calm", color: "bg-sage/20" },
  { emoji: "😊", label: "Happy", value: "happy", color: "bg-peach/30" },
  { emoji: "😔", label: "Low", value: "low", color: "bg-muted" },
  { emoji: "😤", label: "Stressed", value: "stressed", color: "bg-accent/20" },
  { emoji: "😴", label: "Tired", value: "tired", color: "bg-sand" },
  { emoji: "🤔", label: "Anxious", value: "anxious", color: "bg-peach-deep/15" },
];

interface Props {
  onComplete: (mood: string) => void;
}

const OnboardingScreen = ({ onComplete }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden">
      {/* Background */}
      <img src={bgNature} alt="" className="absolute inset-0 h-full w-full object-cover" width={1080} height={1920} />
      <div className="absolute inset-0 bg-gradient-to-b from-forest/30 via-forest/10 to-background/95" />

      {/* Floating decorative orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 right-8 h-16 w-16 rounded-full bg-peach/40 blur-xl animate-float" />
        <div className="absolute top-40 left-6 h-12 w-12 rounded-full bg-sage/30 blur-lg animate-float-slow" />
        <div className="absolute bottom-44 right-12 h-20 w-20 rounded-full bg-primary/10 blur-2xl animate-breathe" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-8 pt-14">
        {/* Status bar dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === 0 ? "w-8 bg-primary-foreground" : "w-1.5 bg-primary-foreground/30"}`} />
          ))}
        </div>

        {/* Logo + Title */}
        <div className="animate-fade-up text-center mb-auto" style={{ animationDelay: "0.1s" }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-sm">🧠</span>
            </div>
            <span className="text-sm font-semibold tracking-wider uppercase text-primary-foreground/90">MindSync</span>
          </div>
          <h1 className="font-heading text-[2.5rem] leading-[1.1] text-primary-foreground mb-3">
            How are you<br />feeling today?
          </h1>
          <p className="text-sm text-primary-foreground/60 max-w-[260px] mx-auto leading-relaxed">
            Take a moment to check in with yourself. Your mood shapes today's experience.
          </p>
        </div>

        {/* Mood Selector */}
        <div className="glass rounded-3xl p-5 animate-fade-up my-6" style={{ animationDelay: "0.3s" }}>
          <div className="grid grid-cols-3 gap-2.5">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelected(mood.value)}
                className={`relative flex flex-col items-center gap-1.5 rounded-2xl py-4 px-2 transition-all duration-300 ${
                  selected === mood.value
                    ? "glass-strong scale-[1.06] ring-2 ring-primary/30"
                    : "hover:bg-primary/5 active:scale-95"
                }`}
              >
                <span className="text-[2rem] leading-none">{mood.emoji}</span>
                <span className="text-[11px] font-medium text-foreground/60">{mood.label}</span>
                {selected === mood.value && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Motivational quote */}
        <div className="glass-subtle rounded-2xl px-4 py-3 mb-6 animate-fade-up text-center" style={{ animationDelay: "0.4s" }}>
          <p className="text-[11px] italic text-foreground/50">"The greatest glory in living lies not in never falling, but in rising every time we fall."</p>
          <p className="text-[10px] text-foreground/30 mt-1">— Nelson Mandela</p>
        </div>

        {/* CTA */}
        <button
          onClick={() => selected && onComplete(selected)}
          disabled={!selected}
          className="animate-fade-up w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 disabled:opacity-30 active:scale-[0.97]"
          style={{ animationDelay: "0.5s" }}
        >
          Continue
        </button>

        {/* Skip */}
        <button className="mt-3 text-xs text-muted-foreground/60 mx-auto animate-fade-up" style={{ animationDelay: "0.6s" }} onClick={() => onComplete("calm")}>
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
