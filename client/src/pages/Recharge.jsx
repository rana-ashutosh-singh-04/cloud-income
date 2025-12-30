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
    color: "from-blue-500 to-cyan-500",
    operators: ["Airtel", "Jio", "Vi", "BSNL"],
  },
  {
    id: "dth",
    name: "DTH",
    icon: Tv,
    color: "from-red-500 to-pink-500",
    operators: ["Tata Sky", "Dish TV", "Airtel Digital", "Sun Direct"],
  },
  {
    id: "data",
    name: "Data Card",
    icon: Wifi,
    color: "from-purple-500 to-indigo-500",
    operators: ["JioFi", "Airtel Xstream", "BSNL Data Card"],
  },
  {
    id: "electricity",
    name: "Electricity",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Recharge & Top-up
          </h1>
          <p className="text-lg text-gray-600">
            Recharge your mobile, DTH, data card, and more
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recharge Types */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Recharge Type</h3>
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
                      className={`w-full p-4 rounded-xl transition-all text-left ${
                        selectedType === type.id
                          ? "bg-gradient-to-r " + type.color + " text-white shadow-lg"
                          : "bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-900"
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
            <Card className="shadow-xl rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`p-4 bg-gradient-to-r ${currentType.color} rounded-xl text-white`}
                >
                  <currentType.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentType.name} Recharge
                  </h2>
                  <p className="text-gray-600">Select operator and enter details</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Operator Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Operator
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {currentType.operators.map((operator) => (
                      <button
                        key={operator}
                        onClick={() => setSelectedOperator(operator)}
                        className={`p-4 rounded-xl border-2 transition ${
                          selectedOperator === operator
                            ? "border-purple-500 bg-purple-50 text-purple-700 font-semibold"
                            : "border-gray-200 hover:border-purple-300 bg-white text-gray-700"
                        }`}
                      >
                        {operator}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {selectedType === "mobile" ? "Mobile Number" : "Account Number"}
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={selectedType === "mobile" ? "10-digit mobile number" : "Account number"}
                    maxLength={selectedType === "mobile" ? 10 : undefined}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                  />
                </div>

                {/* Quick Plans (for mobile) */}
                {selectedType === "mobile" && selectedOperator && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Popular Plans
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {quickPlans.map((plan, index) => (
                        <button
                          key={index}
                          onClick={() => setAmount(plan.amount.toString())}
                          className={`p-4 rounded-xl border-2 transition text-left ${
                            amount === plan.amount.toString()
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300 bg-white"
                          }`}
                        >
                          <div className="font-bold text-lg text-gray-900">₹{plan.amount}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {plan.validity} • {plan.data}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Balance Display */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Available Balance
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
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
                    className={`p-4 rounded-xl border-2 ${
                      status.type === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : status.type === "loading"
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : "bg-red-50 border-red-200 text-red-800"
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
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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


