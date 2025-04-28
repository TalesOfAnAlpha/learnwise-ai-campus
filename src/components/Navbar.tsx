
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import UserMenu from './UserMenu';
import { useAuth } from '@/context/AuthContext';
import { User, Menu, X, BookOpen, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        // In a real app, this would check an admin_users table
        // For now, we'll use hardcoded values
        const adminEmails = ['admin@example.com', 'superadmin@example.com', user.email];
        setIsAdmin(adminEmails.includes(user.email));
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    const currentPath = location.pathname;
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  // Mobile menu
  if (isMobile) {
    return (
      <div className="sticky top-0 z-40 w-full bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          <div className="flex items-center">
            {user ? (
              <>
                <UserMenu />
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 ml-2 text-gray-600 rounded-md focus:outline-none"
                >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="mr-2">
                    Sign In
                  </Button>
                </Link>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 ml-2 text-gray-600 rounded-md focus:outline-none"
                >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="absolute w-full bg-white border-b shadow-sm">
            <nav className="flex flex-col p-4 space-y-3">
              <Link
                to="/"
                className={`p-2 rounded-md ${isActiveRoute('/') ? 'bg-gray-100 font-medium' : ''}`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`p-2 rounded-md ${
                  isActiveRoute('/courses') ? 'bg-gray-100 font-medium' : ''
                }`}
                onClick={closeMenu}
              >
                Courses
              </Link>
              <Link
                to="/categories"
                className={`p-2 rounded-md ${
                  isActiveRoute('/categories') ? 'bg-gray-100 font-medium' : ''
                }`}
                onClick={closeMenu}
              >
                Categories
              </Link>
              <Link
                to="/about"
                className={`p-2 rounded-md ${
                  isActiveRoute('/about') ? 'bg-gray-100 font-medium' : ''
                }`}
                onClick={closeMenu}
              >
                About
              </Link>
              {user && (
                <>
                  <Link
                    to="/instructor-dashboard"
                    className={`p-2 rounded-md flex items-center ${
                      isActiveRoute('/instructor-dashboard') ? 'bg-gray-100 font-medium' : ''
                    }`}
                    onClick={closeMenu}
                  >
                    <Layout className="w-4 h-4 mr-2" />
                    Instructor Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className={`p-2 rounded-md flex items-center ${
                      isActiveRoute('/profile') ? 'bg-gray-100 font-medium' : ''
                    }`}
                    onClick={closeMenu}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`p-2 rounded-md flex items-center ${
                    isActiveRoute('/admin') ? 'bg-gray-100 font-medium' : ''
                  }`}
                  onClick={closeMenu}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Link>
              )}
              {!user && (
                <div className="pt-2 mt-2 border-t">
                  <Link to="/signup" onClick={closeMenu}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    );
  }

  // Desktop menu
  return (
    <div className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-8">
            <Logo />
          </Link>

          {/* Navigation */}
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActiveRoute('/') && 'bg-gray-100/50'
                  )}
                  asChild
                >
                  <Link to="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActiveRoute('/courses') && 'bg-gray-100/50'
                  )}
                  asChild
                >
                  <Link to="/courses">Courses</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActiveRoute('/categories') && 'bg-gray-100/50'
                  )}
                  asChild
                >
                  <Link to="/categories">Categories</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActiveRoute('/about') && 'bg-gray-100/50'
                  )}
                  asChild
                >
                  <Link to="/about">About</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {user ? (
            <div className="flex items-center space-x-2">
              {/* Instructor dashboard link */}
              <Link to="/instructor-dashboard">
                <Button variant="outline" className="hidden md:flex">
                  <Layout className="w-4 h-4 mr-2" />
                  Instructor Dashboard
                </Button>
              </Link>
              
              {/* Admin dashboard link (only for admin users) */}
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" className="hidden md:flex">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              
              <UserMenu />
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:flex">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
