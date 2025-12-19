import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  Globe,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="text-xl font-bold text-gray-900">
              DevMarket Pulse
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Live Demo
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Real-time insights into the{" "}
              <span className="text-indigo-600">Tech Job Market</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed">
              Track skill demand, salary trends, and hiring hotspots across the
              globe. Data-driven decisions for recruiters, developers, and
              hiring managers.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                Explore Dashboard <ArrowRight size={20} />
              </Link>
              <button className="px-8 py-4 bg-gray-50 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
                View Reports
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Skill Trends
              </h3>
              <p className="text-gray-500">
                Discover which technologies are gaining momentum and which are
                fading away in real-time.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Salary Benchmarks
              </h3>
              <p className="text-gray-500">
                Access granular salary data by role, location, and experience
                level to stay competitive.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Global Hotspots
              </h3>
              <p className="text-gray-500">
                Identify emerging tech hubs and remote work trends across
                different regions.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof / Stats */}
        <div className="bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">500k+</div>
                <div className="text-gray-400">Jobs Tracked Daily</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">150+</div>
                <div className="text-gray-400">Countries Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">12k+</div>
                <div className="text-gray-400">Skills Indexed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400">Real-time Updates</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <span className="font-bold text-gray-900">DevMarket Pulse</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2025 DevMarket Pulse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
