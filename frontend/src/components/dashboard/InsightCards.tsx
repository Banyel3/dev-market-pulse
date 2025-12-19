import React from "react";
import { TrendingUp, DollarSign, MapPin, Building } from "lucide-react";

const InsightCard = ({ title, icon: Icon, items, type }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 flex-1 min-w-[280px]">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-gray-900">{title}</h3>
    </div>

    <div className="space-y-4">
      {items.map((item: any, index: number) => (
        <div
          key={index}
          className="flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            )}
            {!item.image && (
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                {item.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-gray-500">{item.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            {type === "trend" && (
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                +{item.value}%
              </span>
            )}
            {type === "salary" && (
              <span className="text-sm font-bold text-gray-900">
                ${item.value}
              </span>
            )}
            {type === "count" && (
              <span className="text-sm font-bold text-gray-900">
                {item.value} Open
              </span>
            )}
          </div>
        </div>
      ))}
    </div>

    <button className="w-full mt-6 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
      View All
    </button>
  </div>
);

const InsightCards = () => {
  const hottestSkills = [
    { name: "Rust", subtitle: "Systems Programming", value: 24 },
    { name: "Go", subtitle: "Backend", value: 18 },
    { name: "TypeScript", subtitle: "Frontend/Backend", value: 12 },
  ];

  const topCompanies = [
    {
      name: "PayPal",
      subtitle: "FinTech",
      value: 8,
      image: "https://logo.clearbit.com/paypal.com",
    },
    {
      name: "Shopify",
      subtitle: "E-commerce",
      value: 20,
      image: "https://logo.clearbit.com/shopify.com",
    },
    {
      name: "Google",
      subtitle: "Tech",
      value: 2,
      image: "https://logo.clearbit.com/google.com",
    },
  ];

  const topLocations = [
    { name: "San Francisco", subtitle: "USA", value: 1200 },
    { name: "London", subtitle: "UK", value: 850 },
    { name: "Berlin", subtitle: "Germany", value: 600 },
  ];

  return (
    <div className="flex flex-wrap gap-6">
      <InsightCard
        title="Hottest Skills"
        icon={TrendingUp}
        items={hottestSkills}
        type="trend"
      />
      <InsightCard
        title="Most Active Companies"
        icon={Building}
        items={topCompanies}
        type="count"
      />
      <InsightCard
        title="Top Hiring Locations"
        icon={MapPin}
        items={topLocations}
        type="count"
      />
    </div>
  );
};

export default InsightCards;
