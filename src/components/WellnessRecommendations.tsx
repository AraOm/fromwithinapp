import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Apple, Gem, Activity, Zap } from 'lucide-react';

interface Recommendation {
  type: 'food' | 'crystal' | 'yoga' | 'reiki' | 'mantra';
  title: string;
  description: string;
  chakra?: string;
  icon: string;
}

const WellnessRecommendations: React.FC = () => {
  const [currentMood, setCurrentMood] = useState('balanced');
  const [heartRate, setHeartRate] = useState(72);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    generateRecommendations();
  }, [currentMood, heartRate]);

  const generateRecommendations = () => {
    const recs: Recommendation[] = [];
    
    // Food recommendations
    if (currentMood === 'anxious') {
      recs.push({
        type: 'food',
        title: 'Chamomile Tea & Almonds',
        description: 'Calming herbs and magnesium-rich nuts to soothe your nervous system',
        chakra: 'Heart',
        icon: '🍵'
      });
    } else if (currentMood === 'tired') {
      recs.push({
        type: 'food',
        title: 'Golden Turmeric Latte',
        description: 'Anti-inflammatory spices to boost energy and solar plexus chakra',
        chakra: 'Solar Plexus',
        icon: '☕'
      });
    }
    
    // Crystal recommendations
    if (heartRate > 80) {
      recs.push({
        type: 'crystal',
        title: 'Amethyst & Rose Quartz',
        description: 'Place over heart to calm elevated energy and promote peace',
        chakra: 'Heart',
        icon: '💎'
      });
    } else {
      recs.push({
        type: 'crystal',
        title: 'Citrine & Tiger\'s Eye',
        description: 'Energizing stones to boost confidence and personal power',
        chakra: 'Solar Plexus',
        icon: '🔶'
      });
    }
    
    // Yoga recommendations
    recs.push({
      type: 'yoga',
      title: 'Hip Opening Flow',
      description: 'Release stored emotions with pigeon pose and butterfly stretch',
      chakra: 'Sacral',
      icon: '🧘‍♀️'
    });
    
    // Reiki symbols
    recs.push({
      type: 'reiki',
      title: 'Cho Ku Rei Symbol',
      description: 'Draw this power symbol to amplify healing energy',
      icon: '🔮'
    });
    
    // Mantras
    recs.push({
      type: 'mantra',
      title: 'I Am Grounded & Safe',
      description: 'Repeat 108 times to activate root chakra stability',
      chakra: 'Root',
      icon: '📿'
    });
    
    setRecommendations(recs);
  };

  const moodOptions = [
    { value: 'anxious', label: 'Anxious', color: 'bg-red-100 text-red-800' },
    { value: 'tired', label: 'Tired', color: 'bg-orange-100 text-orange-800' },
    { value: 'balanced', label: 'Balanced', color: 'bg-green-100 text-green-800' },
    { value: 'energetic', label: 'Energetic', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'food': return <Apple className="h-4 w-4" />;
      case 'crystal': return <Gem className="h-4 w-4" />;
      case 'yoga': return <Activity className="h-4 w-4" />;
      case 'reiki': return <Zap className="h-4 w-4" />;
      case 'mantra': return <Heart className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-stone-800 mb-4">
            🌿 Real-Time Wellness Recommendations
          </h2>
          <p className="text-lg text-stone-600">
            Personalized guidance based on your current energy and biometrics
          </p>
        </div>

        {/* Current Status */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-stone-200/50">
          <CardHeader>
            <CardTitle>Current Energy Reading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-800">{heartRate} BPM</div>
                <div className="text-sm text-stone-600">Heart Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-800">7.2 Hz</div>
                <div className="text-sm text-stone-600">Brainwave (Alpha)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-800">85%</div>
                <div className="text-sm text-stone-600">HRV Score</div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Current Mood:
              </label>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={currentMood === mood.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentMood(mood.value)}
                    className={currentMood === mood.value ? 'bg-black hover:bg-black/80' : ''}
                  >
                    {mood.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-stone-200/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(rec.type)}
                  <span className="text-2xl">{rec.icon}</span>
                  {rec.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-600 mb-3">{rec.description}</p>
                <div className="flex items-center justify-between">
                  {rec.chakra && (
                    <Badge variant="secondary" className="bg-stone-200/80 text-stone-700">
                      {rec.chakra} Chakra
                    </Badge>
                  )}
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${
                      rec.type === 'food' ? 'border-green-300 text-green-700' :
                      rec.type === 'crystal' ? 'border-purple-300 text-purple-700' :
                      rec.type === 'yoga' ? 'border-blue-300 text-blue-700' :
                      rec.type === 'reiki' ? 'border-amber-300 text-amber-700' :
                      'border-pink-300 text-pink-700'
                    }`}
                  >
                    {rec.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Biometric Integration */}
        <Card className="mt-6 bg-white/80 backdrop-blur-sm border-stone-200/50">
          <CardHeader>
            <CardTitle>📱 Wearable Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Apple Watch Connected</div>
                  <div className="text-sm text-stone-600">Syncing HRV & heart rate</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Oura Ring Detected</div>
                  <div className="text-sm text-stone-600">Sleep & recovery data</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WellnessRecommendations;