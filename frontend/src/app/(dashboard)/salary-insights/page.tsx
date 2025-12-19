"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, MapPin, Briefcase } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api, SalaryData } from "@/lib/api";

interface ChartData {
  role: string;
  min: number;
  median: number;
  max: number;
}

const fallbackAnnualData: ChartData[] = [
  { role: "Backend Eng", min: 90, median: 140, max: 190 },
  { role: "Frontend Eng", min: 85, median: 130, max: 175 },
  { role: "Data Scientist", min: 100, median: 150, max: 210 },
  { role: "DevOps", min: 95, median: 145, max: 185 },
  { role: "Product Mgr", min: 110, median: 160, max: 220 },
];

const SalaryInsights = () => {
  const [period, setPeriod] = useState<"Annual" | "Monthly">("Annual");
  const [data, setData] = useState<ChartData[]>(fallbackAnnualData);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    medianSalary: 142000,
    medianGrowth: 5.2,
    topLocation: "San Francisco",
    topLocationMedian: 185000,
    topRole: "Staff Engineer",
    topRoleMedian: 210000,
  });

  useEffect(() => {
    const fetchSalaries = async () => {
      setLoading(true);
      try {
        const result = await api.getSalaries({
          period: period.toLowerCase() as "annual" | "monthly",
        });

        if (result.salaries.length > 0) {
          const divisor = period === "Monthly" ? 12 : 1;
          const chartData: ChartData[] = result.salaries.map((s) => ({
            role: s.role,
            min: Math.round((s.min_salary / 1000 / divisor) * 10) / 10,
            median: Math.round((s.median_salary / 1000 / divisor) * 10) / 10,
            max: Math.round((s.max_salary / 1000 / divisor) * 10) / 10,
          }));
          setData(chartData);

          // Update stats
          const allMedians = result.salaries.map((s) => s.median_salary);
          const avgMedian =
            allMedians.reduce((a, b) => a + b, 0) / allMedians.length;

          setStats({
            medianSalary: Math.round(avgMedian),
            medianGrowth: result.growth_yoy || 5.2,
            topLocation: result.top_paying_location || "San Francisco",
            topLocationMedian: result.top_location_salary || 185000,
            topRole: result.top_paying_role || "Staff Engineer",
            topRoleMedian: result.top_role_salary || 210000,
          });
        }
      } catch (error) {
        console.error("Failed to fetch salaries:", error);
        // Keep fallback data
        if (period === "Monthly") {
          setData(
            fallbackAnnualData.map((d) => ({
              role: d.role,
              min: Math.round((d.min / 12) * 10) / 10,
              median: Math.round((d.median / 12) * 10) / 10,
              max: Math.round((d.max / 12) * 10) / 10,
            }))
          );
        } else {
          setData(fallbackAnnualData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, [period]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Insights</h1>
          <p className="text-sm text-gray-500">
            Compensation benchmarks by role and location
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setPeriod("Annual")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              period === "Annual"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Annual
          </button>
          <button
            onClick={() => setPeriod("Monthly")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              period === "Monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Median Salary (All Roles)</p>
              {loading ? (
                <div className="h-8 w-28 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <h3 className="text-2xl font-bold text-gray-900">
                  ${stats.medianSalary.toLocaleString()}
                </h3>
              )}
            </div>
          </div>
          <div className="text-sm text-green-600 font-medium">
            +{stats.medianGrowth}% vs last year
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Top Paying Location</p>
              {loading ? (
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.topLocation}
                </h3>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Median: ${stats.topLocationMedian.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Top Paying Role</p>
              {loading ? (
                <div className="h-8 w-28 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.topRole}
                </h3>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Median: ${stats.topRoleMedian.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 h-[400px]">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Salary Ranges by Role ({period === "Annual" ? "k USD" : "k USD / 12"})
        </h3>
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="role"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [`$${value}k`, ""]}
              />
              <Legend />
              <Bar dataKey="min" stackId="a" fill="transparent" />
              <Bar
                dataKey="median"
                stackId="a"
                fill="#818cf8"
                name="Median Range"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalaryInsights;
