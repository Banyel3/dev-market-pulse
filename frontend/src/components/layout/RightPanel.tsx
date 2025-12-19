import React from 'react';
import { TrendingUp, ArrowRight, Mail } from 'lucide-react';

const RightPanel = () => {
  return (
    <aside className="w-80 bg-white h-screen border-l border-gray-100 fixed right-0 top-0 overflow-y-auto p-6 hidden xl:block">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Market Highlights</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-600" />
              <span className="text-sm font-bold text-green-700">Rising Fast</span>
            </div>
            <h4 className="font-bold text-gray-900">Rust Developers</h4>
            <p className="text-xs text-gray-600 mt-1">Demand up 24% this week in FinTech sector.</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-blue-600" />
              <span className="text-sm font-bold text-blue-700">Top Location</span>
            </div>
            <h4 className="font-bold text-gray-900">Berlin, Germany</h4>
            <p className="text-xs text-gray-600 mt-1">Highest volume of new startup roles posted.</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Newsletter</h3>
        <div className="bg-gray-900 rounded-2xl p-6 text-white">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4">
            <Mail size={20} />
          </div>
          <h4 className="font-bold text-lg mb-2">Stay Ahead</h4>
          <p className="text-sm text-gray-400 mb-4">
            Get weekly insights on skills, salaries, and hiring trends.
          </p>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="w-full py-2 bg-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Trending Skills</h3>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View All</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {['React', 'Python', 'AWS', 'Docker', 'Kubernetes', 'Go', 'TypeScript'].map((skill) => (
            <span key={skill} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
