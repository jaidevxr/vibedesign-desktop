// ─── MindSync Persistent Store ───────────────────────────────────────
// All data lives in localStorage. No backend required.

export interface MoodEntry {
  mood: string;
  timestamp: number;
}

export interface SessionEntry {
  id: string;
  type: "chat" | "meditation";
  duration: number; // seconds
  wordCount?: number;
  moodBefore?: string;
  moodAfter?: string;
  timestamp: number;
  exerciseType?: string;
}

export interface UserPreferences {
  name: string;
  apiKey: string;
  reminders: boolean;
  sleepTracking: boolean;
  aiVoiceType: string;
  theme: "light" | "dark" | "system";
}

interface StoreData {
  moods: MoodEntry[];
  sessions: SessionEntry[];
  preferences: UserPreferences;
  onboardingDone: boolean;
}

const STORAGE_KEY = "mindsync_store";

const defaultPrefs: UserPreferences = {
  name: "Explorer",
  apiKey: "",
  reminders: true,
  sleepTracking: true,
  aiVoiceType: "Calm & Natural",
  theme: "light",
};

const defaultData: StoreData = {
  moods: [],
  sessions: [],
  preferences: defaultPrefs,
  onboardingDone: false,
};

function load(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    const parsed = JSON.parse(raw);
    return { ...defaultData, ...parsed, preferences: { ...defaultPrefs, ...parsed.preferences } };
  } catch {
    return { ...defaultData };
  }
}

function save(data: StoreData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── Public API ──────────────────────────────────────────────────────

export function getPreferences(): UserPreferences {
  return load().preferences;
}

export function setPreferences(prefs: Partial<UserPreferences>) {
  const data = load();
  data.preferences = { ...data.preferences, ...prefs };
  save(data);
}

export function getApiKey(): string {
  return load().preferences.apiKey;
}

export function setApiKey(key: string) {
  setPreferences({ apiKey: key });
}

// Moods
export function addMoodEntry(mood: string) {
  const data = load();
  data.moods.push({ mood, timestamp: Date.now() });
  save(data);
}

export function getMoodHistory(): MoodEntry[] {
  return load().moods;
}

export function getLatestMood(): string {
  const moods = load().moods;
  return moods.length > 0 ? moods[moods.length - 1].mood : "calm";
}

// Sessions
export function addSession(session: Omit<SessionEntry, "id" | "timestamp">) {
  const data = load();
  data.sessions.push({
    ...session,
    id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    timestamp: Date.now(),
  });
  save(data);
}

export function getSessions(): SessionEntry[] {
  return load().sessions;
}

export function getTotalSessionCount(): number {
  return load().sessions.length;
}

export function getTotalMinutes(): number {
  return Math.round(load().sessions.reduce((sum, s) => sum + s.duration, 0) / 60);
}

// Streak: number of consecutive days (ending today) with at least 1 session
export function getCurrentStreak(): number {
  const sessions = load().sessions;
  if (sessions.length === 0) return 0;

  const daySet = new Set(
    sessions.map((s) => new Date(s.timestamp).toDateString())
  );

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (daySet.has(d.toDateString())) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Weekly activity: for each of the last 7 days, count sessions
export function getWeeklyActivity(): number[] {
  const sessions = load().sessions;
  const result: number[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toDateString();
    result.push(sessions.filter((s) => new Date(s.timestamp).toDateString() === ds).length);
  }
  return result;
}

// Energy score: algorithmic from mood + sessions + streak
export function calculateEnergyScore(): number {
  const moods = load().moods;
  const streak = getCurrentStreak();
  const todaySessions = load().sessions.filter(
    (s) => new Date(s.timestamp).toDateString() === new Date().toDateString()
  ).length;

  // Base from latest mood
  const latestMood = moods.length > 0 ? moods[moods.length - 1].mood : "calm";
  const moodScores: Record<string, number> = {
    happy: 85, calm: 75, anxious: 50, tired: 45, low: 35, stressed: 30,
  };
  let base = moodScores[latestMood] ?? 60;

  // Boost from streak
  base += Math.min(streak * 2, 15);

  // Boost from today's sessions
  base += Math.min(todaySessions * 5, 15);

  return Math.min(Math.max(base, 10), 100);
}

// Daily energy history for charts (last 7 days)
export function getDailyEnergyHistory(): { day: string; score: number }[] {
  const data = load();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result: { day: string; score: number }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toDateString();

    // Find mood entries for that day
    const dayMoods = data.moods.filter((m) => new Date(m.timestamp).toDateString() === ds);
    const daySessions = data.sessions.filter((s) => new Date(s.timestamp).toDateString() === ds);

    let score = 50; // default
    if (dayMoods.length > 0) {
      const lastMood = dayMoods[dayMoods.length - 1].mood;
      const moodScores: Record<string, number> = {
        happy: 85, calm: 75, anxious: 50, tired: 45, low: 35, stressed: 30,
      };
      score = moodScores[lastMood] ?? 55;
    }
    score += Math.min(daySessions.length * 5, 15);
    score = Math.min(Math.max(score, 10), 100);

    result.push({ day: days[d.getDay()], score });
  }
  return result;
}

// Mood distribution for charts
export function getMoodDistribution(): { name: string; value: number; emoji: string }[] {
  const moods = load().moods;
  const counts: Record<string, number> = {};
  moods.forEach((m) => {
    counts[m.mood] = (counts[m.mood] || 0) + 1;
  });
  const emojiMap: Record<string, string> = {
    calm: "😌", happy: "😊", low: "😔", stressed: "😤", tired: "😴", anxious: "🤔",
  };
  return Object.entries(counts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    emoji: emojiMap[name] || "😶",
  }));
}

// Onboarding
export function isOnboardingDone(): boolean {
  return load().onboardingDone;
}

export function setOnboardingDone() {
  const data = load();
  data.onboardingDone = true;
  save(data);
}

// Reset
export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
}
