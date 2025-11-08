import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Camera, Heart, MessageCircle, Share2, MapPin } from 'lucide-react';
import ChakraLotusIcon from '@/components/ChakraLotusIcon';

const PhotoEnergyShare = () => {
  const [newPost, setNewPost] = useState({ photo: '', description: '', energy: '' });
  
  const posts = [
    {
      id: 1,
      user: 'Sarah M.',
      avatar: 'SM',
      photo: '/placeholder.svg',
      description: 'Heart felt open today after rose quartz session.',
      energy: 'Heart Chakra',
      likes: 12,
      comments: 3,
      location: 'Crystal Garden Spa'
    },
    {
      id: 2,
      user: 'Alex K.',
      avatar: 'AK',
      photo: '/placeholder.svg',
      description: 'Amazing throat chakra healing with blue lace agate.',
      energy: 'Throat Chakra',
      likes: 8,
      comments: 2,
      location: 'Wellness Center'
    }
  ];

  const chakraColors = {
    'Root Chakra': '#991b1b',
    'Sacral Chakra': '#ea580c',
    'Solar Plexus': '#ca8a04',
    'Heart Chakra': '#065f46',
    'Throat Chakra': '#1e40af',
    'Third Eye': '#a855f7',
    'Crown Chakra': '#6b46c1'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Share Your Energy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Add photo URL..." value={newPost.photo} onChange={(e) => setNewPost({...newPost, photo: e.target.value})} />
          <Textarea placeholder="Describe your energy experience..." value={newPost.description} onChange={(e) => setNewPost({...newPost, description: e.target.value})} />
          <Input placeholder="Which chakra/energy?" value={newPost.energy} onChange={(e) => setNewPost({...newPost, energy: e.target.value})} />
          <Button className="w-full">Share Experience</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>{post.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.user}</span>
                    <Badge variant="outline" style={{ color: chakraColors[post.energy] }}>
                      {post.energy}
                    </Badge>
                  </div>
                  <img src={post.photo} alt="Energy share" className="w-full h-48 object-cover rounded-lg" />
                  <p className="text-sm">{post.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {post.location}
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PhotoEnergyShare;