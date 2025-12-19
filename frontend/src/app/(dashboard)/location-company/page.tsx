"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Building2, Users, TrendingUp } from "lucide-react";
import { api, LocationItem, CompanyItem } from "@/lib/api";

interface LocationDisplay {
  id: number;
  city: string;
  country: string;
  jobs: number;
  growth: string;
  salary: string;
}

interface CompanyDisplay {
  id: number;
  name: string;
  industry: string;
  openRoles: number;
  velocity: string;
  topSkill: string;
}

const fallbackLocations: LocationDisplay[] = [
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

const fallbackCompanies: CompanyDisplay[] = [
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
  {
    id: 6,
    name: "Netflix",
    industry: "Media",
    openRoles: 25,
    velocity: "High",
    topSkill: "Java",
  },
  {
    id: 7,
    name: "Meta",
    industry: "Tech",
    openRoles: 60,
    velocity: "High",
    topSkill: "React",
  },
  {
    id: 8,
    name: "Uber",
    industry: "Transport",
    openRoles: 30,
    velocity: "Medium",
    topSkill: "Go",
  },
];

const getVelocityLabel = (jobs: number): string => {
  if (jobs > 80) return "Very High";
  if (jobs > 40) return "High";
  if (jobs > 15) return "Medium";
  return "Low";
};

const LocationCompany = () => {
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [locations, setLocations] =
    useState<LocationDisplay[]>(fallbackLocations);
  const [companies, setCompanies] =
    useState<CompanyDisplay[]>(fallbackCompanies);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [locRes, compRes] = await Promise.all([
          api.getLocations({ limit: 10 }),
          api.getCompanies({ limit: 10 }),
        ]);

        if (locRes.locations.length > 0) {
          const mappedLocs: LocationDisplay[] = locRes.locations.map(
            (l, idx) => ({
              id: idx + 1,
              city: l.city,
              country: l.country,
              jobs: l.job_count,
              growth: `+${Math.round(l.growth_rate)}%`,
              salary: `$${Math.round(l.avg_salary / 1000)}k`,
            })
          );
          setLocations(mappedLocs);
        }

        if (compRes.companies.length > 0) {
          const mappedComps: CompanyDisplay[] = compRes.companies.map(
            (c, idx) => ({
              id: idx + 1,
              name: c.name,
              industry: c.industry,
              openRoles: c.active_jobs,
              velocity: getVelocityLabel(c.active_jobs),
              topSkill: c.top_skill || "Various",
            })
          );
          setCompanies(mappedComps);
        }
      } catch (error) {
        console.error("Failed to fetch location/company data:", error);
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedCompanies = showAllCompanies
    ? companies
    : companies.slice(0, 5);

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
            {loading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 animate-pulse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-100 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </>
            ) : (
              locations.map((loc) => (
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
                    <div className="font-bold text-gray-900">
                      {loc.jobs.toLocaleString()} Jobs
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      {loc.growth}
                    </div>
                  </div>
                </div>
              ))
            )}
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
            <button
              onClick={() => setShowAllCompanies(!showAllCompanies)}
              className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
            >
              {showAllCompanies ? "View Less" : "View All"}
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 animate-pulse"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-100 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </>
            ) : (
              displayedCompanies.map((comp) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCompany;
