
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import UserMenu from './UserMenu';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const isLoggedIn = false; // This would be from auth context in a real app

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
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-brand-600 hover:bg-brand-700">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
