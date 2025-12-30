"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  TrendingUp,
  DollarSign,
  MapPin,
  Loader2,
} from "lucide-react";
import { api, ExportItem } from "@/lib/api";

const ReportsExports = () => {
  const [showAllExports, setShowAllExports] = useState(false);
  const [exports, setExports] = useState<ExportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const templates = [
    {
      title: "Weekly Skill Trends",
      desc: "Top growing and declining skills with week-over-week analysis.",
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
      action: "skills",
    },
    {
      title: "Salary Benchmarks",
      desc: "Comprehensive salary data by role, location, and experience level.",
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
      action: "salaries",
    },
    {
      title: "Location Analysis",
      desc: "Job volume and salary heatmaps across major tech hubs.",
      icon: MapPin,
      color: "bg-purple-50 text-purple-600",
      action: "locations",
    },
  ];

  useEffect(() => {
    const fetchExports = async () => {
      setLoading(true);
      try {
        const result = await api.getExportSummary();
        setExports(result.exports);
      } catch (error) {
        console.error("Failed to fetch exports:", error);
        // Fallback to empty exports
        setExports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExports();
  }, []);

  const handleDownload = async (exportItem: ExportItem) => {
    setDownloading(exportItem.id);
    try {
      const response = await fetch(
        `http://localhost:8000${exportItem.endpoint}`
      );
      const data = await response.json();

      // Create downloadable file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportItem.id}_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(null);
    }
  };

  const handleGenerateReport = async (action: string) => {
    try {
      let data;
      let filename;

      switch (action) {
        case "skills":
          data = await api.exportSkills();
          filename = "skills_report";
          break;
        case "salaries":
          data = await api.getSalaries({});
          filename = "salary_report";
          break;
        case "locations":
          data = await api.getLocations({ limit: 100 });
          filename = "locations_report";
          break;
        default:
          return;
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Report generation failed:", error);
    }
  };

  const displayedExports = showAllExports ? exports : exports.slice(0, 4);

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
              <button
                onClick={() => handleGenerateReport(template.action)}
                className="w-full py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} />
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
          <button
            onClick={() => setShowAllExports(!showAllExports)}
            className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
          >
            {showAllExports ? "View Less" : "View All History"}
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
              {displayedExports.map((item) => (
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
                      <button
                        onClick={() => handleDownload(item)}
                        disabled={downloading === item.id}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-end gap-1 ml-auto disabled:opacity-50"
                      >
                        {downloading === item.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                        {downloading === item.id
                          ? "Downloading..."
                          : "Download"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {displayedExports.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No exports available yet. Generate a report to get started.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <Loader2
                      size={24}
                      className="animate-spin mx-auto text-indigo-600"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ReportsExports;
