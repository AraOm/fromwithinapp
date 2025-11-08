import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Moon, Zap, Heart, Leaf, Activity, Brain } from 'lucide-react';

interface WearableData {
  sleepQuality: number; // 0-100
  stressLevel: number; // 0-100
  heartRateVariability: number; // 0-100
  activityLevel: number; // 0-100
  heartRate: number;
  recoveryScore: number;
  deviceName?: string;
}

interface Insight {
  title: string;
  message: string;
  recommendations: string[];
  chakra?: string;
  crystals?: string[];
  foods?: string[];
  mantra?: string;
  breathwork?: string;
  icon: React.ReactNode;
  color: string;
  urgency: 'low' | 'medium' | 'high';
}

const TodaysInsight: React.FC = () => {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [wearableData, setWearableData] = useState<WearableData | null>(null);
  const [userName] = useState('Beautiful Soul'); // In real app, get from user context

  // Simulate real wearable data from connected devices
  useEffect(() => {
    const fetchWearableData = () => {
      // Simulate data from connected wearables
      const connectedDevices = ['Apple Watch', 'Oura Ring', 'Whoop 4.0', 'Fitbit Sense'];
      const randomDevice = connectedDevices[Math.floor(Math.random() * connectedDevices.length)];
      
      const mockData: WearableData = {
        sleepQuality: Math.floor(Math.random() * 60) + 30, // 30-90
        stressLevel: Math.floor(Math.random() * 80) + 10, // 10-90
        heartRateVariability: Math.floor(Math.random() * 70) + 20, // 20-90
        activityLevel: Math.floor(Math.random() * 80) + 10, // 10-90
        heartRate: Math.floor(Math.random() * 40) + 60, // 60-100
        recoveryScore: Math.floor(Math.random() * 60) + 30, // 30-90
        deviceName: randomDevice
      };
      setWearableData(mockData);
    };

    fetchWearableData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchWearableData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!wearableData) return;

    const generatePersonalizedInsight = (data: WearableData): Insight => {
      const currentHour = new Date().getHours();
      const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening';
      
      // Critical sleep deprivation
      if (data.sleepQuality < 40) {
        return {
          title: `${userName}, Your Soul Needs Deep Rest`,
          message: `Your ${data.deviceName} shows your sleep quality at ${data.sleepQuality}%. Your nervous system is calling for profound restoration. I can feel the exhaustion in your energy field, dear one.`,
          recommendations: [
            "Create a sacred sleep sanctuary with blackout curtains",
            "Practice yoga nidra for deep nervous system reset",
            "Avoid screens 3 hours before your ideal bedtime",
            "Try magnesium glycinate 2 hours before sleep"
          ],
          chakra: "Root & Crown Chakra",
          crystals: ["Amethyst under pillow for peaceful dreams", "Lepidolite for anxiety relief", "Moonstone for sleep cycles"],
          foods: ["Tart cherry juice (natural melatonin)", "Chamomile tea with honey", "Magnesium-rich pumpkin seeds"],
          mantra: "I surrender to healing sleep, my body restores completely",
          breathwork: "4-7-8 breathing: Inhale 4, hold 7, exhale 8 counts",
          icon: <Moon className="h-5 w-5" />,
          color: "purple",
          urgency: "high"
        };
      }

      // High stress with low HRV
      if (data.stressLevel > 70 || data.heartRateVariability < 30) {
        return {
          title: `${userName}, Your Energy Needs Grounding`,
          message: `Your stress levels are at ${data.stressLevel}% and HRV is ${data.heartRateVariability}ms. Your adrenals are working overtime, beautiful soul. Your solar plexus chakra feels constricted.`,
          recommendations: [
            "Practice alternate nostril breathing for 10 minutes",
            "Walk barefoot on earth for grounding",
            "Take adaptogenic herbs like ashwagandha",
            "Schedule 20 minutes of meditation this ${timeOfDay}"
          ],
          chakra: "Solar Plexus & Root Chakra",
          crystals: ["Black tourmaline for energetic protection", "Hematite for grounding", "Citrine for personal power"],
          foods: ["Adaptogenic golden milk", "Dark leafy greens for magnesium", "Omega-3 rich walnuts"],
          mantra: "I am grounded, protected, and at peace with what is",
          breathwork: "Box breathing: 4 counts in, hold 4, out 4, hold 4",
          icon: <Leaf className="h-5 w-5" />,
          color: "green",
          urgency: "high"
        };
      }

      // Low activity with poor recovery
      if (data.activityLevel < 30 && data.recoveryScore < 50) {
        return {
          title: `${userName}, Your Life Force Seeks Movement`,
          message: `Your activity is at ${data.activityLevel}% and recovery at ${data.recoveryScore}%. Your sacral chakra energy feels stagnant. Gentle movement will awaken your vital force.`,
          recommendations: [
            "Start with 5-minute morning sun salutations",
            "Take walking meditation breaks every 2 hours",
            "Try gentle vinyasa flow to circulate energy",
            "Dance to music that makes your soul sing"
          ],
          chakra: "Sacral & Heart Chakra",
          crystals: ["Carnelian for motivation and vitality", "Orange calcite for creativity", "Sunstone for joy"],
          foods: ["Energizing green smoothie with spirulina", "Fresh citrus fruits", "Ginger tea for circulation"],
          mantra: "I move with grace, joy flows through my body",
          breathwork: "Breath of fire: Quick, rhythmic belly breathing",
          icon: <Zap className="h-5 w-5" />,
          color: "orange",
          urgency: "medium"
        };
      }

      // Elevated heart rate pattern
      if (data.heartRate > 85) {
        return {
          title: `${userName}, Your Heart Seeks Calm`,
          message: `Your resting heart rate is ${data.heartRate}bpm. Your heart chakra may be processing intense emotions. Let's bring gentle peace to your nervous system.`,
          recommendations: [
            "Practice heart-coherence breathing",
            "Place hand on heart and send yourself love",
            "Listen to 528Hz heart chakra healing music",
            "Spend time in nature or with loved ones"
          ],
          chakra: "Heart Chakra",
          crystals: ["Rose quartz for unconditional love", "Green aventurine for emotional healing", "Rhodonite for heart healing"],
          foods: ["Heart-healthy dark chocolate", "Green tea for calm alertness", "Hawthorn berry tea"],
          mantra: "My heart is open, peaceful, and filled with love",
          breathwork: "Heart coherence: 5 seconds in through heart, 5 seconds out",
          icon: <Heart className="h-5 w-5" />,
          color: "pink",
          urgency: "medium"
        };
      }

      // Balanced state - maintain and enhance
      return {
        title: `${userName}, Your Energy Radiates Beautifully`,
        message: `Your ${data.deviceName} shows wonderful balance: ${data.sleepQuality}% sleep quality, ${data.recoveryScore}% recovery. Your chakras are aligned and your energy flows harmoniously.`,
        recommendations: [
          "Maintain your current spiritual practices",
          "Express gratitude for your body's wisdom",
          "Share your positive energy with others",
          "Set an intention for continued growth"
        ],
        chakra: "All Chakras Aligned",
        crystals: ["Clear quartz for amplifying positive energy", "Selenite for spiritual connection", "Labradorite for transformation"],
        foods: ["Rainbow of fresh fruits and vegetables", "Herbal teas for continued wellness", "Probiotic foods for gut health"],
        mantra: "I am in perfect harmony with life's divine flow",
        breathwork: "Natural breath awareness with gratitude",
        icon: <Sparkles className="h-5 w-5" />,
        color: "rainbow",
        urgency: "low"
      };
    };

    setInsight(generatePersonalizedInsight(wearableData));
  }, [wearableData, userName]);

  if (!insight) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 animate-pulse text-purple-600" />
            <span className="text-purple-700">Analyzing your biometric data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const urgencyColors = {
    low: 'from-green-50 to-blue-50 border-green-200',
    medium: 'from-yellow-50 to-orange-50 border-yellow-200', 
    high: 'from-red-50 to-pink-50 border-red-200'
  };

  return (
    <Card className={`bg-gradient-to-r ${urgencyColors[insight.urgency]}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          {insight.icon}
          <span>Today's Personal Insight</span>
          <Brain className="h-4 w-4 text-purple-600" />
        </CardTitle>
        {wearableData?.deviceName && (
          <p className="text-xs text-gray-600">Based on your {wearableData.deviceName} data</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{insight.message}</p>
        </div>

        {insight.chakra && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-200 text-purple-800">
              🔮 {insight.chakra}
            </Badge>
          </div>
        )}

        {insight.breathwork && (
          <div className="bg-white/70 p-3 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-800 mb-1">🌬️ Recommended Breathwork:</p>
            <p className="text-sm text-blue-700">{insight.breathwork}</p>
          </div>
        )}

        {insight.crystals && (
          <div>
            <h4 className="text-xs font-medium text-gray-800 mb-1">💎 Healing Crystals:</h4>
            <div className="flex flex-wrap gap-1">
              {insight.crystals.map((crystal, idx) => (
                <Badge key={idx} variant="outline" className="text-xs border-purple-300 text-purple-700">
                  {crystal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {insight.mantra && (
          <div className="bg-white/70 p-3 rounded-lg border border-purple-200">
            <p className="text-xs font-medium text-purple-800 mb-1">🕉️ Personal Mantra:</p>
            <p className="text-sm italic text-purple-700">"{insight.mantra}"</p>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2 border-t">
          Last updated: {new Date().toLocaleTimeString()} • Next sync in 5 minutes
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysInsight;