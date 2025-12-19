import React from "react";
import {
  FileText,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

const ReportsExports = () => {
  const templates = [
    {
      title: "Weekly Skill Trends",
      desc: "Top growing and declining skills with week-over-week analysis.",
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Salary Benchmarks",
      desc: "Comprehensive salary data by role, location, and experience level.",
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Location Analysis",
      desc: "Job volume and salary heatmaps across major tech hubs.",
      icon: MapPin,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const exports = [
    {
      id: "EXP-2023-001",
      name: "Full Job Dump - Oct 2023",
      type: "CSV",
      date: "Oct 24, 2023",
      size: "45 MB",
      status: "ready",
    },
    {
      id: "EXP-2023-002",
      name: "Salary Report - Q3",
      type: "PDF",
      date: "Oct 22, 2023",
      size: "2.4 MB",
      status: "ready",
    },
    {
      id: "EXP-2023-003",
      name: "Skill Trends - Raw Data",
      type: "Excel",
      date: "Oct 20, 2023",
      size: "12 MB",
      status: "failed",
    },
    {
      id: "EXP-2023-004",
      name: "Company List - EMEA",
      type: "CSV",
      date: "Oct 18, 2023",
      size: "5.1 MB",
      status: "ready",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reports & Exports
        </h1>
        <p className="text-sm text-gray-500">
          Generate insights and download raw data
        </p>
      </div>

      {/* Templates Section */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Report Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${template.color}`}
              >
                <template.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {template.title}
              </h3>
              <p className="text-sm text-gray-500 mb-6">{template.desc}</p>
              <button className="w-full py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                Generate Report
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Exports Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Exports</h2>
          <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
            View All History
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exports.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                        <FileSpreadsheet size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-400">{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">{item.date}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">{item.size}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {item.status === "ready" ? (
                        <>
                          <CheckCircle size={14} className="text-green-500" />
                          <span className="text-sm text-green-600 capitalize">
                            Ready
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={14} className="text-red-500" />
                          <span className="text-sm text-red-600 capitalize">
                            Failed
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {item.status === "ready" && (
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-end gap-1 ml-auto">
                        <Download size={16} />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

import { TrendingUp, DollarSign, MapPin } from "lucide-react";

export default ReportsExports;
