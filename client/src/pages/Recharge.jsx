import { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/card";
import { useAuth } from "../hooks/useAuth";
import {
  Smartphone,
  Tv,
  Wifi,
  Zap,
  Wallet,
  CheckCircle,
  Search,
} from "lucide-react";

const rechargeTypes = [
  {
    id: "mobile",
    name: "Mobile",
    icon: Smartphone,
    operators: ["Airtel", "Jio", "Vi", "BSNL"],
  },
  {
    id: "dth",
    name: "DTH",
    icon: Tv,
    operators: ["Tata Sky", "Dish TV", "Airtel Digital", "Sun Direct"],
  },
  {
    id: "data",
    name: "Data Card",
    icon: Wifi,
    operators: ["JioFi", "Airtel Xstream", "BSNL Data Card"],
  },
  {
    id: "electricity",
    name: "Electricity",
    icon: Zap,
    operators: ["BSES", "Tata Power", "Adani Electricity"],
  },
];

const quickPlans = [
  { amount: 99, validity: "28 days", data: "2GB/day" },
  { amount: 149, validity: "28 days", data: "1.5GB/day" },
  { amount: 199, validity: "28 days", data: "2GB/day" },
  { amount: 299, validity: "28 days", data: "2.5GB/day" },
  { amount: 399, validity: "56 days", data: "2GB/day" },
  { amount: 599, validity: "84 days", data: "2GB/day" },
];

export default function Recharge() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("mobile");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const currentType = rechargeTypes.find((t) => t.id === selectedType);

  const handleRecharge = async () => {
    if (!selectedOperator || !phoneNumber || !amount) {
      setStatus({ type: "error", message: "Please fill all fields" });
      return;
    }

    try {
      setStatus({ type: "loading", message: "Processing recharge..." });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus({
        type: "success",
        message: `Recharge of ₹${amount} successful for ${phoneNumber}!`,
      });
      setPhoneNumber("");
      setAmount("");
    } catch (error) {
      setStatus({ type: "error", message: "Recharge failed. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf5ee]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2a1f17] mb-3">
            Recharge & Top-up
          </h1>
          <p className="text-lg text-[#605850]">
            Recharge your mobile, DTH, data card, and more
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recharge Types */}
          <div className="lg:col-span-1">
            <Card className="bg-[#ffffff] shadow-[0_2px_16px_rgba(58,48,42,0.06)] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)]">
              <h3 className="font-bold text-lg text-[#2a1f17] mb-4">Recharge Type</h3>
              <div className="space-y-3">
                {rechargeTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id);
                        setSelectedOperator("");
                        setPhoneNumber("");
                        setAmount("");
                        setStatus("");
                      }}
                      className={`w-full p-4 rounded-[12px] transition-all text-left ${
                        selectedType === type.id
                          ? "bg-[#c2652a] text-white shadow-[0_2px_16px_rgba(58,48,42,0.06)] transform scale-[1.02]"
                          : "bg-[#ffffff] hover:bg-[#faf5ee] border border-[rgba(216,208,200,0.7)] text-[#4a3d33]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6" />
                        <span className="font-semibold">{type.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-[#ffffff] shadow-[0_2px_16px_rgba(58,48,42,0.06)] rounded-[16px] p-8 border border-[rgba(216,208,200,0.7)]">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="p-4 bg-[#c2652a]/10 border border-[#c2652a]/20 rounded-[12px] text-[#c2652a]"
                >
                  <currentType.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#2a1f17]">
                    {currentType.name} Recharge
                  </h2>
                  <p className="text-[#605850]">Select operator and enter details</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Operator Selection */}
                <div>
                  <label className="block text-sm font-semibold text-[#605850] mb-2">
                    Select Operator
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {currentType.operators.map((operator) => (
                      <button
                        key={operator}
                        onClick={() => setSelectedOperator(operator)}
                        className={`p-4 rounded-[8px] border transition ${
                          selectedOperator === operator
                            ? "border-[#c2652a] bg-[#c2652a]/5 text-[#c2652a] font-semibold shadow-[0_2px_8px_rgba(194,101,42,0.15)]"
                            : "border-[rgba(216,208,200,0.7)] hover:border-[#c2652a]/50 bg-white text-[#4a3d33]"
                        }`}
                      >
                        {operator}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-[#605850] mb-2">
                    {selectedType === "mobile" ? "Mobile Number" : "Account Number"}
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={selectedType === "mobile" ? "10-digit mobile number" : "Account number"}
                    maxLength={selectedType === "mobile" ? 10 : undefined}
                    className="w-full px-4 py-4 bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] text-lg transition"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-[#605850] mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full px-4 py-4 bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] text-lg font-semibold transition"
                  />
                </div>

                {/* Quick Plans (for mobile) */}
                {selectedType === "mobile" && selectedOperator && (
                  <div>
                    <label className="block text-sm font-semibold text-[#605850] mb-3">
                      Popular Plans
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {quickPlans.map((plan, index) => (
                        <button
                          key={index}
                          onClick={() => setAmount(plan.amount.toString())}
                          className={`p-4 rounded-[8px] border transition text-left ${
                            amount === plan.amount.toString()
                              ? "border-[#c2652a] bg-[#c2652a]/5 shadow-[0_2px_8px_rgba(194,101,42,0.15)]"
                              : "border-[rgba(216,208,200,0.7)] hover:border-[#c2652a]/50 bg-white"
                          }`}
                        >
                          <div className="font-bold text-lg text-[#2a1f17]">₹{plan.amount}</div>
                          <div className="text-xs text-[#8c7e72] mt-1">
                            {plan.validity} • {plan.data}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Balance Display */}
                <div className="bg-[#f3ece0] rounded-[12px] p-4 border border-[rgba(216,208,200,0.7)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-[#c2652a]" />
                      <span className="text-sm font-medium text-[#605850]">
                        Available Balance
                      </span>
                    </div>
                    <span className="text-xl font-bold text-[#2a1f17]">
                      ₹{Number(user?.balance || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                {/* Status Message */}
                {status && (
                  <div
                    className={`p-4 rounded-xl border ${
                      status.type === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : status.type === "loading"
                        ? "bg-[#f3ece0] border-[rgba(216,208,200,0.7)] text-[#4a3d33]"
                        : "bg-[#8c3c3c]/10 border-[#8c3c3c]/20 text-[#8c3c3c]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {status.type === "success" && <CheckCircle className="w-5 h-5" />}
                      <p className="font-semibold">{status.message}</p>
                    </div>
                  </div>
                )}

                {/* Recharge Button */}
                <button
                  onClick={handleRecharge}
                  disabled={!selectedOperator || !phoneNumber || !amount || status.type === "loading"}
                  className="w-full py-4 bg-[#c2652a] text-white rounded-[8px] font-bold text-lg hover:bg-[#a8541f] transition-all transform hover:scale-[1.02] shadow-[0_2px_16px_rgba(58,48,42,0.06)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status.type === "loading" ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-5 h-5" />
                      Recharge Now
                    </>
                  )}
                </button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
