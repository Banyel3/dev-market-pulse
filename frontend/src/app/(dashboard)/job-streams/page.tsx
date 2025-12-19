"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { api, JobStream } from "@/lib/api";

interface StreamItem {
  id: number;
  name: string;
  status: "active" | "paused" | "error";
  lastRun: string;
  jobsFetched: number;
  successRate: string;
}

const fallbackStreams: StreamItem[] = [
  {
    id: 1,
    name: "LinkedIn Jobs",
    status: "active",
    lastRun: "10 mins ago",
    jobsFetched: 1240,
    successRate: "98%",
  },
  {
    id: 2,
    name: "Indeed",
    status: "active",
    lastRun: "1 hour ago",
    jobsFetched: 850,
    successRate: "95%",
  },
  {
    id: 3,
    name: "Stack Overflow",
    status: "paused",
    lastRun: "1 day ago",
    jobsFetched: 0,
    successRate: "N/A",
  },
  {
    id: 4,
    name: "Glassdoor",
    status: "error",
    lastRun: "2 hours ago",
    jobsFetched: 45,
    successRate: "12%",
  },
  {
    id: 5,
    name: "RemoteOK",
    status: "active",
    lastRun: "30 mins ago",
    jobsFetched: 320,
    successRate: "100%",
  },
];

const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const JobStreams = () => {
  const [streams, setStreams] = useState<StreamItem[]>(fallbackStreams);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const fetchStreams = async () => {
      setLoading(true);
      try {
        const result = await api.getJobStreams();
        if (result.streams.length > 0) {
          const mapped: StreamItem[] = result.streams.map((s) => ({
            id: s.id,
            name: s.name,
            status: s.status as "active" | "paused" | "error",
            lastRun: s.last_run ? formatTimeAgo(s.last_run) : "Never",
            jobsFetched: s.jobs_fetched,
            successRate: s.success_rate
              ? `${Math.round(s.success_rate)}%`
              : "N/A",
          }));
          setStreams(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch streams:", error);
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  const handleSyncAll = () => {
    setSyncing(true);
    // Simulate sync operation
    setTimeout(() => {
      setSyncing(false);
    }, 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Streams</h1>
          <p className="text-sm text-gray-500">
            Manage data sources and scraping schedules
          </p>
        </div>
        <button
          onClick={handleSyncAll}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
        >
          <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Syncing..." : "Sync All"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Source Name
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Jobs Fetched
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {streams.map((stream) => (
                <tr
                  key={stream.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">
                      {stream.name}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {stream.status === "active" && (
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      )}
                      {stream.status === "paused" && (
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      )}
                      {stream.status === "error" && (
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      )}
                      <span className="text-sm text-gray-600 capitalize">
                        {stream.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} />
                      {stream.lastRun}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {stream.jobsFetched.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div
                      className={`text-sm font-medium ${
                        stream.status === "error"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {stream.successRate}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {stream.status === "active" ? (
                        <button
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Pause"
                        >
                          <Pause size={16} />
                        </button>
                      ) : (
                        <button
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Resume"
                        >
                          <Play size={16} />
                        </button>
                      )}
                      <button
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Run Now"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default JobStreams;
