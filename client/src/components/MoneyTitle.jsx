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
      className="bg-[#ffffff] rounded-[16px] p-6 shadow-[0_2px_16px_rgba(58,48,42,0.06)] border border-[rgba(216,208,200,0.7)] text-left w-full hover:scale-[1.02] hover:shadow-lg transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-3 bg-[#c2652a]/10 rounded-[12px] group-hover:bg-[#c2652a]/20 transition">
          <Icon className="w-6 h-6 text-[#c2652a]" />
        </div>
        {value > 0 && (
          <span className="text-xs font-semibold text-[#c2652a] bg-[#c2652a]/10 px-2 py-1 rounded-[8px]">
            Active
          </span>
        )}
      </div>
      <div className="text-sm text-[#605850] mb-1">{title}</div>
      <div className="text-3xl font-bold text-[#2a1f17]">
        ₹{Number(value).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </button>
  );
}
