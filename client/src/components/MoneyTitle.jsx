import { Wallet, Gift, Coins, TrendingUp } from "lucide-react";

const iconMap = {
  "Wallet Balance": Wallet,
  "Rewards": Gift,
  "Gold (gm)": Coins,
  "Portfolio": TrendingUp,
};

export default function MoneyTile({ title, value, onClick, icon }) {
  const Icon = icon || iconMap[title] || Wallet;
  
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 text-left w-full hover:scale-[1.02] hover:shadow-xl transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition">
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
        {value > 0 && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            Active
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className="text-3xl font-bold text-gray-900">
        ₹{Number(value).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </button>
  );
}
