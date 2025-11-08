import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Utensils, Pill, Activity, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const ViewPlan = () => {
  const { setCurrentView } = useAppContext();

  const planItems = [
    { 
      type: 'yoga', 
      time: '7:00 AM', 
      activity: 'Root Chakra Flow', 
      icon: Activity, 
      duration: '20 min',
      completed: false,
      description: 'Ground yourself with poses that connect you to earth energy'
    },
    { 
      type: 'crystal', 
      time: '8:00 AM', 
      activity: 'Red Jasper Meditation', 
      icon: Activity, 
      duration: '15 min',
      completed: true,
      description: 'Hold red jasper while focusing on root chakra affirmations'
    },
    { 
      type: 'meal', 
      time: '12:00 PM', 
      activity: 'Grounding Beet Salad', 
      icon: Utensils, 
      duration: '30 min',
      completed: false,
      description: 'Nourish your body with earth-based root vegetables'
    },
    { 
      type: 'supplement', 
      time: '2:00 PM', 
      activity: 'Ashwagandha', 
      icon: Pill, 
      duration: '2 min',
      completed: false,
      description: 'Adaptogenic herb to support stress resilience'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('smart-planner')}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Calendar className="h-5 w-5 text-black stroke-2" />
            Today's Spiritual Plan
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {planItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className={`flex items-start gap-3 p-4 border rounded-lg ${
                item.completed ? 'bg-green-50 border-green-200' : 'bg-white'
              }`}>
                <div className="flex items-center gap-2 mt-1">
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <IconComponent className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-sm text-muted-foreground">{item.time}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{item.duration}</span>
                  </div>
                  <h3 className={`font-medium mb-1 ${
                    item.completed ? 'line-through text-muted-foreground' : ''
                  }`}>{item.activity}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={item.completed ? 'default' : 'outline'}>
                    {item.type}
                  </Badge>
                  {!item.completed && (
                    <Button size="sm" variant="outline">
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewPlan;