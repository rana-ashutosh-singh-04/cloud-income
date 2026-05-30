import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";

export default function TransactionItem({ txn }) {
  const sign = txn.type === "DEBIT" ? "-" : "+";
  const isDebit = txn.type === "DEBIT";
  const date = new Date(txn.createdAt);
  const timeAgo = getTimeAgo(date);

  return (
    <div className="flex items-center justify-between p-4 bg-[#ffffff] rounded-[12px] shadow-[0_2px_16px_rgba(58,48,42,0.06)] hover:shadow-lg transition border border-[rgba(216,208,200,0.7)] group">
      <div className="flex items-center gap-4 flex-1">
        <div
          className={`p-3 rounded-[12px] ${
            isDebit
              ? "bg-[#8c3c3c]/10 group-hover:bg-[#8c3c3c]/20"
              : "bg-[#c2652a]/10 group-hover:bg-[#c2652a]/20"
          } transition`}
        >
          {isDebit ? (
            <ArrowUpRight className="w-5 h-5 text-[#8c3c3c]" />
          ) : (
            <ArrowDownLeft className="w-5 h-5 text-[#c2652a]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#2a1f17] mb-1 truncate">
            {txn.counterpartyName}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8c7e72]">
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
          isDebit ? "text-[#8c3c3c]" : "text-[#c2652a]"
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
