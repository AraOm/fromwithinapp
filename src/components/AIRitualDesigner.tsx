import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Moon, Heart, Music, Flame, Calendar, Sparkles } from 'lucide-react';

interface RitualPlan {
  intention: string;
  moonPhase: string;
  mood: string;
  activities: string[];
  duration: string;
  chakra?: string;
  crystals: string[];
  mantra: string;
  breathwork: string;
  foods?: string[];
}

const AIRitualDesigner: React.FC = () => {
  const [intention, setIntention] = useState('');
  const [mood, setMood] = useState('');
  const [ritualPlan, setRitualPlan] = useState<RitualPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRitual = async () => {
    setIsGenerating(true);
    
    // Enhanced ritual generation based on emotional/physical state
    setTimeout(() => {
      const moodLower = mood.toLowerCase();
      let ritual: RitualPlan;
      
      if (moodLower.includes('tired') || moodLower.includes('exhausted') || moodLower.includes('drained')) {
        ritual = {
          intention,
          moonPhase: 'New Moon - Rest & Renewal',
          mood,
          duration: '18 minutes',
          chakra: 'Root Chakra - Grounding Energy',
          crystals: ['Hematite', 'Black Tourmaline', 'Red Jasper'],
          mantra: 'I am grounded, I am restored, I am renewed',
          breathwork: '4-7-8 Restorative Breathing',
          foods: ['Dark leafy greens', 'Nuts and seeds', 'Herbal tea'],
          activities: [
            'Ground yourself: Sit barefoot on earth or hold grounding crystals',
            'Restorative breathwork: 4-7-8 breathing for 5 minutes',
            'Crystal meditation with hematite on root chakra',
            'Gentle body scan to release tension',
            'Nourish with grounding foods and herbal tea',
            'Set intention for rest and renewal'
          ]
        };
      } else if (moodLower.includes('stress') || moodLower.includes('overwhelm') || moodLower.includes('anxious')) {
        ritual = {
          intention,
          moonPhase: 'Waning Moon - Release & Clear',
          mood,
          duration: '20 minutes',
          chakra: 'Solar Plexus & Heart Chakra',
          crystals: ['Amethyst', 'Rose Quartz', 'Clear Quartz'],
          mantra: 'I release what no longer serves me, I am at peace',
          breathwork: 'Box Breathing for Nervous System',
          activities: [
            'Sage or palo santo clearing ritual',
            'Box breathing: 4-4-4-4 count for 7 minutes',
            'Journal prompt: "What am I ready to release?"',
            'Amethyst meditation on third eye',
            'Heart-opening stretches with rose quartz',
            'Affirmations for peace and calm'
          ]
        };
      } else if (moodLower.includes('sad') || moodLower.includes('down') || moodLower.includes('lonely')) {
        ritual = {
          intention,
          moonPhase: 'Waxing Moon - Growth & Healing',
          mood,
          duration: '22 minutes',
          chakra: 'Heart Chakra - Self-Love',
          crystals: ['Rose Quartz', 'Green Aventurine', 'Moonstone'],
          mantra: 'I am loved, I am worthy, I am whole',
          breathwork: 'Heart-Opening Breath',
          activities: [
            'Create sacred space with rose quartz',
            'Heart-opening breathwork for 8 minutes',
            'Self-compassion meditation',
            'Write a love letter to yourself',
            'Gentle movement or dancing',
            'Close with gratitude practice'
          ]
        };
      } else {
        // Default balanced ritual
        ritual = {
          intention,
          moonPhase: 'Full Moon - Manifestation',
          mood,
          duration: '15 minutes',
          chakra: 'All Chakras - Balance',
          crystals: ['Clear Quartz', 'Amethyst', 'Citrine'],
          mantra: 'I am aligned with my highest good',
          breathwork: 'Balanced Breathing',
          activities: [
            'Light a white candle for clarity',
            'Balanced breathing meditation - 5 minutes',
            'Crystal grid with clear quartz center',
            'Intention setting and visualization',
            'Gratitude practice',
            'Seal ritual with chosen mantra'
          ]
        };
      }
      
      setRitualPlan(ritual);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Ritual Designer
          </CardTitle>
          <CardDescription>
            Your spiritual coach for personalized energetic rituals based on how you feel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="intention">Your Intention</Label>
            <Input
              id="intention"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="e.g., Find inner peace, Release anxiety, Boost energy..."
            />
          </div>
          
          <div>
            <Label htmlFor="mood">How are you feeling?</Label>
            <Textarea
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="I feel tired... I'm overwhelmed... I'm anxious... I feel sad..."
              rows={3}
            />
          </div>

          <Button 
            onClick={generateRitual} 
            disabled={!intention || !mood || isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Creating Your Ritual...' : 'Design My Ritual'}
          </Button>

          {ritualPlan && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Your Sacred Ritual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Duration: {ritualPlan.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span className="font-medium">{ritualPlan.moonPhase}</span>
                    </div>
                  </div>
                  
                  {ritualPlan.chakra && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800">Energy Focus</h4>
                      <p className="text-purple-700">{ritualPlan.chakra}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-2">Ritual Steps:</h4>
                    <ul className="space-y-2">
                      {ritualPlan.activities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-sm">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Crystals:</h4>
                      <div className="flex flex-wrap gap-1">
                        {ritualPlan.crystals.map((crystal, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {crystal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Breathwork:</h4>
                      <p className="text-sm text-gray-600">{ritualPlan.breathwork}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Sacred Mantra:</h4>
                    <p className="italic text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      "{ritualPlan.mantra}"
                    </p>
                  </div>
                  
                  {ritualPlan.foods && (
                    <div>
                      <h4 className="font-medium mb-2">Nourishing Foods:</h4>
                      <div className="flex flex-wrap gap-1">
                        {ritualPlan.foods.map((food, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRitualDesigner;