import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Activity,
  TrendingUp,
  DollarSign,
  MapPin,
  FileText,
  Settings, 
  HelpCircle
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

      <nav className="flex-1 px-4 py-4 space-y-1">
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-indigo-600 bg-indigo-50 rounded-xl font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="space-y-1">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
            <Activity size={20} />
            <span>Job Streams</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
            <TrendingUp size={20} />
            <span>Skill Insights</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
            <DollarSign size={20} />
            <span>Salary Insights</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
            <MapPin size={20} />
            <span>Location & Company</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
            <FileText size={20} />
            <span>Reports & Exports</span>
          </Link>
        </div>

        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Account
          </h3>
          <div className="space-y-1">
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
              <HelpCircle size={20} />
              <span>Help Center</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-gray-800 rounded-full mx-auto mb-3 overflow-hidden">
             {/* Avatar placeholder */}
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
          <h4 className="font-bold text-gray-900">Free Trial</h4>
          <p className="text-sm text-gray-500 mb-3">18/30 days</p>
          <button className="w-full bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Unlock Features
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
