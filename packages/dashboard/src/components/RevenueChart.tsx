import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface RevenueData {
  date: string;
  revenue: number;
  calls: number;
}

export function RevenueChart({ data }: { data: RevenueData[] }) {
  return (
    <div className="bg-white p-6 border-4 border-black shadow-brutal">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wide">
          💰 Revenue
        </h2>
        <div className="px-3 py-1 bg-brutal-yellow border-2 border-black text-xs font-bold">
          LAST 9 DAYS
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFE500" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FFE500" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" stroke="#000" strokeWidth={2} />
          <XAxis 
            dataKey="date" 
            fontSize={12} 
            stroke="#000" 
            strokeWidth={2}
            fontWeight="bold"
          />
          <YAxis 
            fontSize={12} 
            stroke="#000" 
            strokeWidth={2}
            fontWeight="bold"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "3px solid #000",
              borderRadius: "0",
              fontWeight: "bold",
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#000"
            strokeWidth={3}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CallsChart({ data }: { data: RevenueData[] }) {
  return (
    <div className="bg-white p-6 border-4 border-black shadow-brutal">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wide">
          📊 API Calls
        </h2>
        <div className="px-3 py-1 bg-brutal-cyan border-2 border-black text-xs font-bold">
          LAST 9 DAYS
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="0" stroke="#000" strokeWidth={2} />
          <XAxis 
            dataKey="date" 
            fontSize={12} 
            stroke="#000" 
            strokeWidth={2}
            fontWeight="bold"
          />
          <YAxis 
            fontSize={12} 
            stroke="#000" 
            strokeWidth={2}
            fontWeight="bold"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "3px solid #000",
              fontWeight: "bold",
            }}
          />
          <Line
            type="monotone"
            dataKey="calls"
            stroke="#000"
            strokeWidth={4}
            dot={{ fill: "#00F0FF", strokeWidth: 3, r: 5, stroke: "#000" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
