import { useState } from "react";
import { Brain } from "lucide-react";
import bgNature from "@/assets/bg-nature.jpg";

const moods = [
  { emoji: "😌", label: "Calm", value: "calm" },
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😔", label: "Low", value: "low" },
  { emoji: "😤", label: "Stressed", value: "stressed" },
  { emoji: "😴", label: "Tired", value: "tired" },
  { emoji: "🤔", label: "Anxious", value: "anxious" },
];

interface Props {
  onComplete: (mood: string) => void;
}

const OnboardingScreen = ({ onComplete }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden">
      {/* Background */}
      <img src={bgNature} alt="" className="absolute inset-0 h-full w-full object-cover" width={1080} height={1920} />
      {/* Darker overlay gradient for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a2a]/70 via-[#1a3a2a]/40 to-[#1a3a2a]/85" />

      {/* Floating decorative orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 right-8 h-16 w-16 rounded-full bg-peach/30 blur-xl animate-float" />
        <div className="absolute top-40 left-6 h-12 w-12 rounded-full bg-sage/20 blur-lg animate-float-slow" />
        <div className="absolute bottom-44 right-12 h-20 w-20 rounded-full bg-primary/10 blur-2xl animate-breathe" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-8 pt-14">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === 0 ? "w-8 bg-white" : "w-1.5 bg-white/30"}`} />
          ))}
        </div>

        {/* Logo + Title */}
        <div className="animate-fade-up text-center mb-auto" style={{ animationDelay: "0.1s" }}>
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Brain size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold tracking-wider uppercase text-white/90">MindSync</span>
          </div>
          <h1 className="font-heading text-[2.5rem] leading-[1.1] text-white mb-3 drop-shadow-lg">
            How are you<br />feeling today?
          </h1>
          <p className="text-sm text-white/70 max-w-[260px] mx-auto leading-relaxed drop-shadow-md">
            Take a moment to check in with yourself. Your mood shapes today's experience.
          </p>
        </div>

        {/* Mood Selector */}
        <div className="rounded-3xl p-5 animate-fade-up my-6 bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl" style={{ animationDelay: "0.3s" }}>
          <div className="grid grid-cols-3 gap-2.5">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelected(mood.value)}
                className={`relative flex flex-col items-center gap-1.5 rounded-2xl py-4 px-2 transition-all duration-300 ${
                  selected === mood.value
                    ? "bg-white/30 backdrop-blur-sm scale-[1.06] ring-2 ring-white/40 shadow-lg"
                    : "hover:bg-white/10 active:scale-95"
                }`}
              >
                <span className="text-[2rem] leading-none drop-shadow-sm">{mood.emoji}</span>
                <span className={`text-[11px] font-medium ${selected === mood.value ? "text-white" : "text-white/70"}`}>{mood.label}</span>
                {selected === mood.value && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white flex items-center justify-center shadow-md">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--forest))" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Motivational quote */}
        <div className="rounded-2xl px-4 py-3 mb-6 animate-fade-up text-center bg-white/10 backdrop-blur-sm border border-white/10" style={{ animationDelay: "0.4s" }}>
          <p className="text-[11px] italic text-white/60">"The greatest glory in living lies not in never falling, but in rising every time we fall."</p>
          <p className="text-[10px] text-white/40 mt-1">— Nelson Mandela</p>
        </div>

        {/* CTA */}
        <button
          onClick={() => selected && onComplete(selected)}
          disabled={!selected}
          className="animate-fade-up w-full rounded-2xl bg-white py-4 text-sm font-semibold text-[#1a3a2a] transition-all duration-300 disabled:opacity-30 active:scale-[0.97] shadow-xl hover:shadow-2xl"
          style={{ animationDelay: "0.5s" }}
        >
          Continue
        </button>

        {/* Skip */}
        <button className="mt-3 text-xs text-white/50 mx-auto animate-fade-up hover:text-white/70 transition-colors" style={{ animationDelay: "0.6s" }} onClick={() => onComplete("calm")}>
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
