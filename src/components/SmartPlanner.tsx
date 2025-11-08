import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Utensils, Pill, Activity, RefreshCw, ExternalLink } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const SmartPlanner = () => {
  const { setCurrentView } = useAppContext();

  const planItems = [
    { type: 'yoga', time: '7:00 AM', activity: 'Root Chakra Flow', icon: Activity },
    { type: 'crystal', time: '8:00 AM', activity: 'Red Jasper Meditation', icon: Activity },
    { type: 'meal', time: '12:00 PM', activity: 'Grounding Beet Salad', icon: Utensils },
    { type: 'supplement', time: '2:00 PM', activity: 'Ashwagandha', icon: Pill }
  ];

  const handleViewPlan = () => {
    setCurrentView('view-plan');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-black stroke-2" />
            Smart Planner
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-black hover:bg-black/80 text-white border-black">
              <RefreshCw className="h-4 w-4 mr-1" />
              Sync
            </Button>
            <Button variant="outline" size="sm" className="bg-black hover:bg-black/80 text-white border-black">
              <ExternalLink className="h-4 w-4 mr-1" />
              Google
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="space-y-4">
            {planItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <IconComponent className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="font-medium">{item.activity}</p>
                  </div>
                  <Badge variant="outline">{item.type}</Badge>
                </div>
              );
            })}
            <Button 
              className="w-full bg-black hover:bg-black/80 text-white mt-4"
              onClick={handleViewPlan}
            >
              View Plan
            </Button>
          </TabsContent>
          <TabsContent value="week">
            <p className="text-center text-muted-foreground py-8">Weekly plan coming soon...</p>
          </TabsContent>
          <TabsContent value="schedule">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Sync with your calendar apps:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full bg-black hover:bg-black/80 text-white border-black">
                  Google Calendar
                </Button>
                <Button variant="outline" className="w-full bg-black hover:bg-black/80 text-white border-black">
                  Apple Calendar
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartPlanner;