
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Upload, Eye, BookOpen } from 'lucide-react';
import UserMenu from './UserMenu';
import Logo from './Logo';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar: React.FC = () => {
  const { user, loading } = useAuth();
  const isLoggedIn = !!user;
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="w-full py-4 px-6 md:px-8 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/courses" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">
              Courses
            </Link>
            <Link to="/categories" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">
              Categories
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/course-upload" className="text-gray-600 hover:text-brand-600 font-medium transition-colors flex items-center">
              <Upload className="h-4 w-4 mr-1" />
              Teach
            </Link>
            {isLoggedIn && (
              <Link to="/instructor-dashboard" className="text-gray-600 hover:text-brand-600 font-medium transition-colors flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Instructor Dashboard
              </Link>
            )}
            <Link to="/test-monitoring" className="text-gray-600 hover:text-brand-600 font-medium transition-colors flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              Test Monitoring
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          {!loading && (isLoggedIn ? (
            <UserMenu />
          ) : (
            <div className="flex gap-3">
              <Link to="/auth">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-brand-600 hover:bg-brand-700">Sign up</Button>
              </Link>
            </div>
          ))}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="grid gap-4 py-6">
                <form onSubmit={handleSearchSubmit} className="relative mb-6">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="pl-10 w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                
                <Link to="/courses" className="flex py-2 text-gray-700 hover:text-brand-600">
                  Courses
                </Link>
                <Link to="/categories" className="flex py-2 text-gray-700 hover:text-brand-600">
                  Categories
                </Link>
                <Link to="/about" className="flex py-2 text-gray-700 hover:text-brand-600">
                  About
                </Link>
                <Link to="/course-upload" className="flex py-2 text-gray-700 hover:text-brand-600">
                  <Upload className="h-4 w-4 mr-2" />
                  Teach
                </Link>
                {isLoggedIn && (
                  <Link to="/instructor-dashboard" className="flex py-2 text-gray-700 hover:text-brand-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Instructor Dashboard
                  </Link>
                )}
                <Link to="/test-monitoring" className="flex py-2 text-gray-700 hover:text-brand-600">
                  <Eye className="h-4 w-4 mr-2" />
                  Test Monitoring
                </Link>
                
                {!isLoggedIn && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link to="/auth">
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link to="/auth">
                      <Button className="w-full bg-brand-600 hover:bg-brand-700">Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
