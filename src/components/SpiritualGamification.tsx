import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Star, Zap, Target, TrendingUp } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  points: number;
}

const SpiritualGamification: React.FC = () => {
  const [userLevel, setUserLevel] = useState(7);
  const [totalPoints, setTotalPoints] = useState(1250);
  const [currentStreak, setCurrentStreak] = useState(12);
  
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Meditation Master',
      description: 'Complete 30 days of meditation',
      icon: '🧘',
      unlocked: true
    },
    {
      id: '2',
      title: 'Chakra Aligner',
      description: 'Balance all 7 chakras in one session',
      icon: '🌈',
      unlocked: true
    },
    {
      id: '3',
      title: 'Crystal Collector',
      description: 'Learn about 20 different crystals',
      icon: '💎',
      unlocked: false,
      progress: 15,
      maxProgress: 20
    },
    {
      id: '4',
      title: 'Energy Healer',
      description: 'Help 5 community members',
      icon: '✨',
      unlocked: false,
      progress: 3,
      maxProgress: 5
    }
  ];

  const dailyGoals: DailyGoal[] = [
    { id: '1', title: 'Morning meditation (10 min)', completed: true, points: 20 },
    { id: '2', title: 'Chakra energy check', completed: true, points: 15 },
    { id: '3', title: 'Gratitude journaling', completed: false, points: 10 },
    { id: '4', title: 'Community interaction', completed: false, points: 25 }
  ];

  const completedGoals = dailyGoals.filter(goal => goal.completed).length;
  const totalGoals = dailyGoals.length;
  const dailyProgress = (completedGoals / totalGoals) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600">Level {userLevel}</div>
            <p className="text-sm text-gray-600">Spiritual Seeker</p>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">750/1000 XP to next level</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-1">
              <Star className="h-6 w-6" />
              {totalPoints}
            </div>
            <p className="text-sm text-gray-600">Spirit Points</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
              <Zap className="h-6 w-6" />
              {currentStreak}
            </div>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Today's Spiritual Goals
          </CardTitle>
          <CardDescription>
            Complete daily practices to earn points and maintain your streak
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Daily Progress</span>
              <span className="text-sm text-gray-600">{completedGoals}/{totalGoals}</span>
            </div>
            <Progress value={dailyProgress} className="mb-4" />
            
            {dailyGoals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    goal.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {goal.completed && (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>
                    )}
                  </div>
                  <span className={goal.completed ? 'line-through text-gray-500' : ''}>
                    {goal.title}
                  </span>
                </div>
                <Badge variant={goal.completed ? 'default' : 'outline'}>
                  +{goal.points} pts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Spiritual Achievements
          </CardTitle>
          <CardDescription>
            Unlock badges as you progress on your spiritual journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-4 border rounded-lg ${
                achievement.unlocked ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.unlocked ? 'text-amber-800' : 'text-gray-600'}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    
                    {!achievement.unlocked && achievement.progress && achievement.maxProgress && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                      </div>
                    )}
                    
                    {achievement.unlocked && (
                      <Badge className="bg-amber-100 text-amber-800">Unlocked!</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mirror Check-In */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Daily Mirror Check-In
          </CardTitle>
          <CardDescription>
            Reflect on your spiritual alignment and receive AI insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-6xl">🪞</div>
            <p className="text-gray-600">How aligned do you feel today?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button key={rating} variant="outline" size="sm" className="w-12 h-12 rounded-full">
                  {rating}
                </Button>
              ))}
            </div>
            <Button className="mt-4">Complete Check-In (+15 pts)</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpiritualGamification;