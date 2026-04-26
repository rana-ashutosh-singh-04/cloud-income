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
    providers: ["BSES", "Tata Power", "Adani Electricity", "Maharashtra State Electricity"],
  },
  {
    id: "water",
    name: "Water",
    icon: Droplet,
    providers: ["Delhi Jal Board", "Mumbai Water Supply", "Bangalore Water Supply"],
  },
  {
    id: "broadband",
    name: "Broadband",
    icon: Wifi,
    providers: ["Airtel", "Jio", "BSNL", "ACT Fibernet"],
  },
  {
    id: "dth",
    name: "DTH",
    icon: Tv,
    providers: ["Tata Sky", "Dish TV", "Airtel Digital", "Sun Direct"],
  },
  {
    id: "gas",
    name: "Gas",
    icon: Flame,
    providers: ["Indane", "HP Gas", "Bharat Gas"],
  },
  {
    id: "rent",
    name: "Rent",
    icon: Building2,
    providers: ["Property Management", "Landlord Payment"],
  },
  {
    id: "credit",
    name: "Credit Card",
    icon: CreditCard,
    providers: ["HDFC", "ICICI", "SBI", "Axis Bank"],
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: FileText,
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
    <div className="min-h-screen bg-[#faf5ee]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2a1f17] mb-3">
            Pay Bills
          </h1>
          <p className="text-lg text-[#605850]">
            Pay your utility bills, subscriptions, and more in one place
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Bill Categories - Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#ffffff] shadow-[0_2px_16px_rgba(58,48,42,0.06)] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)] sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-[#8c7e72]" />
                <input
                  type="text"
                  placeholder="Search bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] text-sm focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] transition"
                />
              </div>
              <div className="space-y-2">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full p-4 rounded-[12px] transition-all text-left ${
                        selectedCategory?.id === category.id
                          ? "bg-[#c2652a] text-white shadow-[0_2px_16px_rgba(58,48,42,0.06)] transform scale-[1.02]"
                          : "bg-white hover:bg-[#faf5ee] border border-[rgba(216,208,200,0.7)] text-[#4a3d33]"
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
              <Card className="bg-[#ffffff] shadow-[0_2px_16px_rgba(58,48,42,0.06)] rounded-[16px] p-8 border border-[rgba(216,208,200,0.7)]">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="p-4 bg-[#c2652a]/10 border border-[#c2652a]/20 rounded-[12px] text-[#c2652a]"
                  >
                    <selectedCategory.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#2a1f17]">
                      Pay {selectedCategory.name} Bill
                    </h2>
                    <p className="text-[#605850]">Select provider and enter details</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Provider Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-[#605850] mb-2">
                      Select Provider
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedCategory.providers.map((provider) => (
                        <button
                          key={provider}
                          onClick={() => setSelectedProvider(provider)}
                          className={`p-4 rounded-[8px] border transition ${
                            selectedProvider === provider
                              ? "border-[#c2652a] bg-[#c2652a]/5 text-[#c2652a] font-semibold shadow-[0_2px_8px_rgba(194,101,42,0.15)]"
                              : "border-[rgba(216,208,200,0.7)] hover:border-[#c2652a]/50 bg-white text-[#4a3d33]"
                          }`}
                        >
                          {provider}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Consumer Number */}
                  <div>
                    <label className="block text-sm font-semibold text-[#605850] mb-2">
                      Consumer Number / Account Number
                    </label>
                    <input
                      type="text"
                      value={consumerNumber}
                      onChange={(e) => setConsumerNumber(e.target.value)}
                      placeholder="Enter consumer number"
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
                      placeholder="Enter bill amount"
                      min="1"
                      step="0.01"
                      className="w-full px-4 py-4 bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] text-lg font-semibold transition"
                    />
                  </div>

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

                  {/* Pay Button */}
                  <button
                    onClick={handlePay}
                    disabled={!selectedProvider || !consumerNumber || !amount || status.type === "loading"}
                    className="w-full py-4 bg-[#c2652a] text-white rounded-[8px] font-bold text-lg hover:bg-[#a8541f] transition-all transform hover:scale-[1.02] shadow-[0_2px_16px_rgba(58,48,42,0.06)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <Card className="bg-[#ffffff] shadow-[0_2px_16px_rgba(58,48,42,0.06)] rounded-[16px] p-12 border border-[rgba(216,208,200,0.7)] text-center h-full flex flex-col justify-center items-center">
                <Receipt className="w-16 h-16 text-[#8c7e72] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#2a1f17] mb-2">
                  Select a Bill Category
                </h3>
                <p className="text-[#605850]">
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
