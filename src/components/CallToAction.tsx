
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-brand-600 to-brand-800 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Learning?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90">
          Join thousands of students already learning with LearnWise AI. 
          Get access to hundreds of courses and AI-powered learning tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100 px-8">
              Sign Up for Free
            </Button>
          </Link>
          <Link to="/courses">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
              Browse Courses
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/70">
          No credit card required to sign up. Start learning today!
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
