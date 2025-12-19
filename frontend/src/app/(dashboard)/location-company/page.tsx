import React from "react";
import { MapPin, Building2, Users, TrendingUp } from "lucide-react";

const LocationCompany = () => {
  const locations = [
    {
      id: 1,
      city: "San Francisco",
      country: "USA",
      jobs: 1250,
      growth: "+12%",
      salary: "$165k",
    },
    {
      id: 2,
      city: "New York",
      country: "USA",
      jobs: 980,
      growth: "+8%",
      salary: "$150k",
    },
    {
      id: 3,
      city: "London",
      country: "UK",
      jobs: 850,
      growth: "+15%",
      salary: "$110k",
    },
    {
      id: 4,
      city: "Berlin",
      country: "Germany",
      jobs: 620,
      growth: "+5%",
      salary: "$95k",
    },
    {
      id: 5,
      city: "Remote",
      country: "Global",
      jobs: 3400,
      growth: "+22%",
      salary: "$135k",
    },
  ];

  const companies = [
    {
      id: 1,
      name: "Google",
      industry: "Tech",
      openRoles: 45,
      velocity: "High",
      topSkill: "Python",
    },
    {
      id: 2,
      name: "Amazon",
      industry: "E-commerce",
      openRoles: 120,
      velocity: "Very High",
      topSkill: "Java",
    },
    {
      id: 3,
      name: "Microsoft",
      industry: "Tech",
      openRoles: 85,
      velocity: "High",
      topSkill: "C#",
    },
    {
      id: 4,
      name: "Spotify",
      industry: "Media",
      openRoles: 12,
      velocity: "Medium",
      topSkill: "Java",
    },
    {
      id: 5,
      name: "Airbnb",
      industry: "Hospitality",
      openRoles: 18,
      velocity: "Medium",
      topSkill: "React",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Location & Company Analysis
        </h1>
        <p className="text-sm text-gray-500">
          Geographic hotspots and hiring velocity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Locations Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <MapPin size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Top Locations</h3>
            </div>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
              View Map
            </button>
          </div>

          <div className="space-y-4">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 font-bold text-xs border border-gray-100">
                    {loc.id}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{loc.city}</h4>
                    <p className="text-xs text-gray-500">{loc.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{loc.jobs} Jobs</div>
                  <div className="text-xs text-green-600 font-medium">
                    {loc.growth}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Companies Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Building2 size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Most Active Companies
              </h3>
            </div>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {companies.map((comp) => (
              <div
                key={comp.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-700 font-bold text-sm border border-gray-100">
                    {comp.name.substring(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{comp.name}</h4>
                    <p className="text-xs text-gray-500">{comp.industry}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {comp.openRoles} Roles
                  </div>
                  <div className="text-xs text-gray-500">
                    Top: {comp.topSkill}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCompany;
