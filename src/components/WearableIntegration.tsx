import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bluetooth, Check, Loader2, Smartphone, Watch, Headphones, Activity, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WearableDevice {
  id: string;
  name: string;
  type: 'watch' | 'ring' | 'band' | 'headset' | 'sensor' | 'shirt' | 'mat';
  status: 'available' | 'connected' | 'pairing' | 'disconnected' | 'auto-detected';
  batteryLevel?: number;
  lastSync?: Date;
  biometrics?: {
    heartRate?: number;
    hrv?: number;
    stress?: number;
    sleep?: number;
  };
}

const SUPPORTED_DEVICES: WearableDevice[] = [
  { id: 'apple-watch', name: 'Apple Watch', type: 'watch', status: 'available' },
  { id: 'fitbit-sense', name: 'Fitbit Sense 2', type: 'watch', status: 'available' },
  { id: 'garmin-venu', name: 'Garmin Venu/Fenix', type: 'watch', status: 'available' },
  { id: 'oura-ring', name: 'Oura Ring', type: 'ring', status: 'available' },
  { id: 'whoop', name: 'Whoop 4.0', type: 'band', status: 'available' },
  { id: 'apollo-neuro', name: 'Apollo Neuro', type: 'band', status: 'available' },
  { id: 'muse-s', name: 'Muse S', type: 'headset', status: 'available' },
  { id: 'dreem-2', name: 'Dreem 2', type: 'headset', status: 'available' },
  { id: 'healy', name: 'Healy', type: 'sensor', status: 'available' },
  { id: 'flow-headset', name: 'Flow Headset', type: 'headset', status: 'available' },
  { id: 'withings-sleep', name: 'Withings Sleep Mat', type: 'mat', status: 'available' },
  { id: 'empatica-e4', name: 'Empatica E4', type: 'band', status: 'available' },
  { id: 'biostrap-evo', name: 'Biostrap EVO', type: 'band', status: 'available' },
  { id: 'openbci', name: 'OpenBCI', type: 'headset', status: 'available' },
  { id: 'neurosky', name: 'NeuroSky', type: 'headset', status: 'available' },
  { id: 'hexoskin', name: 'Hexoskin Shirt', type: 'shirt', status: 'available' },
  { id: 'circular-ring', name: 'Circular Ring', type: 'ring', status: 'available' },
  { id: 'movano-evie', name: 'Movano Evie Ring', type: 'ring', status: 'available' }
];

const WearableIntegration: React.FC = () => {
  const [devices, setDevices] = useState<WearableDevice[]>(SUPPORTED_DEVICES);
  const [isScanning, setIsScanning] = useState(false);
  const [autoDetecting, setAutoDetecting] = useState(true);
  const { toast } = useToast();

  // Auto-detect devices on component mount
  useEffect(() => {
    const autoDetectDevices = async () => {
      setAutoDetecting(true);
      
      // Simulate auto-detection process
      setTimeout(() => {
        const detectedDevices = ['apple-watch', 'oura-ring', 'whoop'];
        const randomDetected = detectedDevices[Math.floor(Math.random() * detectedDevices.length)];
        
        setDevices(prev => prev.map(device => 
          device.id === randomDetected
            ? { 
                ...device, 
                status: 'auto-detected',
                batteryLevel: Math.floor(Math.random() * 40) + 60,
                lastSync: new Date(),
                biometrics: {
                  heartRate: Math.floor(Math.random() * 40) + 60,
                  hrv: Math.floor(Math.random() * 50) + 30,
                  stress: Math.floor(Math.random() * 100),
                  sleep: Math.floor(Math.random() * 40) + 60
                }
              }
            : device
        ));
        
        toast({
          title: "Device Auto-Detected!",
          description: `Found ${SUPPORTED_DEVICES.find(d => d.id === randomDetected)?.name}. Tap to connect.`,
        });
        
        setAutoDetecting(false);
      }, 2000);
    };

    autoDetectDevices();
  }, [toast]);

  const handlePairDevice = async (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: 'pairing' }
        : device
    ));

    // Simulate pairing process
    setTimeout(() => {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              status: 'connected', 
              batteryLevel: Math.floor(Math.random() * 40) + 60,
              lastSync: new Date(),
              biometrics: {
                heartRate: Math.floor(Math.random() * 40) + 60,
                hrv: Math.floor(Math.random() * 50) + 30,
                stress: Math.floor(Math.random() * 100),
                sleep: Math.floor(Math.random() * 40) + 60
              }
            }
          : device
      ));
      
      toast({
        title: "Device Connected!",
        description: `${SUPPORTED_DEVICES.find(d => d.id === deviceId)?.name} is now syncing your biometric data.`,
      });
    }, 2000);
  };

  const handleScanDevices = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: "Found all available devices in range.",
      });
    }, 3000);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'watch': return <Watch className="h-5 w-5" />;
      case 'ring': return <div className="h-5 w-5 rounded-full border-2 border-current" />;
      case 'headset': return <Headphones className="h-5 w-5" />;
      case 'sensor': return <Zap className="h-5 w-5" />;
      case 'shirt': return <Activity className="h-5 w-5" />;
      case 'mat': return <div className="h-5 w-5 border-2 border-current rounded" />;
      default: return <Smartphone className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'pairing': return 'bg-yellow-500';
      case 'auto-detected': return 'bg-blue-500 animate-pulse';
      case 'available': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const connectedDevices = devices.filter(d => d.status === 'connected');
  const autoDetectedDevices = devices.filter(d => d.status === 'auto-detected');

  return (
    <div className="space-y-6">
      {autoDetecting && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <p className="text-blue-800">Auto-detecting nearby wearable devices...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {autoDetectedDevices.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Devices Found Nearby</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {autoDetectedDevices.map(device => (
              <div key={device.id} className="flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{device.name}</p>
                    <p className="text-xs text-blue-600">Ready to connect</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handlePairDevice(device.id)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Connect
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5" />
            Wearable Devices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-stone-600">
              {connectedDevices.length} connected • {devices.length} supported devices
            </p>
            <Button 
              onClick={handleScanDevices}
              disabled={isScanning}
              size="sm"
              variant="outline"
            >
              {isScanning ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Bluetooth className="h-4 w-4 mr-2" />
              )}
              {isScanning ? 'Scanning...' : 'Scan'}
            </Button>
          </div>

          <div className="grid gap-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-stone-600">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{device.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(device.status)} text-white`}
                      >
                        {device.status === 'auto-detected' ? 'detected' : device.status}
                      </Badge>
                      {device.batteryLevel && (
                        <span className="text-xs text-stone-500">
                          {device.batteryLevel}% battery
                        </span>
                      )}
                      {device.lastSync && (
                        <span className="text-xs text-stone-500">
                          synced {device.lastSync.toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    {device.biometrics && device.status === 'connected' && (
                      <div className="flex gap-3 mt-2 text-xs text-stone-600">
                        <span>HR: {device.biometrics.heartRate}bpm</span>
                        <span>HRV: {device.biometrics.hrv}ms</span>
                        <span>Stress: {device.biometrics.stress}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  {device.status === 'connected' ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : device.status === 'pairing' ? (
                    <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
                  ) : device.status === 'auto-detected' ? (
                    <Button 
                      onClick={() => handlePairDevice(device.id)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Connect
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handlePairDevice(device.id)}
                      size="sm"
                      variant="outline"
                    >
                      Pair
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WearableIntegration;