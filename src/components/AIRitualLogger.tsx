import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Send } from 'lucide-react';

const AIRitualLogger: React.FC = () => {
  const [ritualType, setRitualType] = useState('');
  const [intention, setIntention] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Reset form
    setRitualType('');
    setIntention('');
    setDescription('');
    setDuration('');
    setIsSubmitting(false);
    
    alert('Ritual logged successfully! AI guidance will be provided shortly.');
  };

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-canela">
          <Sparkles className="h-5 w-5 text-cyan-500" />
          Ritual Log
        </CardTitle>
        <p className="text-sm text-gray-600 font-satoshi">Log your spiritual practice and receive personalized guidance</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ritual-type" className="font-satoshi">Ritual Type</Label>
            <Select value={ritualType} onValueChange={setRitualType}>
              <SelectTrigger className="font-satoshi">
                <SelectValue placeholder="Select ritual type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meditation">Meditation</SelectItem>
                <SelectItem value="chakra-work">Chakra Work</SelectItem>
                <SelectItem value="energy-cleansing">Energy Cleansing</SelectItem>
                <SelectItem value="manifestation">Manifestation</SelectItem>
                <SelectItem value="gratitude">Gratitude Practice</SelectItem>
                <SelectItem value="breathwork">Breathwork</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="intention" className="font-satoshi">Intention</Label>
            <Input
              id="intention"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="What is your intention for this ritual?"
              className="font-satoshi"
            />
          </div>
          
          <div>
            <Label htmlFor="duration" className="font-satoshi">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="How long did you practice?"
              className="font-satoshi"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="font-satoshi">Description & Experience</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your experience, insights, or any guidance you're seeking..."
              rows={4}
              className="font-satoshi"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-cyan-500 hover:bg-cyan-600 font-satoshi"
            disabled={isSubmitting || !ritualType || !intention}
          >
            {isSubmitting ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit for AI Guidance
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIRitualLogger;