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
      color: "bg-brutal-yellow",
      change: metrics.revenueChange,
    },
    {
      title: "API Calls",
      value: metrics.totalCalls.toLocaleString(),
      icon: Activity,
      color: "bg-brutal-cyan",
      change: metrics.callsChange,
    },
    {
      title: "Avg Price",
      value: `${metrics.avgPrice.toFixed(4)} STX`,
      icon: TrendingUp,
      color: "bg-brutal-pink",
      change: 0,
    },
    {
      title: "Active Users",
      value: metrics.activeUsers.toString(),
      icon: Users,
      color: "bg-brutal-green",
      change: 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} p-6 border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white border-[3px] border-black">
              <card.icon className="w-6 h-6" />
            </div>
            {card.change !== 0 && (
              <div className="px-2 py-1 bg-black text-white text-xs font-bold">
                {card.change > 0 ? "↑" : "↓"} {Math.abs(card.change).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-sm font-bold uppercase tracking-wide mb-1">
            {card.title}
          </p>
          <p className="text-3xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
