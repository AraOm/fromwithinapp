'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, Sparkles } from 'lucide-react';

const tarotDeck = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
  'Judgement', 'The World'
];

export default function TarotAndGrid() {
  const [drawnCards, setDrawnCards] = useState<string[]>([]);
  const [gridImage, setGridImage] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const drawCards = () => {
    const shuffled = [...tarotDeck].sort(() => 0.5 - Math.random());
    setDrawnCards(shuffled.slice(0, 3)); // Draw 3 cards
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setGridImage(file);
  };

  const handleAIInterpretation = async () => {
    setLoading(true);
    const prompt = `
I drew the following tarot cards: ${drawnCards.join(', ')}.
Here are my notes or question: ${notes}.
Give me a spiritual interpretation that combines the energy of the cards and the crystal grid (image not provided).
Offer insight and inspiration.
`;

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setAIResponse(data.message || 'No message returned.');
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>🔮 Tarot + Crystal Grid</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={drawCards}>Draw 3 Tarot Cards</Button>
          {drawnCards.length > 0 && (
            <div className="text-center space-y-2">
              <p className="font-medium">🃏 Cards Drawn:</p>
              {drawnCards.map((card, i) => (
                <p key={i} className="text-lg italic">{card}</p>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <label className="block font-medium">📸 Upload Grid Image</label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            {gridImage && <p className="text-sm text-muted">Selected: {gridImage.name}</p>}
          </div>

          <Textarea
            placeholder="Ask a question, add notes, or describe your grid..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button onClick={handleAIInterpretation} disabled={loading} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? 'Channeling Insight...' : 'Get AI Interpretation'}
          </Button>

          {aiResponse && (
            <div className="mt-4 p-4 bg-muted rounded shadow-sm text-sm whitespace-pre-line">
              ✨ {aiResponse}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

