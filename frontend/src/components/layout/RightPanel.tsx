import React from "react";
import { Edit2, Briefcase, GraduationCap, Pencil } from "lucide-react";

const RightPanel = () => {
  return (
    <aside className="w-80 bg-white h-screen border-l border-gray-100 fixed right-0 top-0 overflow-y-auto p-6 hidden xl:block">
      <div className="relative mb-6">
        <div className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-2xl -mx-6 -mt-6 mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        </div>
        <div className="absolute top-12 left-0">
          <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Angelica"
              alt="Profile"
            />
          </div>
        </div>

        <div className="flex justify-between items-start mt-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Angelica Greeze</h2>
            <p className="text-sm text-gray-500">UI / UX Designer</p>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors">
            <Edit2 size={12} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">Availability</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Pencil size={14} />
          </button>
        </div>
        <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          Available For Work
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Experience</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Pencil size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
              <Briefcase size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                UI / UX Designer
              </h4>
              <p className="text-xs text-gray-500">Ideologist Team - Remote</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Jan 2022 - Present • 8 Mos
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
              <Briefcase size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">UI Designer</h4>
              <p className="text-xs text-gray-500">Tigabatang - Fulltime</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Jan 2022 - Present • 8 Mos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Education</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Pencil size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
              <GraduationCap size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                Oxford University
              </h4>
              <p className="text-xs text-gray-500">
                Student - Software Engineering
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                2018 - 2021 • 3 Yrs
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
              <GraduationCap size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                Oxford Vocational High School
              </h4>
              <p className="text-xs text-gray-500">
                Student - Software Engineering
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                2015 - 2015 • 3 Yrs
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Skills</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Pencil size={14} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "UI",
            "Ux",
            "Website Design",
            "Mobile Design",
            "Research",
            "Interaction",
          ].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
