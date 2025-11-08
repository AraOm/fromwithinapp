import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, Edit3, Calendar } from 'lucide-react';
import ChakraLotusIcon from '@/components/ChakraLotusIcon';
import HeartIcon from '@/components/HeartIcon';
import TodaysInsight from './TodaysInsight';

interface MobileHomeContentProps {
  onViewChange: (view: string) => void;
}

const MobileHomeContent: React.FC<MobileHomeContentProps> = ({ onViewChange }) => {
  const chakraColors = [
    '#4A0E4E', // deep purple (root)
    '#9966CC', // light purple (sacral)
    '#003366', // deep blue (solar plexus)
    '#228B22', // forest green (heart)
    '#DAA520', // mustard yellow (throat)
    '#FF4500', // deep orange (third eye)
    '#8B0000'  // deep red (crown)
  ];

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Today's Insight */}
      <TodaysInsight />
      
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-3">
          Welcome to Your Spiritual Journey
        </h2>
        <p className="text-sm text-stone-600 leading-relaxed">
          Discover balance through ancient wisdom and modern technology. 
          Track your energy, align your chakras, and find inner peace.
        </p>
      </div>

      {/* Main Home Components */}
      <div className="space-y-4">
        {/* Chakra Logging */}
        <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                {chakraColors.map((color, index) => (
                  <ChakraLotusIcon key={index} className="h-4 w-4" color={color} />
                ))}
              </div>
              <div className="flex-1">
                <CardTitle className="text-stone-800 text-base">Chakra Logging</CardTitle>
                <CardDescription className="text-stone-600 text-sm">Track your energy centers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              className="w-full bg-black hover:bg-black/80 text-white"
              onClick={() => onViewChange('chakra-logging')}
            >
              Log Energy
            </Button>
          </CardContent>
        </Card>

        {/* My Mentor */}
        <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <HeartIcon className="h-8 w-8 text-black" />
              <div className="flex-1">
                <CardTitle className="text-stone-800 text-base">Spiritual Mentor</CardTitle>
                <CardDescription className="text-stone-600 text-sm">Your wise spiritual guide</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center space-x-2 text-sm text-stone-700">
              <HeartIcon className="h-4 w-4 text-pink-600" />
              <span>Personalized insights</span>
            </div>
            <Button 
              className="w-full bg-black hover:bg-black/80 text-white"
              onClick={() => onViewChange('spiritual-mentor')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Mentor
            </Button>
          </CardContent>
        </Card>

        {/* Journal */}
        <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Edit3 className="h-8 w-8 text-black stroke-2" />
              <div className="flex-1">
                <CardTitle className="text-stone-800 text-base">Journal</CardTitle>
                <CardDescription className="text-stone-600 text-sm">Write or speak your truth</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              className="w-full bg-black hover:bg-black/80 text-white"
              onClick={() => onViewChange('voice-journaling')}
            >
              Open Journal
            </Button>
          </CardContent>
        </Card>

        {/* Smart Planner */}
        <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-black" />
              <div className="flex-1">
                <CardTitle className="text-stone-800 text-base">Smart Planner</CardTitle>
                <CardDescription className="text-stone-600 text-sm">Personalized wellness plan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              className="w-full bg-black hover:bg-black/80 text-white"
              onClick={() => onViewChange('smart-planner')}
            >
              View Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileHomeContent;