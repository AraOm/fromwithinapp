import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gem, Leaf, Flower, Music } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'crystal' | 'yoga' | 'meditation' | 'food';
  title: string;
  description: string;
  category: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onApply?: (id: string) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'crystal': return <Gem className="h-5 w-5" />;
    case 'yoga': return <Flower className="h-5 w-5" />;
    case 'meditation': return <Music className="h-5 w-5" />;
    case 'food': return <Leaf className="h-5 w-5" />;
    default: return <Gem className="h-5 w-5" />;
  }
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  onApply 
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon(recommendation.type)}
            <CardTitle className="text-lg">{recommendation.title}</CardTitle>
          </div>
          <Badge variant="secondary">{recommendation.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">
          {recommendation.description}
        </CardDescription>
        {onApply && (
          <Button 
            onClick={() => onApply(recommendation.id)}
            className="w-full"
          >
            Apply Recommendation
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;