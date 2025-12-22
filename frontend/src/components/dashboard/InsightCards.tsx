"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, DollarSign, MapPin, Building } from "lucide-react";
import { api } from "@/lib/api";

interface InsightItem {
  name: string;
  subtitle: string;
  value: number;
  image?: string;
}

const InsightCard = ({
  title,
  icon: Icon,
  items,
  type,
  loading,
}: {
  title: string;
  icon: React.ElementType;
  items: InsightItem[];
  type: "trend" | "salary" | "count";
  loading: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedItems = isExpanded ? items : items.slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex-1 min-w-[280px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
          <Icon size={20} />
        </div>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-100 rounded w-16"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </>
        ) : (
          displayedItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                </div>
              </div>
              <div className="text-right">
                {type === "trend" && (
                  <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                    +{item.value}%
                  </span>
                )}
                {type === "salary" && (
                  <span className="text-sm font-bold text-gray-900">
                    ${item.value.toLocaleString()}
                  </span>
                )}
                {type === "count" && (
                  <span className="text-sm font-bold text-gray-900">
                    {item.value.toLocaleString()} Open
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-6 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          {isExpanded ? "View Less" : "View All"}
        </button>
      )}
    </div>
  );
};

// Fallback data
const fallbackSkills: InsightItem[] = [
  { name: "Rust", subtitle: "Systems Programming", value: 24 },
  { name: "Go", subtitle: "Backend", value: 18 },
  { name: "TypeScript", subtitle: "Frontend/Backend", value: 12 },
  { name: "Python", subtitle: "Data Science/AI", value: 10 },
  { name: "Svelte", subtitle: "Frontend", value: 8 },
  { name: "Kotlin", subtitle: "Mobile/Backend", value: 7 },
];

const fallbackCompanies: InsightItem[] = [
  {
    name: "PayPal",
    subtitle: "FinTech",
    value: 8,
    image: "https://logo.clearbit.com/paypal.com",
  },
  {
    name: "Shopify",
    subtitle: "E-commerce",
    value: 20,
    image: "https://logo.clearbit.com/shopify.com",
  },
  {
    name: "Google",
    subtitle: "Tech",
    value: 2,
    image: "https://logo.clearbit.com/google.com",
  },
  {
    name: "Microsoft",
    subtitle: "Tech",
    value: 15,
    image: "https://logo.clearbit.com/microsoft.com",
  },
  {
    name: "Amazon",
    subtitle: "E-commerce/Cloud",
    value: 12,
    image: "https://logo.clearbit.com/amazon.com",
  },
];

const fallbackLocations: InsightItem[] = [
  { name: "San Francisco", subtitle: "USA", value: 1200 },
  { name: "London", subtitle: "UK", value: 850 },
  { name: "Berlin", subtitle: "Germany", value: 600 },
  { name: "Remote", subtitle: "Global", value: 5000 },
  { name: "New York", subtitle: "USA", value: 550 },
  { name: "Toronto", subtitle: "Canada", value: 400 },
];

const InsightCards = () => {
  const [skills, setSkills] = useState<InsightItem[]>(fallbackSkills);
  const [companies, setCompanies] = useState<InsightItem[]>(fallbackCompanies);
  const [locations, setLocations] = useState<InsightItem[]>(fallbackLocations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [skillsRes, companiesRes, locationsRes] = await Promise.all([
          api.getSkills({ limit: 10 }),
          api.getCompanies({ limit: 10 }),
          api.getLocations({ limit: 10 }),
        ]);

        if (skillsRes.skills.length > 0) {
          setSkills(
            skillsRes.skills.map((s) => ({
              name: s.name,
              subtitle: s.category,
              value: s.demand_count, // Number of jobs requiring this skill
            }))
          );
        }

        if (companiesRes.companies.length > 0) {
          setCompanies(
            companiesRes.companies.map((c) => ({
              name: c.name,
              subtitle: c.industry,
              value: c.active_jobs,
              image: c.logo_url || undefined,
            }))
          );
        }

        if (locationsRes.locations.length > 0) {
          setLocations(
            locationsRes.locations.map((l) => ({
              name: l.city,
              subtitle: l.country,
              value: l.job_count,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch insight data:", error);
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap gap-6">
      <InsightCard
        title="Hottest Skills"
        icon={TrendingUp}
        items={skills}
        type="trend"
        loading={loading}
      />
      <InsightCard
        title="Most Active Companies"
        icon={Building}
        items={companies}
        type="count"
        loading={loading}
      />
      <InsightCard
        title="Top Hiring Locations"
        icon={MapPin}
        items={locations}
        type="count"
        loading={loading}
      />
    </div>
  );
};

export default InsightCards;
