
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, X, ChevronDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatGPTWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat is opened for the first time
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I\'m your AI learning assistant. How can I help you today?',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = {
      role: 'user' as const,
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Simple mock response for demo purposes
      // In a real app, you would connect to OpenAI API through a backend service
      setTimeout(() => {
        const responses = [
          "That's a great question! Based on your course materials, I'd recommend focusing on these key concepts...",
          "I can help you understand that concept. Let's break it down step by step...",
          "Here are some resources that might help you with this topic...",
          "That's a common challenge many students face. Here's what I suggest...",
          "Based on your question, I think you should review the section on this topic in your course materials."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [
          ...prev, 
          {
            role: 'assistant',
            content: randomResponse,
            timestamp: new Date()
          }
        ]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response if API fails
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          {
            role: 'assistant',
            content: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again later or contact support if this problem persists.",
            timestamp: new Date()
          }
        ]);
        setIsLoading(false);
        
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to AI assistant. Please try again later.',
          variant: 'destructive',
        });
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className={`rounded-full h-14 w-14 shadow-lg ${
            isOpen ? 'bg-gray-700 hover:bg-gray-800' : 'bg-brand-600 hover:bg-brand-700'
          }`}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </Button>
      </div>

      {/* Chat widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full sm:w-96 shadow-xl transition-all duration-300 ease-in-out">
          <Card className="border-gray-200 overflow-hidden">
            <CardHeader className="bg-brand-600 text-white py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" /> AI Learning Assistant
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-brand-500/20 text-white"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto bg-white p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col max-w-[85%] ${
                      message.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-brand-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex max-w-[85%] mr-auto items-start">
                    <div className="p-3 bg-gray-100 text-gray-800 rounded-lg rounded-bl-none flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            
            <CardFooter className="p-2 border-t">
              <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                <Textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="min-h-[60px] max-h-[120px] flex-grow resize-none"
                  disabled={isLoading}
                />
                <Button 
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isLoading}
                  className={`h-14 w-14 rounded-full ${
                    !inputValue.trim() || isLoading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-brand-600 hover:bg-brand-700'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatGPTWidget;
