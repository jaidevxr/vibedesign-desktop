import { FC } from "react";

interface BottomNavProps {
  currentScreen: "dashboard" | "stats" | "meditate" | "profile";
  onNavigate: (screen: "dashboard" | "stats" | "meditate" | "profile") => void;
}

const BottomNav: FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "stats", icon: "📊", label: "Stats" },
    { id: "meditate", icon: "🧘", label: "Meditate" },
    { id: "profile", icon: "👤", label: "Profile" },
  ] as const;

  return (
    <div className="glass-strong mt-auto shrink-0 flex items-center justify-around rounded-2xl py-3 animate-fade-up z-20" style={{ animationDelay: "0.5s" }}>
      {navItems.map((item) => {
        const active = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center gap-0.5 relative px-3 py-1 group transition-transform active:scale-95"
          >
            <span className={`text-lg transition-all duration-300 ${active ? "scale-110" : "grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0"}`}>
              {item.icon}
            </span>
            <span className={`text-[9px] font-medium transition-colors duration-300 ${active ? "text-primary" : "text-muted-foreground/50"}`}>
              {item.label}
            </span>
            {active && (
              <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary mt-0.5 animate-scale-in" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
