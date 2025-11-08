import React, { useState } from 'react';

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  comments: string[];
}

const CommunityFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      content: 'Welcome to our sacred space 💫 Share your wisdom, your art, your truth.',
      imageUrl: '',
      comments: ['Love this!', 'So needed right now.']
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    setPosts([
      {
        id: Date.now(),
        content: newPost,
        comments: []
      },
      ...posts
    ]);
    setNewPost('');
  };

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Community</h2>

      {/* Post input */}
      <div className="space-y-2">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share something with the community..."
          className="w-full rounded-md border p-2"
        />
        <button onClick={handleAddPost} className="bg-orange-600 text-white px-4 py-1 rounded">
          Post
        </button>
      </div>

      {/* Feed */}
      {posts.map(post => (
        <div key={post.id} className="border rounded p-4 space-y-2">
          <p>{post.content}</p>

          {/* Comments */}
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-muted-foreground">Comments:</h4>
            {post.comments.map((comment, index) => (
              <p key={index} className="text-sm text-muted-foreground">– {comment}</p>
            ))}
          </div>

          {/* Add Comment */}
          <div className="pt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={() => handleAddComment(post.id)}
              className="mt-1 text-xs text-blue-600 underline"
            >
              Comment
            </button>
          </div>
        </div>
      ))}

      {/* Events & Classes */}
      <div className="pt-8">
        <h3 className="text-xl font-semibold">Upcoming Events & Classes</h3>
        <ul className="list-disc list-inside text-muted-foreground mt-2">
          <li>🔮 Full Moon Circle – Aug 18 @ 6PM</li>
          <li>🌿 Crystal Grid Workshop – Aug 22 @ 2PM</li>
          <li>🧘 Breathwork for Release – Aug 25 @ 9AM</li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityFeed;
