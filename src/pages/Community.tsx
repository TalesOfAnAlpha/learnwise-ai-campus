
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Heart, Share, BookOpen, Users, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  author: string;
  authorImage: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const mockPosts: Post[] = [
  {
    id: 1,
    author: 'Sarah Johnson',
    authorImage: 'https://i.pravatar.cc/150?u=sarah',
    title: 'How I mastered Python in 3 months',
    content: 'Learning Python was a journey that transformed my career. Here are the resources and practices that helped me succeed...',
    date: '2h ago',
    likes: 24,
    comments: 5,
    isLiked: false
  },
  {
    id: 2,
    author: 'Michael Chen',
    authorImage: 'https://i.pravatar.cc/150?u=michael',
    title: 'Web Development Roadmap for 2025',
    content: 'The landscape of web development continues to evolve. Here\'s what you need to focus on to stay relevant...',
    date: '1d ago',
    likes: 57,
    comments: 12,
    isLiked: true
  },
  {
    id: 3,
    author: 'Emily Rodriguez',
    authorImage: 'https://i.pravatar.cc/150?u=emily',
    title: 'Study Group for Machine Learning Course',
    content: 'I\'m starting a virtual study group for the Advanced Machine Learning course. We\'ll meet twice a week to discuss concepts and work on projects...',
    date: '3d ago',
    likes: 18,
    comments: 32,
    isLiked: false
  },
];

const Community: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [activeTab, setActiveTab] = useState('discussions');

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleSubmitPost = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a post",
        variant: "destructive",
      });
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Empty fields",
        description: "Please provide both a title and content for your post",
        variant: "destructive",
      });
      return;
    }

    const newPostObj: Post = {
      id: posts.length + 1,
      author: user.email || 'Anonymous',
      authorImage: 'https://i.pravatar.cc/150?u=newuser',
      title: newPost.title,
      content: newPost.content,
      date: 'Just now',
      likes: 0,
      comments: 0,
      isLiked: false
    };

    setPosts([newPostObj, ...posts]);
    setNewPost({ title: '', content: '' });
    
    toast({
      title: "Post created",
      description: "Your post has been published successfully",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="mb-8 pb-8 border-b">
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="mt-2 text-gray-600">Connect with other learners, share your knowledge, and grow together</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Community Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>12.5k Members</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                  <span>3.2k Discussions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span>452 Articles</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <span>127 Study Groups</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Join Community</Button>
              </CardFooter>
            </Card>

            <div className="mt-6">
              <h3 className="font-medium mb-3">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">#programming</Button>
                <Button variant="outline" size="sm">#webdev</Button>
                <Button variant="outline" size="sm">#datascience</Button>
                <Button variant="outline" size="sm">#career</Button>
                <Button variant="outline" size="sm">#machinelearning</Button>
                <Button variant="outline" size="sm">#ai</Button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="discussions" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                <TabsTrigger value="studyGroups">Study Groups</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="discussions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create a New Post</CardTitle>
                    <CardDescription>Share your thoughts with the community</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input 
                      placeholder="Post title" 
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    />
                    <Textarea 
                      placeholder="What's on your mind?" 
                      className="min-h-[120px]"
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSubmitPost}>Post</Button>
                  </CardFooter>
                </Card>

                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9 mr-3">
                            <AvatarImage src={post.authorImage} alt={post.author} />
                            <AvatarFallback>{post.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{post.author}</div>
                            <div className="text-xs text-gray-500">{post.date}</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-600">{post.content}</p>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between">
                      <div className="flex space-x-4">
                        <button 
                          className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart className="h-4 w-4" fill={post.isLiked ? "currentColor" : "none"} />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                      </div>
                      <button className="text-gray-500 flex items-center space-x-1">
                        <Share className="h-4 w-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="blogs" className="space-y-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Blog Feature Coming Soon</h3>
                  <p className="text-gray-500 mb-4">We're working on building a great blogging platform for our community.</p>
                  <Button>Get Notified</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="studyGroups" className="space-y-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Study Groups Coming Soon</h3>
                  <p className="text-gray-500 mb-4">Connect with peers and study together.</p>
                  <Button>Get Notified</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="questions" className="space-y-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Q&A Platform Coming Soon</h3>
                  <p className="text-gray-500 mb-4">Ask questions and get answers from the community.</p>
                  <Button>Get Notified</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
