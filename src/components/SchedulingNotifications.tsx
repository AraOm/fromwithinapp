import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Bell, Clock, Smartphone } from 'lucide-react';

interface Notification {
  id: string;
  type: 'meditation' | 'chakra' | 'nutrition' | 'energy-check';
  message: string;
  time: string;
  enabled: boolean;
}

const SchedulingNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'meditation',
      message: 'Time for your morning meditation',
      time: '07:00',
      enabled: true
    },
    {
      id: '2',
      type: 'chakra',
      message: 'Root chakra grounding time',
      time: '12:00',
      enabled: true
    },
    {
      id: '3',
      type: 'nutrition',
      message: 'Snack idea: red lentil soup for grounding',
      time: '15:00',
      enabled: false
    },
    {
      id: '4',
      type: 'energy-check',
      message: 'How are your energy levels?',
      time: '18:00',
      enabled: true
    }
  ]);

  const [calendarSync, setCalendarSync] = useState(false);
  const [biometricSync, setBiometricSync] = useState(false);

  const toggleNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meditation': return 'bg-purple-100 text-purple-800';
      case 'chakra': return 'bg-green-100 text-green-800';
      case 'nutrition': return 'bg-orange-100 text-orange-800';
      case 'energy-check': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Smart Scheduling & Notifications
          </CardTitle>
          <CardDescription>
            Stay aligned with personalized reminders
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sync Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Integration Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Label>Calendar Sync</Label>
            </div>
            <Switch 
              checked={calendarSync} 
              onCheckedChange={setCalendarSync}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <Label>Biometric Feedback</Label>
            </div>
            <Switch 
              checked={biometricSync} 
              onCheckedChange={setBiometricSync}
            />
          </div>
          
          {biometricSync && (
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              💡 When enabled, we'll detect energy imbalances and send gentle reminders
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getTypeColor(notification.type)}>
                      {notification.type.replace('-', ' ')}
                    </Badge>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
                <Switch 
                  checked={notification.enabled}
                  onCheckedChange={() => toggleNotification(notification.id)}
                />
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            Add Custom Reminder
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm">
              Morning Routine
            </Button>
            <Button variant="outline" size="sm">
              Evening Wind-down
            </Button>
            <Button variant="outline" size="sm">
              Chakra Alignment
            </Button>
            <Button variant="outline" size="sm">
              Energy Boost
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulingNotifications;