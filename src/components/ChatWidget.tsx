
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI learning assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const userMessage = { role: 'user' as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    // In a real app, this would call an API endpoint connected to ChatGPT
    // For now, we'll simulate a response
    try {
      // Simulated delay for a more realistic experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock responses based on keywords
      let response = "I'm not sure how to help with that. Could you provide more details?";
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('course') && (lowerMessage.includes('recommend') || lowerMessage.includes('suggest'))) {
        response = "Based on your interests, I'd recommend checking out our 'Data Science and Machine Learning' course. It's highly rated and covers the fundamentals you'll need.";
      } else if (lowerMessage.includes('learn') && lowerMessage.includes('programming')) {
        response = "If you're interested in learning programming, our 'Complete Web Development Bootcamp' is a great place to start. It covers HTML, CSS, JavaScript and more!";
      } else if (lowerMessage.includes('difficulty') || lowerMessage.includes('hard')) {
        response = "Our courses are designed for various skill levels. You can filter by Beginner, Intermediate, or Advanced to find courses that match your experience level.";
      } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        response = "We have courses across different price ranges. You can use the price filter on our courses page to find options that fit your budget. We also regularly offer discounts!";
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = "Hello! I'm your AI learning assistant. How can I help you find the right course today?";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleChat = () => setIsOpen(prev => !prev);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 md:w-96 shadow-xl flex flex-col h-[500px] max-h-[80vh]">
          <CardHeader className="bg-brand-600 text-white py-3 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder.svg" alt="AI" />
                <AvatarFallback className="bg-brand-700 text-white">AI</AvatarFallback>
              </Avatar>
              <span className="font-medium">Course Assistant</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}>
                <div className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  msg.role === "user" ? "bg-brand-600 text-white rounded-tr-none" : "bg-gray-100 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 rounded-tl-none flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </CardContent>
          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me about courses..."
                className="flex-1 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!message.trim() || isLoading}
                className="bg-brand-600 hover:bg-brand-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={toggleChat}
          className="shadow-lg bg-brand-600 hover:bg-brand-700 h-14 w-14 rounded-full"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default ChatWidget;
