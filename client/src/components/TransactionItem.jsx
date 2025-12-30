import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

export default function TransactionItem({ txn }) {
  const sign = txn.type === "DEBIT" ? "-" : "+";
  const isDebit = txn.type === "DEBIT";
  const date = new Date(txn.createdAt);
  const timeAgo = getTimeAgo(date);

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition border border-gray-100 group">
      <div className="flex items-center gap-4 flex-1">
        <div
          className={`p-3 rounded-xl ${
            isDebit
              ? "bg-red-100 group-hover:bg-red-200"
              : "bg-green-100 group-hover:bg-green-200"
          } transition`}
        >
          {isDebit ? (
            <ArrowDownRight className="w-5 h-5 text-red-600" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-green-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 mb-1 truncate">
            {txn.counterpartyName}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
            {txn.note && (
              <>
                <span>•</span>
                <span className="truncate">{txn.note}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className={`font-bold text-lg ${
          isDebit ? "text-red-600" : "text-green-600"
        }`}
      >
        {sign}₹{Number(txn.amount).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}

function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins}m ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
