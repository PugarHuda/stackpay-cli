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
    color: "bg-brutal-green",
    label: "✓ Verified",
  },
  pending: {
    icon: Clock,
    color: "bg-brutal-yellow",
    label: "⏳ Pending",
  },
  failed: {
    icon: XCircle,
    color: "bg-brutal-pink",
    label: "✗ Failed",
  },
};

export function TransactionsList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="bg-white border-4 border-black shadow-brutal">
      <div className="p-6 border-b-4 border-black bg-brutal-purple">
        <h2 className="text-2xl font-bold uppercase tracking-wide">
          🔥 Recent Transactions
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b-4 border-black">
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Transaction
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Endpoint
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Time
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">
                Explorer
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {transactions.map((tx) => {
              const status = statusConfig[tx.status];
              return (
                <tr
                  key={tx.txId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono font-bold bg-gray-100 px-3 py-1.5 border-2 border-black">
                      {tx.txId.substring(0, 8)}...
                      {tx.txId.substring(tx.txId.length - 6)}
                    </code>
                    <a
                      href={`https://explorer.stacks.co/txid/${tx.txId}?chain=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-xs text-blue-600 hover:underline"
                      title="View on Stacks Explorer"
                    >
                      🔗
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-lg">
                      {tx.amount} {tx.currency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm font-bold">{tx.endpoint}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 border-2 border-black text-xs font-bold ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">
                    {tx.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://explorer.stacks.co/txid/${tx.txId}?chain=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all font-bold text-xs"
                    >
                      VIEW <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="font-bold text-xl mb-2">No transactions yet</p>
            <p className="text-sm font-medium">
              Payments will appear here once your API receives calls
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
