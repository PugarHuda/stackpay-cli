import { DollarSign, Activity, TrendingUp, Users } from "lucide-react";

interface Metrics {
  totalRevenue: number;
  totalCalls: number;
  avgPrice: number;
  activeUsers: number;
  revenueChange: number;
  callsChange: number;
}

export function APIMetrics({ metrics }: { metrics: Metrics }) {
  const cards = [
    {
      title: "Total Revenue",
      value: `${metrics.totalRevenue.toFixed(4)} STX`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: metrics.revenueChange,
    },
    {
      title: "API Calls",
      value: metrics.totalCalls.toLocaleString(),
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: metrics.callsChange,
    },
    {
      title: "Avg Price",
      value: `${metrics.avgPrice.toFixed(4)} STX`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: 0,
    },
    {
      title: "Active Users",
      value: metrics.activeUsers.toString(),
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">
                {card.value}
              </p>
              {card.change !== 0 && (
                <p
                  className={`text-xs mt-1 ${card.change > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {card.change > 0 ? "↑" : "↓"}{" "}
                  {Math.abs(card.change).toFixed(1)}% vs last period
                </p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
