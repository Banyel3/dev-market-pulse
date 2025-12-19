"use client";

import React from "react";
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

const salaryData = [
  { role: "Backend Eng", min: 90, median: 140, max: 190 },
  { role: "Frontend Eng", min: 85, median: 130, max: 175 },
  { role: "Data Scientist", min: 100, median: 150, max: 210 },
  { role: "DevOps", min: 95, median: 145, max: 185 },
  { role: "Product Mgr", min: 110, median: 160, max: 220 },
];

const SalaryInsights = () => {
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
          <button className="px-4 py-1.5 bg-white text-gray-900 shadow-sm rounded-lg text-sm font-medium">
            Annual
          </button>
          <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900 rounded-lg text-sm font-medium">
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
              <h3 className="text-2xl font-bold text-gray-900">$142,000</h3>
            </div>
          </div>
          <div className="text-sm text-green-600 font-medium">
            +5.2% vs last year
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Top Paying Location</p>
              <h3 className="text-2xl font-bold text-gray-900">
                San Francisco
              </h3>
            </div>
          </div>
          <div className="text-sm text-gray-500">Median: $185,000</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Top Paying Role</p>
              <h3 className="text-2xl font-bold text-gray-900">
                Staff Engineer
              </h3>
            </div>
          </div>
          <div className="text-sm text-gray-500">Median: $210,000</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 h-[400px]">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Salary Ranges by Role (k USD)
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={salaryData}
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
      </div>
    </div>
  );
};

export default SalaryInsights;
