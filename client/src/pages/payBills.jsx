import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/card";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import {
  Receipt,
  Zap,
  Droplet,
  Wifi,
  Tv,
  Flame,
  Building2,
  CreditCard,
  FileText,
  Search,
  CheckCircle,
  Wallet,
} from "lucide-react";

const billCategories = [
  {
    id: "electricity",
    name: "Electricity",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    providers: ["BSES", "Tata Power", "Adani Electricity", "Maharashtra State Electricity"],
  },
  {
    id: "water",
    name: "Water",
    icon: Droplet,
    color: "from-blue-500 to-cyan-500",
    providers: ["Delhi Jal Board", "Mumbai Water Supply", "Bangalore Water Supply"],
  },
  {
    id: "broadband",
    name: "Broadband",
    icon: Wifi,
    color: "from-purple-500 to-pink-500",
    providers: ["Airtel", "Jio", "BSNL", "ACT Fibernet"],
  },
  {
    id: "dth",
    name: "DTH",
    icon: Tv,
    color: "from-red-500 to-pink-500",
    providers: ["Tata Sky", "Dish TV", "Airtel Digital", "Sun Direct"],
  },
  {
    id: "gas",
    name: "Gas",
    icon: Flame,
    color: "from-orange-500 to-red-500",
    providers: ["Indane", "HP Gas", "Bharat Gas"],
  },
  {
    id: "rent",
    name: "Rent",
    icon: Building2,
    color: "from-indigo-500 to-purple-500",
    providers: ["Property Management", "Landlord Payment"],
  },
  {
    id: "credit",
    name: "Credit Card",
    icon: CreditCard,
    color: "from-green-500 to-emerald-500",
    providers: ["HDFC", "ICICI", "SBI", "Axis Bank"],
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: FileText,
    color: "from-teal-500 to-cyan-500",
    providers: ["LIC", "HDFC Life", "ICICI Prudential"],
  },
];

export default function PayBills() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");

  const filteredCategories = billCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedProvider("");
    setConsumerNumber("");
    setAmount("");
    setStatus("");
  };

  const handlePay = async () => {
    if (!selectedProvider || !consumerNumber || !amount) {
      setStatus({ type: "error", message: "Please fill all fields" });
      return;
    }

    try {
      setStatus({ type: "loading", message: "Processing payment..." });
      // In a real app, this would call the bill payment API
      // For now, simulate a payment
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus({
        type: "success",
        message: `Payment of ₹${amount} to ${selectedProvider} successful!`,
      });
      setConsumerNumber("");
      setAmount("");
    } catch (error) {
      setStatus({ type: "error", message: "Payment failed. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Pay Bills
          </h1>
          <p className="text-lg text-gray-600">
            Pay your utility bills, subscriptions, and more in one place
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Bill Categories - Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl rounded-2xl p-6 border border-gray-100 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full p-4 rounded-xl transition-all text-left ${
                        selectedCategory?.id === category.id
                          ? "bg-gradient-to-r " + category.color + " text-white shadow-lg transform scale-105"
                          : "bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6" />
                        <span className="font-semibold">{category.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCategory ? (
              <Card className="shadow-xl rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`p-4 bg-gradient-to-r ${selectedCategory.color} rounded-xl text-white`}
                  >
                    <selectedCategory.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Pay {selectedCategory.name} Bill
                    </h2>
                    <p className="text-gray-600">Select provider and enter details</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Provider Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Provider
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedCategory.providers.map((provider) => (
                        <button
                          key={provider}
                          onClick={() => setSelectedProvider(provider)}
                          className={`p-4 rounded-xl border-2 transition ${
                            selectedProvider === provider
                              ? "border-purple-500 bg-purple-50 text-purple-700 font-semibold"
                              : "border-gray-200 hover:border-purple-300 bg-white text-gray-700"
                          }`}
                        >
                          {provider}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Consumer Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Consumer Number / Account Number
                    </label>
                    <input
                      type="text"
                      value={consumerNumber}
                      onChange={(e) => setConsumerNumber(e.target.value)}
                      placeholder="Enter consumer number"
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
                      placeholder="Enter bill amount"
                      min="1"
                      step="0.01"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                    />
                  </div>

                  {/* Balance Display */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-purple-600" />
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

                  {/* Pay Button */}
                  <button
                    onClick={handlePay}
                    disabled={!selectedProvider || !consumerNumber || !amount || status.type === "loading"}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status.type === "loading" ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Receipt className="w-5 h-5" />
                        Pay Bill
                      </>
                    )}
                  </button>
                </div>
              </Card>
            ) : (
              <Card className="shadow-xl rounded-2xl p-12 border border-gray-100 text-center">
                <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a Bill Category
                </h3>
                <p className="text-gray-500">
                  Choose a category from the left to start paying your bills
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
