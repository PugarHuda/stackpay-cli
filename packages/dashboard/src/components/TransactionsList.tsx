import { ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react";

interface Transaction {
  txId: string;
  amount: number;
  currency: string;
  status: "success" | "pending" | "failed";
  sender: string;
  timestamp: string;
  endpoint: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Verified",
  },
  pending: {
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    label: "Pending",
  },
  failed: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    label: "Failed",
  },
};

export function TransactionsList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endpoint
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Explorer
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx) => {
              const status = statusConfig[tx.status];
              const StatusIcon = status.icon;
              return (
                <tr
                  key={tx.txId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {tx.txId.substring(0, 8)}...
                      {tx.txId.substring(tx.txId.length - 6)}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {tx.amount} {tx.currency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-gray-600">{tx.endpoint}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tx.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://explorer.stacks.co/txid/${tx.txId}?chain=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stacks-600 hover:text-stacks-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No transactions yet</p>
            <p className="text-sm">
              Payments will appear here once your API receives calls
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M22 12h-4l-3 9L9 3l-3 9H2"
      />
    </svg>
  );
}
