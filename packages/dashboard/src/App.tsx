import { useState } from "react";
import { APIMetrics } from "./components/APIMetrics";
import { RevenueChart, CallsChart } from "./components/RevenueChart";
import { TransactionsList } from "./components/TransactionsList";
import { Zap, Settings, BarChart3, Code2, Wallet } from "lucide-react";

// Mock data for demo (in production, fetch from Stacks API)
const mockRevenueData = [
  { date: "Feb 1", revenue: 0.05, calls: 5 },
  { date: "Feb 2", revenue: 0.12, calls: 12 },
  { date: "Feb 3", revenue: 0.08, calls: 8 },
  { date: "Feb 4", revenue: 0.23, calls: 23 },
  { date: "Feb 5", revenue: 0.31, calls: 31 },
  { date: "Feb 6", revenue: 0.18, calls: 18 },
  { date: "Feb 7", revenue: 0.42, calls: 42 },
  { date: "Feb 8", revenue: 0.55, calls: 55 },
  { date: "Feb 9", revenue: 0.38, calls: 38 },
];

const mockTransactions = [
  {
    txId: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef12345678",
    amount: 0.01,
    currency: "STX",
    status: "success" as const,
    sender: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    timestamp: "2 min ago",
    endpoint: "/api/weather",
  },
  {
    txId: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456789a",
    amount: 0.005,
    currency: "STX",
    status: "success" as const,
    sender: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
    timestamp: "5 min ago",
    endpoint: "/api/stock/BTC",
  },
  {
    txId: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456789ab0",
    amount: 0.01,
    currency: "STX",
    status: "pending" as const,
    sender: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE",
    timestamp: "8 min ago",
    endpoint: "/api/summarize",
  },
  {
    txId: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456789ab0c1",
    amount: 0.001,
    currency: "STX",
    status: "success" as const,
    sender: "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9",
    timestamp: "12 min ago",
    endpoint: "/api/weather",
  },
  {
    txId: "0x5e6f7890abcdef1234567890abcdef1234567890abcdef123456789ab0c1d2",
    amount: 0.005,
    currency: "STX",
    status: "failed" as const,
    sender: "SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ306NDRGN",
    timestamp: "15 min ago",
    endpoint: "/api/stock/STX",
  },
];

const mockMetrics = {
  totalRevenue: 2.32,
  totalCalls: 232,
  avgPrice: 0.01,
  activeUsers: 47,
  revenueChange: 23.5,
  callsChange: 18.2,
};

function App() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "settings"
  >("overview");
  const [address, setAddress] = useState(
    "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-stacks-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">StackPay</h1>
              <span className="px-2 py-0.5 bg-stacks-50 text-stacks-700 text-xs font-medium rounded-full">
                Dashboard
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <Wallet className="w-4 h-4 text-gray-500" />
                <code className="text-xs text-gray-600 font-mono">
                  {address.substring(0, 8)}...
                  {address.substring(address.length - 4)}
                </code>
              </div>
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                ● Testnet
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "overview"
                  ? "border-stacks-600 text-stacks-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "transactions"
                  ? "border-stacks-600 text-stacks-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Code2 className="w-4 h-4" />
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "settings"
                  ? "border-stacks-600 text-stacks-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <>
            <APIMetrics metrics={mockMetrics} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <RevenueChart data={mockRevenueData} />
              <CallsChart data={mockRevenueData} />
            </div>
            <TransactionsList transactions={mockTransactions.slice(0, 5)} />
          </>
        )}

        {activeTab === "transactions" && (
          <TransactionsList transactions={mockTransactions} />
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              API Configuration
            </h2>
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-stacks-500 focus:border-stacks-500"
                  placeholder="SP2J6ZY48GV1..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per API Call
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue={0.01}
                    step={0.001}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-stacks-500 focus:border-stacks-500"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-stacks-500">
                    <option>STX</option>
                    <option>sBTC</option>
                    <option>USDCx</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-stacks-500">
                  <option>Testnet</option>
                  <option>Mainnet</option>
                </select>
              </div>
              <button className="mt-4 px-4 py-2 bg-stacks-600 text-white rounded-lg text-sm font-medium hover:bg-stacks-700 transition-colors">
                Save Configuration
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>StackPay CLI v1.0.0 — Built for x402 Stacks Challenge</span>
            <div className="flex gap-4">
              <a
                href="https://github.com/stackpay"
                className="hover:text-gray-700"
              >
                GitHub
              </a>
              <a
                href="https://docs.x402stacks.xyz/"
                className="hover:text-gray-700"
              >
                x402 Docs
              </a>
              <a href="https://docs.stacks.co" className="hover:text-gray-700">
                Stacks Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
