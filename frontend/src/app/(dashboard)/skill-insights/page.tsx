"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { api, SkillItem } from "@/lib/api";

interface ChartSkill {
  name: string;
  value: number;
  category: string;
  growth_rate: number;
}

const fallbackData: ChartSkill[] = [
  { name: "React", value: 4000, category: "Frameworks", growth_rate: 8 },
  { name: "Python", value: 3500, category: "Languages", growth_rate: 12 },
  { name: "Node.js", value: 3000, category: "Frameworks", growth_rate: 6 },
  { name: "TypeScript", value: 2780, category: "Languages", growth_rate: 18 },
  { name: "Java", value: 2500, category: "Languages", growth_rate: 3 },
  { name: "AWS", value: 2300, category: "Cloud", growth_rate: 15 },
  { name: "Docker", value: 2000, category: "Tools", growth_rate: 10 },
  { name: "PostgreSQL", value: 1800, category: "Databases", growth_rate: 7 },
  { name: "MongoDB", value: 1500, category: "Databases", growth_rate: 5 },
  { name: "Kubernetes", value: 1200, category: "Cloud", growth_rate: 22 },
  { name: "Go", value: 1100, category: "Languages", growth_rate: 20 },
  { name: "Vue.js", value: 900, category: "Frameworks", growth_rate: 4 },
];

const SkillInsights = () => {
  const [allData, setAllData] = useState<ChartSkill[]>(fallbackData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [topGrowing, setTopGrowing] = useState({ name: "Rust", growth: 24 });
  const [mostDeclined, setMostDeclined] = useState({
    name: "jQuery",
    growth: -12,
  });
  const [newSkillsCount, setNewSkillsCount] = useState(12);

  const categories = [
    { label: "Languages", value: "language" },
    { label: "Frameworks", value: "framework" },
    { label: "Tools", value: "tool" },
    { label: "Cloud", value: "cloud" },
    { label: "Databases", value: "database" },
  ];

  const timeRangeMap: Record<string, string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 3 Months",
    "365d": "Last Year",
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const categoryParam =
          selectedCategories.length > 0
            ? selectedCategories.join(",")
            : undefined;

        const result = await api.getSkills({
          time_range: timeRange,
          category: categoryParam,
          search: searchQuery || undefined,
          limit: 50,
        });

        if (result.skills.length > 0) {
          const chartData: ChartSkill[] = result.skills.map((s) => ({
            name: s.name,
            value: s.demand_count,
            category: s.category,
            growth_rate: s.growth_rate,
          }));
          setAllData(chartData);

          // Find top growing and most declined
          const sorted = [...result.skills].sort(
            (a, b) => b.growth_rate - a.growth_rate
          );
          if (sorted.length > 0) {
            setTopGrowing({
              name: sorted[0].name,
              growth: Math.round(sorted[0].growth_rate),
            });
            const declined = sorted[sorted.length - 1];
            setMostDeclined({
              name: declined.name,
              growth: Math.round(declined.growth_rate),
            });
          }
          setNewSkillsCount(
            result.total > 10 ? Math.floor(result.total / 10) : result.total
          );
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        setAllData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSkills, 300);
    return () => clearTimeout(debounce);
  }, [timeRange, selectedCategories, searchQuery]);

  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(item.category);
      return matchesSearch && matchesCategory;
    });
  }, [allData, searchQuery, selectedCategories]);

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Filters Sidebar */}
      <div className="w-64 flex-shrink-0 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Skill Insights
          </h1>
          <p className="text-sm text-gray-500">Analyze demand by skill</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Category
              </label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.value}
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.value)}
                      onChange={() => toggleCategory(cat.value)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {cat.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full bg-gray-50 border-none text-sm text-gray-600 rounded-lg px-3 py-2 outline-none"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 3 Months</option>
                <option value="365d">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Top Growing Skill</p>
            <div className="flex items-end justify-between">
              {loading ? (
                <div className="h-7 w-20 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900">
                    {topGrowing.name}
                  </h3>
                  <span className="text-sm font-bold text-green-500 flex items-center">
                    +{topGrowing.growth}% <ArrowUpRight size={16} />
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Most Declined</p>
            <div className="flex items-end justify-between">
              {loading ? (
                <div className="h-7 w-20 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900">
                    {mostDeclined.name}
                  </h3>
                  <span
                    className={`text-sm font-bold flex items-center ${
                      mostDeclined.growth < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {mostDeclined.growth > 0 ? "+" : ""}
                    {mostDeclined.growth}%
                    {mostDeclined.growth < 0 ? (
                      <ArrowDownRight size={16} />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">New Skills Found</p>
            <div className="flex items-end justify-between">
              {loading ? (
                <div className="h-7 w-12 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900">
                    {newSkillsCount}
                  </h3>
                  <span className="text-sm text-gray-400">This week</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex-1 min-h-[400px]">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Most In-Demand Skills
          </h3>
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                data={filteredData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f3f4f6"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#4b5563", fontSize: 14, fontWeight: 500 }}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(
                    value: number | undefined,
                    name: string | undefined
                  ) => [(value ?? 0).toLocaleString() + " jobs", "Demand"]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index < 3 ? "#4f46e5" : "#e0e7ff"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillInsights;
