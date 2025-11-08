import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, CheckCircle, Lock, Star } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  isUnlocked: boolean;
  lessons: number;
  rating: number;
}

const SpiritualEducation: React.FC = () => {
  const [modules] = useState<Module[]>([
    {
      id: '1',
      title: 'Introduction to Chakras',
      description: 'Learn about the seven main energy centers and how to balance them through meditation, crystals, and breathwork.',
      duration: '45 min',
      difficulty: 'Beginner',
      progress: 100,
      isUnlocked: true,
      lessons: 7,
      rating: 4.8
    },
    {
      id: '2', 
      title: 'Crystal Healing Fundamentals',
      description: 'Discover the healing properties of crystals, how to cleanse them, and create powerful crystal grids for manifestation.',
      duration: '60 min',
      difficulty: 'Beginner',
      progress: 65,
      isUnlocked: true,
      lessons: 8,
      rating: 4.9
    },
    {
      id: '3',
      title: 'Advanced Meditation Techniques',
      description: 'Master deeper meditation practices including visualization, mantra meditation, and transcendental states.',
      duration: '90 min',
      difficulty: 'Intermediate',
      progress: 0,
      isUnlocked: true,
      lessons: 12,
      rating: 4.7
    },
    {
      id: '4',
      title: 'Sacred Geometry & Manifestation',
      description: 'Explore the mathematical patterns of creation and use sacred geometry for powerful manifestation work.',
      duration: '75 min',
      difficulty: 'Advanced',
      progress: 0,
      isUnlocked: false,
      lessons: 10,
      rating: 4.6
    },
    {
      id: '5',
      title: 'Energy Healing & Reiki',
      description: 'Learn to channel universal life force energy for healing yourself and others through Reiki principles.',
      duration: '120 min',
      difficulty: 'Intermediate',
      progress: 0,
      isUnlocked: false,
      lessons: 15,
      rating: 4.8
    },
    {
      id: '6',
      title: 'Astrology & Spiritual Timing',
      description: 'Understand how celestial movements influence your spiritual journey and optimal timing for rituals.',
      duration: '100 min',
      difficulty: 'Advanced',
      progress: 0,
      isUnlocked: false,
      lessons: 14,
      rating: 4.5
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartModule = (moduleId: string) => {
    console.log('Starting module:', moduleId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-4">
          <BookOpen className="inline h-8 w-8 mr-2" />
          Spiritual Growth Academy
        </h1>
        <p className="text-stone-600">
          Deepen your spiritual practice with guided learning modules from ancient wisdom traditions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id} className={`relative transition-all hover:shadow-lg ${
            module.isUnlocked ? 'bg-white' : 'bg-gray-50 opacity-75'
          }`}>
            {!module.isUnlocked && (
              <div className="absolute top-4 right-4 z-10">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <Badge className={getDifficultyColor(module.difficulty)}>
                  {module.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{module.rating}</span>
                </div>
              </div>
              
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-2">{module.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{module.lessons} lessons</span>
                <span>{module.duration}</span>
              </div>
              
              {module.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
              )}
              
              <Button 
                onClick={() => handleStartModule(module.id)}
                disabled={!module.isUnlocked}
                className="w-full"
                variant={module.progress > 0 ? "outline" : "default"}
              >
                {!module.isUnlocked ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Locked
                  </>
                ) : module.progress === 100 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : module.progress > 0 ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Module
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 mb-2">
              Complete modules to unlock advanced teachings
            </h3>
            <p className="text-purple-600 mb-4">
              Each module builds upon the previous, creating a comprehensive spiritual education journey
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-purple-700">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Expert-guided content</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Practical exercises</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Progress tracking</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpiritualEducation;