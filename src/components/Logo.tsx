
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8 bg-gradient-to-r from-brand-500 to-brand-700 rounded flex items-center justify-center">
        <span className="text-white font-bold text-lg">L</span>
        <div className="absolute -right-1 -top-1 h-3 w-3 bg-gradient-to-r from-brand-300 to-brand-500 rounded-full"></div>
      </div>
      <span className="font-bold text-xl text-gray-900">LearnWise</span>
      <span className="text-xs bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 font-medium">AI</span>
    </div>
  );
};

export default Logo;
