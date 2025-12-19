import React from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search for a job"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
          Jobs
          <ChevronDown size={16} />
        </button>
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

        <button className="relative text-gray-500 hover:text-gray-900">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Angelica"
              alt="Angelica"
            />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900">Angelica</p>
            <ChevronDown
              size={16}
              className="text-gray-400 inline-block ml-1"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
