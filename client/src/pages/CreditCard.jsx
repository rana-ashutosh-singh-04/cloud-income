import { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/card";
import { useAuth } from "../hooks/useAuth";
import { CreditCard, Wallet, CheckCircle, Building2 } from "lucide-react";

const banks = [
  { name: "HDFC Bank", color: "from-blue-500 to-blue-600" },
  { name: "ICICI Bank", color: "from-orange-500 to-orange-600" },
  { name: "SBI", color: "from-blue-600 to-indigo-600" },
  { name: "Axis Bank", color: "from-red-500 to-red-600" },
  { name: "Kotak Mahindra", color: "from-purple-500 to-purple-600" },
  { name: "Citibank", color: "from-cyan-500 to-cyan-600" },
];

export default function CreditCardPage() {
  const { user } = useAuth();
  const [selectedBank, setSelectedBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handlePayment = async () => {
    if (!selectedBank || !cardNumber || !amount) {
      setStatus({ type: "error", message: "Please fill all fields" });
      return;
    }

    try {
      setStatus({ type: "loading", message: "Processing payment..." });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus({
        type: "success",
        message: `Credit card payment of ₹${amount} successful!`,
      });
      setCardNumber("");
      setAmount("");
    } catch (error) {
      setStatus({ type: "error", message: "Payment failed. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Credit Card Payment
          </h1>
          <p className="text-lg text-gray-600">
            Pay your credit card bills instantly
          </p>
        </div>

        <Card className="shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pay Credit Card Bill</h2>
              <p className="text-gray-600">Select bank and enter card details</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Bank Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Bank
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {banks.map((bank) => (
                  <button
                    key={bank.name}
                    onClick={() => setSelectedBank(bank.name)}
                    className={`p-4 rounded-xl border-2 transition ${
                      selectedBank === bank.name
                        ? "border-purple-500 bg-purple-50 text-purple-700 font-semibold"
                        : "border-gray-200 hover:border-purple-300 bg-white text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      <span>{bank.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Number (Last 4 digits)
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setCardNumber(value);
                }}
                placeholder="XXXX"
                maxLength={4}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono"
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
              onClick={handlePayment}
              disabled={!selectedBank || !cardNumber || !amount || status.type === "loading"}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status.type === "loading" ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay Credit Card Bill
                </>
              )}
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
}


