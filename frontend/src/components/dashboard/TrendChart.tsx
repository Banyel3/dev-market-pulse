"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { api, TrendData, TrendDataPoint } from "@/lib/api";

// Fallback data
const fallbackData7Days = [
  { date: "Mon", jobs: 4000, skills: 2400 },
  { date: "Tue", jobs: 3000, skills: 1398 },
  { date: "Wed", jobs: 2000, skills: 9800 },
  { date: "Thu", jobs: 2780, skills: 3908 },
  { date: "Fri", jobs: 1890, skills: 4800 },
  { date: "Sat", jobs: 2390, skills: 3800 },
  { date: "Sun", jobs: 3490, skills: 4300 },
];

const TrendChart = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [data, setData] = useState<TrendDataPoint[]>(fallbackData7Days);
  const [loading, setLoading] = useState(true);

  const timeRangeLabels: Record<string, string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 3 Months",
  };

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const result = await api.getTrends(timeRange);
        if (result.data.length > 0) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch trends:", error);
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [timeRange]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Job Market Trends</h3>
          <p className="text-sm text-gray-500">
            Job volume and skill demand over the{" "}
            {timeRangeLabels[timeRange]?.toLowerCase()}
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-50 border-none text-sm font-medium text-gray-600 rounded-lg px-3 py-2 outline-none"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 3 Months</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <CartesianGrid vertical={false} stroke="#f3f4f6" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="jobs"
                stroke="#4f46e5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorJobs)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TrendChart;
