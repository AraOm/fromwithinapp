import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, BarChart3 } from 'lucide-react';
import ChakraLotusIcon from '@/components/ChakraLotusIcon';

interface ChakraLog {
  id: string;
  chakra: string;
  color: string;
  intensity: number;
  notes: string;
  timestamp: Date;
}

const MobileChakraLogging: React.FC = () => {
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
    }
  ]);

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

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          🔮 Chakra Logging
        </h2>
        <p className="text-sm text-stone-600">
          Track your energy centers
        </p>
      </div>

      {/* Chakra Selector */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Select Chakra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {chakras.map((chakra) => (
              <button
                key={chakra.name}
                onClick={() => setSelectedChakra(chakra.name)}
                className={`p-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${selectedChakra === chakra.name ? 'bg-stone-100 scale-105' : 'hover:bg-stone-50'}`}
              >
                <ChakraLotusIcon 
                  className="h-6 w-6" 
                  color={chakra.color}
                />
                <span className="text-sm font-medium text-stone-700">
                  {chakra.name}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logging Form */}
      {selectedChakra && (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Log {selectedChakra} Chakra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Intensity: {intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How does this chakra feel?"
                rows={3}
                className="text-sm"
              />
            </div>
            
            <Button 
              onClick={handleLogChakra}
              className="w-full bg-black hover:bg-black/80 text-white"
            >
              Log Energy
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Logs */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-4 w-4" />
            Recent Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ChakraLotusIcon className="h-4 w-4" color={log.color} />
                    <span className="font-medium text-sm">{log.chakra}</span>
                    <Badge variant="outline" className="text-xs">
                      {log.intensity}/10
                    </Badge>
                  </div>
                  <span className="text-xs text-stone-500">
                    {log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                {log.notes && (
                  <p className="text-xs text-stone-600">{log.notes}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-4 w-4 text-purple-500" />
            Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-stone-700">
              Your chakras show a healthy balance. Keep up your spiritual practice!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileChakraLogging;