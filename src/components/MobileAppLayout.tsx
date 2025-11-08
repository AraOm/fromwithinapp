import React from "react";
import {
  Home,
  Sparkles,
  Activity,
  Heart,
  BookHeart,
  Edit3,
  Calendar,
  User,
  ImagePlus,
} from "lucide-react";

interface MobileNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "mentor", label: "Mentor", icon: Sparkles },
  { id: "body", label: "Body", icon: Activity },
  { id: "chakras", label: "Chakras", icon: Heart },
  { id: "rituals", label: "Rituals", icon: BookHeart },
  { id: "journal", label: "Journal", icon: Edit3 },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "biometric-insights", label: "Biometric Insights", icon: User },
  { id: "community", label: "Community", icon: ImagePlus },
];

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    // ❌ was bg-white border-t
    <nav className="fixed bottom-0 left-0 right-0 bg-[#120027]/80 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center text-xs transition-colors ${
              currentView === item.id
                ? "text-violet-100"
                : "text-violet-300/80"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;

