import React from "react";
import KPICards from "@/components/dashboard/KPICards";
import TrendChart from "@/components/dashboard/TrendChart";
import InsightCards from "@/components/dashboard/InsightCards";

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-500 text-sm mb-1">Market Intelligence</p>
        <h1 className="text-2xl font-bold text-gray-900">
          Developer Market Pulse
        </h1>
      </div>

      <KPICards />

      <TrendChart />

      <InsightCards />
    </div>
  );
}
