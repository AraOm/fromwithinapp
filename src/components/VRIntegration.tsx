import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Headphones, Play, Settings, Zap } from 'lucide-react';
import ChakraLotusIcon from '@/components/ChakraLotusIcon';

const VRIntegration = () => {
  const [selectedExperience, setSelectedExperience] = useState(null);
  
  const vrExperiences = [
    {
      id: 1,
      name: 'Root Chakra Temple',
      description: 'Ground yourself in an ancient earth temple',
      chakra: 'Root',
      color: '#991b1b',
      duration: '15 min',
      difficulty: 'Beginner',
      compatibility: ['Oculus', 'Vision Pro']
    },
    {
      id: 2,
      name: 'Heart Chakra Garden',
      description: 'Open your heart in a crystal rose garden',
      chakra: 'Heart',
      color: '#065f46',
      duration: '20 min',
      difficulty: 'Intermediate',
      compatibility: ['Oculus', 'Vision Pro', 'PICO']
    },
    {
      id: 3,
      name: 'Crown Chakra Cosmos',
      description: 'Connect with universal consciousness',
      chakra: 'Crown',
      color: '#6b46c1',
      duration: '25 min',
      difficulty: 'Advanced',
      compatibility: ['Vision Pro']
    }
  ];

  const userProgress = {
    'Root': 85,
    'Heart': 60,
    'Crown': 30
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            VR Chakra Experiences
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Immersive meditation in chakra-aligned virtual temples
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {vrExperiences.map((experience) => (
              <div key={experience.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <ChakraLotusIcon chakra={experience.chakra} color={experience.color} size={32} />
                    <div>
                      <h3 className="font-semibold">{experience.name}</h3>
                      <p className="text-sm text-muted-foreground">{experience.description}</p>
                    </div>
                  </div>
                  <Badge style={{ backgroundColor: experience.color, color: 'white' }}>
                    {experience.chakra}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span>Duration: {experience.duration}</span>
                  <span>Level: {experience.difficulty}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Your Progress</span>
                    <span>{userProgress[experience.chakra]}%</span>
                  </div>
                  <Progress value={userProgress[experience.chakra]} className="h-2" />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Compatible:</span>
                  {experience.compatibility.map((device) => (
                    <Badge key={device} variant="outline" className="text-xs">
                      {device}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    Start Experience
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4" />
              <span className="font-medium">VR Setup Required</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect your VR headset to access immersive chakra experiences. Supports Oculus Quest, Vision Pro, and PICO devices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRIntegration;