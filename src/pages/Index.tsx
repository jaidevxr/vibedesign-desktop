import { useState } from "react";
import OnboardingScreen from "@/components/OnboardingScreen";
import DashboardScreen from "@/components/DashboardScreen";
import ActionScreen from "@/components/ActionScreen";
import ConfirmationScreen from "@/components/ConfirmationScreen";
import StatsScreen from "@/components/StatsScreen";
import MeditateScreen from "@/components/MeditateScreen";
import ProfileScreen from "@/components/ProfileScreen";
import MobileFrame from "@/components/MobileFrame";
import { addMoodEntry } from "@/lib/store";

type Screen = "onboarding" | "dashboard" | "action" | "confirmation" | "stats" | "meditate" | "profile";

interface SessionData {
  duration: number;
  wordCount?: number;
  type?: string;
}

const Index = () => {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [mood, setMood] = useState("calm");
  const [lastSession, setLastSession] = useState<SessionData | null>(null);

  const handleOnboardingComplete = (selectedMood: string) => {
    setMood(selectedMood);
    addMoodEntry(selectedMood);
    setScreen("dashboard");
  };

  const handleChatComplete = (data: { duration: number; wordCount: number }) => {
    setLastSession({ ...data, type: "chat" });
    setScreen("confirmation");
  };

  const handleMeditationComplete = (data: { duration: number }) => {
    setLastSession({ ...data, type: "meditation" });
    setScreen("confirmation");
  };

  const renderScreen = () => {
    switch (screen) {
      case "onboarding":
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case "dashboard":
        return <DashboardScreen mood={mood} onNavigate={setScreen as any} />;
      case "stats":
        return <StatsScreen onNavigate={setScreen as any} />;
      case "meditate":
        return <MeditateScreen onNavigate={setScreen as any} onSessionComplete={handleMeditationComplete} />;
      case "profile":
        return <ProfileScreen onNavigate={setScreen as any} />;
      case "action":
        return (
          <ActionScreen
            onBack={() => setScreen("dashboard")}
            onComplete={handleChatComplete}
            onNavigateMeditate={() => setScreen("meditate")}
          />
        );
      case "confirmation":
        return (
          <ConfirmationScreen
            onReset={() => setScreen("dashboard")}
            sessionData={lastSession || undefined}
          />
        );
    }
  };

  return <MobileFrame>{renderScreen()}</MobileFrame>;
};

export default Index;
