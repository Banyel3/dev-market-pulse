"use client";

import React from "react";
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

const data = [
  { name: "React", value: 4000 },
  { name: "Python", value: 3500 },
  { name: "Node.js", value: 3000 },
  { name: "TypeScript", value: 2780 },
  { name: "Java", value: 2500 },
  { name: "AWS", value: 2300 },
  { name: "Docker", value: 2000 },
];

const SkillInsights = () => {
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
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Category
              </label>
              <div className="space-y-2">
                {["Languages", "Frameworks", "Tools", "Cloud", "Databases"].map(
                  (cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      {cat}
                    </label>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Time Range
              </label>
              <select className="w-full bg-gray-50 border-none text-sm text-gray-600 rounded-lg px-3 py-2 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Last Year</option>
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
              <h3 className="text-xl font-bold text-gray-900">Rust</h3>
              <span className="text-sm font-bold text-green-500 flex items-center">
                +24% <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Most Declined</p>
            <div className="flex items-end justify-between">
              <h3 className="text-xl font-bold text-gray-900">jQuery</h3>
              <span className="text-sm font-bold text-red-500 flex items-center">
                -12% <ArrowDownRight size={16} />
              </span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">New Skills Found</p>
            <div className="flex items-end justify-between">
              <h3 className="text-xl font-bold text-gray-900">12</h3>
              <span className="text-sm text-gray-400">This week</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex-1 min-h-[400px]">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Most In-Demand Skills
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={data}
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
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index < 3 ? "#4f46e5" : "#e0e7ff"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SkillInsights;
