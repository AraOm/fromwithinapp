import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Zap, Brain, Play, Pause } from 'lucide-react';

interface BiometricData {
  heartRate: number;
  hrv: number;
  breathRate: number;
  skinConductance: number;
  emotionalState: string;
}

const EmotionAwareFeedback: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentData, setCurrentData] = useState<BiometricData>({
    heartRate: 72,
    hrv: 45,
    breathRate: 16,
    skinConductance: 2.3,
    emotionalState: 'calm'
  });
  const [breathingExercise, setBreathingExercise] = useState({
    active: false,
    phase: 'inhale', // inhale, hold1, exhale, hold2
    count: 4,
    cycle: 0
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        // Simulate real-time biometric data
        setCurrentData(prev => ({
          heartRate: prev.heartRate + (Math.random() - 0.5) * 4,
          hrv: Math.max(20, prev.hrv + (Math.random() - 0.5) * 10),
          breathRate: Math.max(12, prev.breathRate + (Math.random() - 0.5) * 2),
          skinConductance: Math.max(1, prev.skinConductance + (Math.random() - 0.5) * 0.5),
          emotionalState: detectEmotionalState(prev)
        }));
      }, 2000);
    }
    
    return () => clearInterval(interval);
  }, [isMonitoring]);

  useEffect(() => {
    let breathInterval: NodeJS.Timeout;
    
    if (breathingExercise.active) {
      breathInterval = setInterval(() => {
        setBreathingExercise(prev => {
          let newPhase = prev.phase;
          let newCount = prev.count - 1;
          let newCycle = prev.cycle;
          
          if (newCount <= 0) {
            switch (prev.phase) {
              case 'inhale':
                newPhase = 'hold1';
                break;
              case 'hold1':
                newPhase = 'exhale';
                break;
              case 'exhale':
                newPhase = 'hold2';
                break;
              case 'hold2':
                newPhase = 'inhale';
                newCycle = prev.cycle + 1;
                break;
            }
            newCount = 4;
          }
          
          return {
            ...prev,
            phase: newPhase,
            count: newCount,
            cycle: newCycle
          };
        });
      }, 1000);
    }
    
    return () => clearInterval(breathInterval);
  }, [breathingExercise.active]);

  const detectEmotionalState = (data: BiometricData): string => {
    if (data.heartRate > 85 && data.skinConductance > 3) {
      return 'anxious';
    } else if (data.heartRate < 60 && data.hrv > 60) {
      return 'relaxed';
    } else if (data.breathRate > 20) {
      return 'stressed';
    } else {
      return 'calm';
    }
  };

  const startBreathingExercise = () => {
    setBreathingExercise({
      active: true,
      phase: 'inhale',
      count: 4,
      cycle: 0
    });
  };

  const stopBreathingExercise = () => {
    setBreathingExercise(prev => ({ ...prev, active: false }));
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'anxious': return 'bg-red-100 text-red-800';
      case 'stressed': return 'bg-orange-100 text-orange-800';
      case 'calm': return 'bg-green-100 text-green-800';
      case 'relaxed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendation = () => {
    switch (currentData.emotionalState) {
      case 'anxious':
        return "I sense rising anxiety in your energy field. Let's pause for some box breathing to ground your nervous system.";
      case 'stressed':
        return "Your stress levels are elevated. Try some gentle neck rolls and deep belly breathing.";
      case 'relaxed':
        return "Beautiful! Your energy is flowing peacefully. This is a perfect time for meditation or journaling.";
      default:
        return "Your energy feels balanced. Maintain this state with mindful awareness.";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-stone-800 mb-4">
            Emotional Feedback
          </h2>
          <p className="text-lg text-stone-600">
            Real-time biometric monitoring with intelligent emotional insights
          </p>
        </div>

        {/* Monitoring Control */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-stone-200/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Biometric Monitoring</span>
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={isMonitoring ? 'bg-red-500 hover:bg-red-600' : 'bg-black hover:bg-black/80'}
              >
                {isMonitoring ? (
                  <><Pause className="h-4 w-4 mr-2" /> Stop Monitoring</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" /> Start Monitoring</>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-stone-50 rounded-lg">
                <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-stone-800">
                  {Math.round(currentData.heartRate)}
                </div>
                <div className="text-sm text-stone-600">BPM</div>
              </div>
              
              <div className="text-center p-4 bg-stone-50 rounded-lg">
                <Activity className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-stone-800">
                  {Math.round(currentData.hrv)}
                </div>
                <div className="text-sm text-stone-600">HRV</div>
              </div>
              
              <div className="text-center p-4 bg-stone-50 rounded-lg">
                <Zap className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-stone-800">
                  {Math.round(currentData.breathRate)}
                </div>
                <div className="text-sm text-stone-600">Breaths/min</div>
              </div>
              
              <div className="text-center p-4 bg-stone-50 rounded-lg">
                <Brain className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-stone-800">
                  {currentData.skinConductance.toFixed(1)}
                </div>
                <div className="text-sm text-stone-600">μS</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Badge className={`text-lg px-4 py-2 ${getEmotionColor(currentData.emotionalState)}`}>
                Current State: {currentData.emotionalState.charAt(0).toUpperCase() + currentData.emotionalState.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendation */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-stone-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Emotional Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-stone-700">{getRecommendation()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Breathing Exercise */}
        <Card className="bg-white/80 backdrop-blur-sm border-stone-200/50">
          <CardHeader>
            <CardTitle>Guided Box Breathing</CardTitle>
          </CardHeader>
          <CardContent>
            {!breathingExercise.active ? (
              <div className="text-center">
                <p className="text-stone-600 mb-4">
                  When anxiety or stress is detected, use this 4-4-4-4 breathing pattern to restore balance.
                </p>
                <Button onClick={startBreathingExercise} className="bg-black hover:bg-black/80">
                  Start Breathing Exercise
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-6xl font-bold text-stone-800 mb-2">
                    {breathingExercise.count}
                  </div>
                  <div className="text-2xl text-stone-600 capitalize mb-4">
                    {breathingExercise.phase === 'hold1' ? 'Hold' : 
                     breathingExercise.phase === 'hold2' ? 'Hold' : 
                     breathingExercise.phase}
                  </div>
                  <Progress 
                    value={(4 - breathingExercise.count) * 25} 
                    className="w-64 mx-auto mb-4" 
                  />
                  <div className="text-sm text-stone-500">
                    Cycle {breathingExercise.cycle + 1} of 10
                  </div>
                </div>
                
                <Button 
                  onClick={stopBreathingExercise}
                  variant="outline"
                  className="mr-2"
                >
                  Stop Exercise
                </Button>
                
                {breathingExercise.cycle >= 10 && (
                  <Badge className="bg-green-100 text-green-800 ml-2">
                    ✨ Exercise Complete!
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Integration */}
        <Card className="mt-6 bg-white/80 backdrop-blur-sm border-stone-200/50">
          <CardHeader>
            <CardTitle>📱 Connected Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Apple Watch</div>
                  <div className="text-sm text-stone-600">Heart rate & HRV</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Oura Ring</div>
                  <div className="text-sm text-stone-600">Sleep & recovery</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Muse Headband</div>
                  <div className="text-sm text-stone-600">Brainwave activity</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionAwareFeedback;