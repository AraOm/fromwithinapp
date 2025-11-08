import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Heart, MessageCircle } from 'lucide-react';

const PhotoSanctuary: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-4" style={{fontFamily: 'Canela, serif'}}>
          Photo Sanctuary
        </h1>
        <p className="text-stone-600" style={{fontFamily: 'Satoshi, sans-serif'}}>
          Share your spiritual moments through photography
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Camera className="h-8 w-8 text-black" />
            </div>
            <CardTitle className="text-stone-800" style={{fontFamily: 'Canela, serif'}}>Take Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-black hover:bg-gray-800 text-white" style={{fontFamily: 'Satoshi, sans-serif'}}>
              Open Camera
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Upload className="h-8 w-8 text-black" />
            </div>
            <CardTitle className="text-stone-800" style={{fontFamily: 'Canela, serif'}}>Upload Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-black hover:bg-gray-800 text-white" style={{fontFamily: 'Satoshi, sans-serif'}}>
              Choose from Gallery
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50">
        <CardHeader>
          <CardTitle className="text-stone-800" style={{fontFamily: 'Canela, serif'}}>Recent Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-stone-100 rounded-lg flex items-center justify-center relative group">
                <Camera className="h-8 w-8 text-stone-400" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoSanctuary;