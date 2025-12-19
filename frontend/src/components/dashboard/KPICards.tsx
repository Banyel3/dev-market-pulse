import React from "react";
import {
  Briefcase,
  Building2,
  MapPin,
  Code2,
  ChevronRight,
} from "lucide-react";

const KPICard = ({ icon: Icon, label, value, subtext, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
    <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
      <ChevronRight size={16} />
    </button>
  </div>
);

const KPICards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        icon={Briefcase}
        label="Jobs Ingested (24h)"
        value="5,283"
        color="bg-blue-50 text-blue-600"
      />
      <KPICard
        icon={Building2}
        label="Active Companies"
        value="256"
        color="bg-indigo-50 text-indigo-600"
      />
      <KPICard
        icon={MapPin}
        label="Active Locations"
        value="15"
        color="bg-purple-50 text-purple-600"
      />
      <KPICard
        icon={Code2}
        label="Tracked Skills"
        value="5,283"
        color="bg-pink-50 text-pink-600"
      />
    </div>
  );
};

export default KPICards;
