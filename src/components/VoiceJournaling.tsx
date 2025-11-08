import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Play, Pause, Square, User, Calendar, Edit3 } from 'lucide-react';

interface JournalEntry {
  id: string;
  transcript: string;
  textEntry: string;
  emotions: string[];
  bodyMap: { area: string; intensity: number; sensation: string }[];
  timestamp: Date;
  duration: number;
}

const VoiceJournaling: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEntry, setCurrentEntry] = useState('');
  const [textEntry, setTextEntry] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      transcript: "I'm feeling a lot of tension in my shoulders today. It's like carrying the weight of the world.",
      textEntry: "Additional thoughts: I should try some shoulder stretches and maybe book a massage this weekend.",
      emotions: ['stressed', 'overwhelmed', 'tense'],
      bodyMap: [
        { area: 'shoulders', intensity: 8, sensation: 'tight, heavy' },
        { area: 'chest', intensity: 6, sensation: 'constricted breathing' }
      ],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 120
    }
  ]);

  const bodyParts = [
    { name: 'head', x: 50, y: 10, label: 'Head' },
    { name: 'neck', x: 50, y: 20, label: 'Neck' },
    { name: 'shoulders', x: 50, y: 30, label: 'Shoulders' },
    { name: 'chest', x: 50, y: 40, label: 'Chest' },
    { name: 'arms', x: 30, y: 35, label: 'Left Arm' },
    { name: 'arms', x: 70, y: 35, label: 'Right Arm' },
    { name: 'stomach', x: 50, y: 50, label: 'Stomach' },
    { name: 'hips', x: 50, y: 60, label: 'Hips' },
    { name: 'legs', x: 45, y: 75, label: 'Left Leg' },
    { name: 'legs', x: 55, y: 75, label: 'Right Leg' }
  ];

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setCurrentEntry("I'm noticing some anxiety in my chest area today. It feels like a flutter, almost like butterflies but more intense.");
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const saveEntry = () => {
    if (!currentEntry.trim() && !textEntry.trim()) return;
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      transcript: currentEntry,
      textEntry: textEntry,
      emotions: extractEmotions(currentEntry + ' ' + textEntry),
      bodyMap: selectedBodyPart ? [
        { area: selectedBodyPart, intensity: 7, sensation: 'noted during session' }
      ] : [],
      timestamp: new Date(),
      duration: 60
    };
    
    setEntries(prev => [newEntry, ...prev]);
    setCurrentEntry('');
    setTextEntry('');
    setSelectedBodyPart(null);
  };

  const extractEmotions = (text: string): string[] => {
    const emotions = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('anxious') || lowerText.includes('anxiety')) emotions.push('anxious');
    if (lowerText.includes('stress') || lowerText.includes('stressed')) emotions.push('stressed');
    if (lowerText.includes('calm') || lowerText.includes('peaceful')) emotions.push('calm');
    if (lowerText.includes('sad') || lowerText.includes('down')) emotions.push('sad');
    if (lowerText.includes('happy') || lowerText.includes('joy')) emotions.push('happy');
    if (lowerText.includes('angry') || lowerText.includes('frustrated')) emotions.push('frustrated');
    
    return emotions.length > 0 ? emotions : ['neutral'];
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      anxious: 'bg-red-100 text-red-800',
      stressed: 'bg-orange-100 text-orange-800',
      calm: 'bg-green-100 text-green-800',
      sad: 'bg-blue-100 text-blue-800',
      happy: 'bg-yellow-100 text-yellow-800',
      frustrated: 'bg-purple-100 text-purple-800',
      neutral: 'bg-gray-100 text-gray-800'
    };
    return colors[emotion] || colors.neutral;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-stone-800 mb-4">
            <Edit3 className="inline h-10 w-10 mr-2 text-black stroke-2" /> 
            Journal & Somatic Mapping
          </h2>
          <p className="text-lg text-stone-600">
            Record your voice or write about your feelings and track body sensations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-stone-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-black stroke-2" />
                Journal Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    size="lg"
                    className={`rounded-full h-24 w-24 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-black hover:bg-black/80'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="h-8 w-8" />
                    ) : (
                      <Mic className="h-8 w-8 stroke-2" />
                    )}
                  </Button>
                  {isRecording && (
                    <div className="absolute -top-2 -right-2">
                      <div className="h-4 w-4 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-stone-600">
                  {isRecording ? 'Recording... Speak freely about your feelings' : 'Tap to start voice recording'}
                </p>
              </div>
              
              {currentEntry && (
                <div className="space-y-4">
                  <div className="p-4 bg-stone-50 rounded-lg">
                    <h4 className="font-medium mb-2">Voice Transcript:</h4>
                    <p className="text-stone-700">{currentEntry}</p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Write Your Thoughts
                </h4>
                <Textarea
                  value={textEntry}
                  onChange={(e) => setTextEntry(e.target.value)}
                  placeholder="Type your journal entry here... Share your thoughts, feelings, or reflections."
                  className="min-h-[120px] resize-none"
                />
              </div>
              
              {(currentEntry || textEntry) && (
                <div className="flex gap-2 mt-4">
                  <Button onClick={saveEntry} className="bg-black hover:bg-black/80">
                    Save Journal Entry
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setCurrentEntry('');
                    setTextEntry('');
                  }}>
                    Clear
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-stone-200/50">
            <CardHeader>
              <CardTitle>Somatic Body Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mx-auto" style={{ width: '200px', height: '300px' }}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <ellipse cx="50" cy="12" rx="8" ry="10" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="45" y="22" width="10" height="15" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="35" y="25" width="30" height="20" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="45" y="45" width="10" height="20" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="42" y="65" width="6" height="25" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="52" y="65" width="6" height="25" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
                  
                  {bodyParts.map((part, index) => (
                    <circle
                      key={index}
                      cx={part.x}
                      cy={part.y}
                      r="3"
                      fill={selectedBodyPart === part.name ? '#ef4444' : '#3b82f6'}
                      className="cursor-pointer hover:fill-red-400 transition-colors"
                      onClick={() => setSelectedBodyPart(part.name)}
                    />
                  ))}
                </svg>
              </div>
              
              {selectedBodyPart && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Selected: {selectedBodyPart.charAt(0).toUpperCase() + selectedBodyPart.slice(1)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    This area will be noted in your journal entry
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceJournaling;