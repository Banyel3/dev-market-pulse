import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Activity,
  TrendingUp,
  DollarSign,
  MapPin,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white h-screen flex flex-col border-r border-gray-100 fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
          D
        </div>
        <span className="text-xl font-bold text-gray-800">DevMarket</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 flex flex-col">
        <div className="mb-6">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-indigo-600 bg-indigo-50 rounded-xl font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="space-y-1">
          <Link href="/job-streams" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
            <Activity size={20} />
            <span>Job Streams</span>
          </Link>
          <Link href="/skill-insights" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
            <TrendingUp size={20} />
            <span>Skill Insights</span>
          </Link>
          <Link href="/salary-insights" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
            <DollarSign size={20} />
            <span>Salary Insights</span>
          </Link>
          <Link href="/location-company" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
            <MapPin size={20} />
            <span>Location & Company</span>
          </Link>
          <Link href="/reports-exports" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
            <FileText size={20} />
            <span>Reports & Exports</span>
          </Link>
        </div>

        <div className="mt-auto mb-8">
          <div className="px-4 py-4 bg-indigo-50 rounded-xl mx-2">
            <h4 className="font-bold text-indigo-900 text-sm mb-2">Weekly Insights</h4>
            <p className="text-xs text-indigo-700 mb-3">Get the latest market trends delivered to your inbox.</p>
            <button className="w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Subscribe Free
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
