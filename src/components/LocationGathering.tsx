import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Users, Plus } from 'lucide-react';

const LocationGathering = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const locations = [
    {
      id: 1,
      name: 'Crystal Garden Spa',
      type: 'Crystal Shop',
      distance: '0.5 miles',
      rating: 4.8,
      nextEvent: 'Sound Bath - Today 7PM',
      attendees: 12
    },
    {
      id: 2,
      name: 'Zen Wellness Center',
      type: 'Wellness Center',
      distance: '1.2 miles',
      rating: 4.6,
      nextEvent: 'Chakra Alignment - Tomorrow 6PM',
      attendees: 8
    },
    {
      id: 3,
      name: 'Sacred Stones Gallery',
      type: 'Crystal Shop',
      distance: '2.1 miles',
      rating: 4.9,
      nextEvent: 'Crystal Workshop - Sat 2PM',
      attendees: 15
    }
  ];

  const eventTypes = {
    'Crystal Shop': '#065f46',
    'Wellness Center': '#a855f7',
    'Sound Bath': '#1e40af',
    'Yoga Studio': '#ca8a04'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Nearby Gathering Spots
            </CardTitle>
            <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Location
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="space-y-3 p-4 border rounded-lg mb-4">
              <Input placeholder="Location name..." />
              <Input placeholder="Address..." />
              <Input placeholder="Event type..." />
              <div className="flex gap-2">
                <Button size="sm">Add Location</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {locations.map((location) => (
              <div key={location.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{location.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {location.distance}
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {location.rating}
                    </div>
                  </div>
                  <Badge style={{ backgroundColor: eventTypes[location.type], color: 'white' }}>
                    {location.type}
                  </Badge>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3 w-3" />
                    {location.nextEvent}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Users className="h-3 w-3" />
                    {location.attendees} attending
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm">Join Event</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationGathering;