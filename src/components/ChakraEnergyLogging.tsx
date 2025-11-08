import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileChakraLogging from '@/components/MobileChakraLogging';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, BarChart3, PieChart, Clock } from 'lucide-react';
import ChakraLotusIcon from '@/components/ChakraLotusIcon';

interface ChakraLog {
  id: string;
  chakra: string;
  color: string;
  intensity: number;
  notes: string;
  timestamp: Date;
}

const ChakraEnergyLogging: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedChakra, setSelectedChakra] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState<ChakraLog[]>([
    {
      id: '1',
      chakra: 'Heart',
      color: '#228B22',
      intensity: 7,
      notes: 'Feeling open and loving after meditation',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      chakra: 'Throat',
      color: '#003366',
      intensity: 4,
      notes: 'Difficulty expressing myself today',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    }
  ]);

  if (isMobile) {
    return <MobileChakraLogging />;
  }

  const chakras = [
    { name: 'Crown', color: '#4A0E4E' }, // Deep Purple
    { name: 'Third Eye', color: '#9966CC' }, // Light Purple  
    { name: 'Throat', color: '#003366' }, // Deep Blue
    { name: 'Heart', color: '#228B22' }, // Forest Green
    { name: 'Solar Plexus', color: '#DAA520' }, // Mustard Yellow
    { name: 'Sacral', color: '#FF4500' }, // Deep Orange
    { name: 'Root', color: '#8B0000' } // Deep Red
  ];

  const handleLogChakra = () => {
    if (!selectedChakra) return;
    
    const chakraData = chakras.find(c => c.name === selectedChakra);
    if (!chakraData) return;
    
    const newLog: ChakraLog = {
      id: Date.now().toString(),
      chakra: selectedChakra,
      color: chakraData.color,
      intensity,
      notes,
      timestamp: new Date()
    };
    
    setLogs(prev => [newLog, ...prev]);
    setSelectedChakra(null);
    setIntensity(5);
    setNotes('');
  };

  const getAIInsight = () => {
    const recentLogs = logs.slice(0, 5);
    const chakraCounts = recentLogs.reduce((acc, log) => {
      acc[log.chakra] = (acc[log.chakra] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostActive = Object.entries(chakraCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (mostActive && mostActive[1] > 2) {
      return `Your ${mostActive[0]} chakra has been very active lately. Consider balancing with grounding practices and complementary chakra work.`;
    }
    
    return "Your chakras show a healthy balance. Keep up your spiritual practice!";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-stone-800 mb-4" style={{fontFamily: 'Canela, serif'}}>
            🔮 Chakra & Energy Logging
          </h2>
          <p className="text-lg text-stone-600" style={{fontFamily: 'Satoshi, sans-serif'}}>
            Track your energy centers and receive AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chakra Picker - Horizontal Layout */}
          <Card className="bg-white/80 backdrop-blur-sm border-stone-200/50">
            <CardHeader>
              <CardTitle style={{fontFamily: 'Canela, serif'}}>Select Chakra to Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-6 py-8">
                {chakras.map((chakra) => (
                  <div key={chakra.name} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => setSelectedChakra(chakra.name)}
                      className={`transition-all duration-300 ${selectedChakra === chakra.name ? 'scale-125 shadow-lg' : 'hover:scale-110'}`}
                    >
                      <ChakraLotusIcon 
                        className="h-12 w-12" 
                        color={chakra.color}
                      />
                    </button>
                    <span className="text-sm font-medium text-stone-700 text-center" style={{fontFamily: 'Satoshi, sans-serif'}}>{chakra.name}</span>
                  </div>
                ))}
              </div>
              
              {selectedChakra && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2" style={{fontFamily: 'Satoshi, sans-serif'}}>
                      {selectedChakra} Chakra Intensity (1-10)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={intensity}
                        onChange={(e) => setIntensity(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-stone-800 w-8" style={{fontFamily: 'Satoshi, sans-serif'}}>
                        {intensity}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2" style={{fontFamily: 'Satoshi, sans-serif'}}>
                      Notes & Observations
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="How does this chakra feel? Any sensations, emotions, or insights?"
                      rows={3}
                      style={{fontFamily: 'Satoshi, sans-serif'}}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleLogChakra}
                    className="w-full bg-black hover:bg-black/80"
                    style={{fontFamily: 'Satoshi, sans-serif'}}
                  >
                    Log {selectedChakra} Chakra
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Logs */}
          <Card className="bg-white/80 backdrop-blur-sm border-stone-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Canela, serif'}}>
                <Clock className="h-5 w-5" />
                Recent Chakra Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ChakraLotusIcon className="h-4 w-4" color={log.color} />
                        <span className="font-medium" style={{fontFamily: 'Satoshi, sans-serif'}}>{log.chakra}</span>
                        <Badge variant="outline" style={{fontFamily: 'Satoshi, sans-serif'}}>
                          Intensity: {log.intensity}/10
                        </Badge>
                      </div>
                      <span className="text-xs text-stone-500" style={{fontFamily: 'Satoshi, sans-serif'}}>
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-sm text-stone-600" style={{fontFamily: 'Satoshi, sans-serif'}}>{log.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-stone-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Canela, serif'}}>
              <BarChart3 className="h-5 w-5 text-purple-500" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-stone-700" style={{fontFamily: 'Satoshi, sans-serif'}}>{getAIInsight()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChakraEnergyLogging;