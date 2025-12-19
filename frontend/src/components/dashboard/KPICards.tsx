"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  MapPin,
  Code2,
  ChevronRight,
} from "lucide-react";
import { api, KPIData } from "@/lib/api";

const KPICard = ({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  loading,
}: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon size={24} />
      </div>
      <div>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        )}
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
    <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
      <ChevronRight size={16} />
    </button>
  </div>
);

const KPICards = () => {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await api.getKPIs();
        setKpis(data);
      } catch (error) {
        console.error("Failed to fetch KPIs:", error);
        // Use fallback data if API is unavailable
        setKpis({
          jobs_last_24h: 5283,
          jobs_last_7d: 12450,
          unique_companies: 256,
          unique_locations: 15,
          total_skills: 42,
          new_skills_this_week: 3,
          median_salary: 145000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        icon={Briefcase}
        label="Jobs Ingested (24h)"
        value={kpis ? formatNumber(kpis.jobs_last_24h) : "0"}
        color="bg-blue-50 text-blue-600"
        loading={loading}
      />
      <KPICard
        icon={Building2}
        label="Active Companies"
        value={kpis ? formatNumber(kpis.unique_companies) : "0"}
        color="bg-indigo-50 text-indigo-600"
        loading={loading}
      />
      <KPICard
        icon={MapPin}
        label="Active Locations"
        value={kpis ? formatNumber(kpis.unique_locations) : "0"}
        color="bg-purple-50 text-purple-600"
        loading={loading}
      />
      <KPICard
        icon={Code2}
        label="Tracked Skills"
        value={kpis ? formatNumber(kpis.total_skills) : "0"}
        color="bg-pink-50 text-pink-600"
        loading={loading}
      />
    </div>
  );
};

export default KPICards;
