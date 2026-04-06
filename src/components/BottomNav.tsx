import { FC } from "react";
import { Home, BarChart3, Wind, User } from "lucide-react";

interface BottomNavProps {
  currentScreen: "dashboard" | "stats" | "meditate" | "profile";
  onNavigate: (screen: "dashboard" | "stats" | "meditate" | "profile") => void;
}

const navItems = [
  { id: "dashboard", icon: Home, label: "Home" },
  { id: "stats", icon: BarChart3, label: "Stats" },
  { id: "meditate", icon: Wind, label: "Meditate" },
  { id: "profile", icon: User, label: "Profile" },
] as const;

const BottomNav: FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <div className="glass-strong mt-auto shrink-0 flex items-center justify-around rounded-2xl py-2.5 animate-fade-up z-20" style={{ animationDelay: "0.5s" }}>
      {navItems.map((item) => {
        const active = currentScreen === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center gap-1 relative px-4 py-1.5 group transition-all duration-300 active:scale-90"
          >
            <div className={`relative transition-all duration-300 ${active ? "scale-110" : "group-hover:scale-105"}`}>
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.8}
                className={`transition-all duration-300 ${active ? "text-primary drop-shadow-sm" : "text-muted-foreground/50 group-hover:text-muted-foreground/80"}`}
              />
            </div>
            <span className={`text-[9px] font-semibold tracking-wide transition-all duration-300 ${active ? "text-primary" : "text-muted-foreground/40"}`}>
              {item.label}
            </span>
            <div className={`absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary transition-all duration-300 ${active ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
