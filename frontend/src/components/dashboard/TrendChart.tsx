"use client";

import React from "react";
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

const data = [
  { name: "Mon", jobs: 4000, skills: 2400 },
  { name: "Tue", jobs: 3000, skills: 1398 },
  { name: "Wed", jobs: 2000, skills: 9800 },
  { name: "Thu", jobs: 2780, skills: 3908 },
  { name: "Fri", jobs: 1890, skills: 4800 },
  { name: "Sat", jobs: 2390, skills: 3800 },
  { name: "Sun", jobs: 3490, skills: 4300 },
];

const TrendChart = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Job Market Trends</h3>
          <p className="text-sm text-gray-500">
            Job volume and skill demand over the last 7 days
          </p>
        </div>
        <select className="bg-gray-50 border-none text-sm font-medium text-gray-600 rounded-lg px-3 py-2 outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
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
              dataKey="name"
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
      </div>
    </div>
  );
};

export default TrendChart;
