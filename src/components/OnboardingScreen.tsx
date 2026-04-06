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
      <div className="absolute inset-0 bg-[#0f1712]/40 backdrop-saturate-[1.2]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1712]/50 via-transparent to-[#0f1712]/80" />

      {/* Floating decorative orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 right-8 h-16 w-16 rounded-full bg-peach/30 blur-xl animate-float" />
        <div className="absolute top-40 left-6 h-12 w-12 rounded-full bg-sage/20 blur-lg animate-float-slow" />
        <div className="absolute bottom-44 right-12 h-20 w-20 rounded-full bg-primary/10 blur-2xl animate-breathe" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-8 pt-14 overflow-y-auto chat-scroll">
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
        <div className="rounded-[2rem] p-5 animate-fade-up my-6 bg-white/[0.08] backdrop-blur-[40px] backdrop-saturate-[1.5] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden" style={{ animationDelay: "0.3s" }}>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          <div className="relative z-10 grid grid-cols-3 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelected(mood.value)}
                className={`relative flex flex-col items-center gap-2 rounded-[1.25rem] py-4 px-2 transition-all duration-400 ease-out ${
                  selected === mood.value
                    ? "bg-white/25 backdrop-blur-md scale-105 shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-white/30"
                    : "hover:bg-white/10 active:scale-95 border border-transparent"
                }`}
              >
                <span className="text-[2rem] leading-none drop-shadow-sm">{mood.emoji}</span>
                <span className={`text-[11px] font-medium tracking-wide ${selected === mood.value ? "text-white" : "text-white/70"}`}>{mood.label}</span>
                {selected === mood.value && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white flex items-center justify-center shadow-lg transform transition-transform animate-scale-in">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--forest))" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Motivational quote */}
        <div className="rounded-[1.5rem] px-5 py-4 mb-8 animate-fade-up text-center bg-white/[0.05] backdrop-blur-[30px] backdrop-saturate-[1.5] border border-white/10 shadow-[0_4px_24px_0_rgba(0,0,0,0.2)]" style={{ animationDelay: "0.4s" }}>
          <p className="text-[11px] italic text-white/70 leading-relaxed font-medium tracking-wide">"The greatest glory in living lies not in never falling, but in rising every time we fall."</p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/50 mt-2">— Nelson Mandela</p>
        </div>

        {/* CTA */}
        <button
          onClick={() => selected && onComplete(selected)}
          disabled={!selected}
          className="animate-fade-up relative overflow-hidden w-full rounded-[1.25rem] bg-white/95 backdrop-blur-md py-4 text-[13px] font-bold uppercase tracking-wider text-[#0f1712] transition-all duration-300 disabled:opacity-40 active:scale-[0.98] shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)] hover:bg-white"
          style={{ animationDelay: "0.5s" }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Continue
          </span>
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
