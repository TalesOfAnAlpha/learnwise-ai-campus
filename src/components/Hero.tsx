
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-brand-50 to-blue-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Learn with AI-Enhanced <br className="hidden md:block" />
              <span className="text-brand-600">Smart Courses</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              Discover personalized learning paths, get AI-powered answers to your questions, 
              and master new skills with adaptive courses tailored to your needs.
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                  className="pl-10 h-12 w-full sm:w-80 rounded-md border border-gray-200 bg-white px-3 py-2 text-md ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-12 bg-brand-600 hover:bg-brand-700 text-md px-6">
                Find Courses
              </Button>
            </form>
            
            <div className="mt-8 flex gap-8 text-sm text-gray-500 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>1000+ courses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>AI-powered learning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>Expert instructors</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative z-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                alt="Students learning" 
                className="rounded-lg w-full h-auto"
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-lg p-3 shadow-lg border border-gray-100 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">AI Assistant Ready</p>
                  <p className="text-xs text-gray-500">Get help anytime</p>
                </div>
              </div>
              <div className="absolute -top-5 -right-5 bg-white rounded-lg p-3 shadow-lg border border-gray-100 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Learn Faster</p>
                  <p className="text-xs text-gray-500">Adaptive learning paths</p>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md max-h-64 rounded-full bg-brand-500/20 blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
