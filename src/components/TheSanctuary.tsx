import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, Heart, MessageCircle, Video, Play, PenTool, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  comments: number;
  type: 'text' | 'photo' | 'video';
}

const TheSanctuary: React.FC = () => {
  const [textPost, setTextPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      content: 'Today I felt such deep gratitude during my morning meditation. The sunrise seemed to speak directly to my soul, reminding me that each day is a gift to be cherished.',
      author: 'SoulSeeker',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
      comments: 3,
      type: 'text'
    },
    {
      id: '2', 
      content: 'Working with rose quartz today has opened my heart chakra in the most beautiful way. I can feel love radiating from within and connecting me to all beings.',
      author: 'CrystalHealer',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 8,
      comments: 5,
      type: 'text'
    }
  ]);
  const { toast } = useToast();

  const handleTextPost = () => {
    if (textPost.trim()) {
      const newPost: Post = {
        id: Date.now().toString(),
        content: textPost,
        author: 'You',
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        type: 'text'
      };
      
      setPosts(prev => [newPost, ...prev]);
      setTextPost('');
      
      toast({
        title: "Post Shared!",
        description: "Your spiritual reflection has been shared with the community."
      });
    }
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-4" style={{fontFamily: 'Canela, serif'}}>
          The Sanctuary
        </h1>
        <p className="text-stone-600" style={{fontFamily: 'Satoshi, sans-serif'}}>
          Share your spiritual moments through photos, videos, and thoughts
        </p>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="text" style={{fontFamily: 'Satoshi, sans-serif'}}>Text</TabsTrigger>
          <TabsTrigger value="photos" style={{fontFamily: 'Satoshi, sans-serif'}}>Photos</TabsTrigger>
          <TabsTrigger value="videos" style={{fontFamily: 'Satoshi, sans-serif'}}>Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50 mb-8">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <PenTool className="h-8 w-8 text-black" />
              </div>
              <CardTitle className="text-stone-800" style={{fontFamily: 'Canela, serif'}}>Share Your Thoughts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What spiritual insights are you experiencing today?"
                value={textPost}
                onChange={(e) => setTextPost(e.target.value)}
                className="min-h-32 resize-none"
                style={{fontFamily: 'Satoshi, sans-serif'}}
              />
              <Button 
                onClick={handleTextPost}
                disabled={!textPost.trim()}
                className="w-full bg-black hover:bg-gray-800 text-white disabled:opacity-50" 
                style={{fontFamily: 'Satoshi, sans-serif'}}
              >
                <Send className="h-4 w-4 mr-2" />
                Share Post
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50">
            <CardHeader>
              <CardTitle className="text-stone-800" style={{fontFamily: 'Canela, serif'}}>Community Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-sm">
                            {post.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-stone-800" style={{fontFamily: 'Satoshi, sans-serif'}}>
                            {post.author}
                          </p>
                          <p className="text-xs text-stone-500">
                            {formatTimeAgo(post.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-stone-700 mb-4 leading-relaxed" style={{fontFamily: 'Satoshi, sans-serif'}}>
                      {post.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-stone-500">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="p-0 h-auto hover:text-red-500 transition-colors"
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes}
                      </Button>
                      <Button size="sm" variant="ghost" className="p-0 h-auto hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
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
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Video className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-stone-800" style={{fontFamily: 'Canela, serif'}}>Record Video</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-black hover:bg-gray-800 text-white" style={{fontFamily: 'Satoshi, sans-serif'}}>
                  Start Recording
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Upload className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-stone-800" style={{fontFamily: 'Canela, serif'}}>Upload Video</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-black hover:bg-gray-800 text-white" style={{fontFamily: 'Satoshi, sans-serif'}}>
                  Choose from Library
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-stone-200/50">
            <CardHeader>
              <CardTitle className="text-stone-800" style={{fontFamily: 'Canela, serif'}}>Recent Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video bg-stone-100 rounded-lg flex items-center justify-center relative group">
                    <Play className="h-12 w-12 text-stone-400" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TheSanctuary;