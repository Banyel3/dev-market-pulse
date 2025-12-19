import React from 'react';
import { Search, Bell, ChevronDown, LogIn } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for a job, skill, or company..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          <img 
            src="https://flagcdn.com/w20/us.png" 
            alt="US" 
            className="w-5 h-auto rounded-sm"
          />
          Eng (US)
          <ChevronDown size={16} />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Log In
          </Link>
          <Link href="#" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
