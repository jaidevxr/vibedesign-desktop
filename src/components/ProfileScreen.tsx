import { useState } from "react";
import BottomNav from "./BottomNav";
import { Bell, Moon, Bot, Trash2, ChevronRight, Pencil, Check } from "lucide-react";
import { getPreferences, setPreferences, getTotalSessionCount, getCurrentStreak, getTotalMinutes, clearAllData } from "@/lib/store";

interface Props {
  onNavigate: (screen: "dashboard" | "stats" | "meditate" | "profile") => void;
}

const ProfileScreen = ({ onNavigate }: Props) => {
  const [prefs, setLocalPrefs] = useState(getPreferences);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(prefs.name);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const totalSessions = getTotalSessionCount();
  const streak = getCurrentStreak();
  const totalMinutes = getTotalMinutes();

  const toggle = (key: "reminders" | "theme") => {
    if (key === "theme") {
      const newTheme = prefs.theme === "dark" ? "light" : "dark";
      setPreferences({ theme: newTheme });
      setLocalPrefs({ ...prefs, theme: newTheme });
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    } else {
      const newVal = !prefs[key];
      setPreferences({ [key]: newVal });
      setLocalPrefs({ ...prefs, [key]: newVal });
    }
  };

  const saveName = () => {
    const trimmed = nameInput.trim() || "Explorer";
    setPreferences({ name: trimmed });
    setLocalPrefs({ ...prefs, name: trimmed });
    setEditingName(false);
  };

  const handleClear = () => {
    clearAllData();
    setShowClearConfirm(false);
    window.location.reload();
  };

  return (
    <div className="gradient-calm relative flex h-[100dvh] flex-col overflow-y-auto overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-peach/20 blur-3xl animate-float" />
        <div className="absolute bottom-40 left-0 h-40 w-40 rounded-full bg-primary/10 blur-2xl animate-breathe" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-8 pt-14">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-8 animate-fade-up">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse-soft" />
            <div className="relative h-24 w-24 rounded-[2rem] glass-strong border-2 border-primary/20 shadow-xl overflow-hidden flex items-center justify-center">
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-sage/20 flex items-center justify-center">
                <span className="text-3xl font-heading text-primary">{prefs.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <button
              onClick={() => setEditingName(true)}
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center border border-border transition-all duration-300 active:scale-90 hover:shadow-lg"
            >
              <Pencil size={12} className="text-muted-foreground" />
            </button>
          </div>
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                autoFocus
                className="bg-transparent border-b-2 border-primary text-center font-heading text-2xl text-foreground outline-none w-40"
              />
              <button onClick={saveName} className="h-8 w-8 rounded-full bg-primary flex items-center justify-center transition-all duration-300 active:scale-90">
                <Check size={14} className="text-primary-foreground" />
              </button>
            </div>
          ) : (
            <h1 className="font-heading text-2xl text-foreground">{prefs.name}</h1>
          )}
          <p className="text-xs text-muted-foreground mt-1">MindSync Companion</p>
        </div>

        {/* Real Stats */}
        <div className="glass-strong rounded-[1.75rem] p-5 mb-5 animate-fade-up flex justify-around items-center text-center" style={{ animationDelay: "0.1s" }}>
          <div>
            <p className="text-lg font-bold text-foreground">{totalSessions}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sessions</p>
          </div>
          <div className="w-[1px] h-8 bg-border/50" />
          <div>
            <p className="text-lg font-bold text-foreground">{streak}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Day Streak</p>
          </div>
          <div className="w-[1px] h-8 bg-border/50" />
          <div>
            <p className="text-lg font-bold text-foreground">{totalMinutes}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Minutes</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <p className="mb-3 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70 pl-2">Preferences</p>
          <div className="glass-strong rounded-[1.75rem] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border/50 transition-colors active:bg-white/40">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 rounded-xl bg-primary/10 items-center justify-center"><Bell size={16} strokeWidth={1.8} className="text-primary" /></div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Daily Reminders</p>
                  <p className="text-[10px] text-muted-foreground">{prefs.reminders ? "Active" : "Off"}</p>
                </div>
              </div>
              <button onClick={() => toggle("reminders")} className={`w-11 h-6 rounded-full relative transition-colors duration-300 shadow-inner ${prefs.reminders ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${prefs.reminders ? "right-1" : "left-1"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border-b border-border/50 transition-colors active:bg-white/40">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 rounded-xl bg-sage/20 items-center justify-center"><Moon size={16} strokeWidth={1.8} className="text-teal" /></div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Dark Mode</p>
                  <p className="text-[10px] text-muted-foreground">{prefs.theme === "dark" ? "Enabled" : "Disabled"}</p>
                </div>
              </div>
              <button onClick={() => toggle("theme")} className={`w-11 h-6 rounded-full relative transition-colors duration-300 shadow-inner ${prefs.theme === "dark" ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${prefs.theme === "dark" ? "right-1" : "left-1"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 rounded-xl bg-peach/20 items-center justify-center"><Bot size={16} strokeWidth={1.8} className="text-accent" /></div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">AI Model</p>
                  <p className="text-[10px] text-muted-foreground">Llama 3.3 70B via Groq</p>
                </div>
              </div>
              <span className="text-[10px] text-primary font-medium bg-primary/10 rounded-full px-2 py-0.5">Active</span>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="mt-5 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <p className="mb-3 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70 pl-2">Data</p>
          <div className="glass-strong rounded-[1.75rem] overflow-hidden">
            <button onClick={() => setShowClearConfirm(true)} className="flex items-center justify-between p-4 w-full text-left transition-colors active:bg-white/40">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 rounded-xl bg-destructive/10 items-center justify-center"><Trash2 size={16} strokeWidth={1.8} className="text-destructive" /></div>
                <p className="text-[13px] font-semibold text-foreground">Clear All Data</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground/40" />
            </button>
          </div>
        </div>

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-5">
            <div className="glass-strong rounded-[1.75rem] p-6 max-w-sm w-full text-center animate-scale-in">
              <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                <Trash2 size={24} className="text-destructive" />
              </div>
              <h3 className="font-heading text-lg text-foreground mt-2">Clear All Data?</h3>
              <p className="text-[11px] text-muted-foreground mt-2 mb-5">This will delete all sessions, mood history, and stats. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 glass-subtle rounded-xl py-3 text-[12px] font-semibold text-muted-foreground transition-all duration-300 active:scale-95">Cancel</button>
                <button onClick={handleClear} className="flex-1 bg-destructive rounded-xl py-3 text-[12px] font-semibold text-white transition-all duration-300 active:scale-95">Delete</button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-4">
          <BottomNav currentScreen="profile" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
