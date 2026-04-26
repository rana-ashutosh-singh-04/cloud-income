import { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/card";
import { useAuth } from "../hooks/useAuth";
import { CreditCard, Wallet, CheckCircle, Building2 } from "lucide-react";

const banks = [
  { name: "HDFC Bank" },
  { name: "ICICI Bank" },
  { name: "SBI" },
  { name: "Axis Bank" },
  { name: "Kotak Mahindra" },
  { name: "Citibank" },
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
    <div className="min-h-screen bg-[#faf5ee]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2a1f17] mb-3">
            Credit Card Payment
          </h1>
          <p className="text-lg text-[#605850]">
            Pay your credit card bills instantly
          </p>
        </div>

        <Card className="bg-[#ffffff] shadow-[0_2px_16px_rgba(58,48,42,0.06)] rounded-[16px] p-8 border border-[rgba(216,208,200,0.7)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-[#c2652a]/10 border border-[#c2652a]/20 rounded-[12px] text-[#c2652a]">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#2a1f17]">Pay Credit Card Bill</h2>
              <p className="text-[#605850]">Select bank and enter card details</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Bank Selection */}
            <div>
              <label className="block text-sm font-semibold text-[#605850] mb-3">
                Select Bank
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {banks.map((bank) => (
                  <button
                    key={bank.name}
                    onClick={() => setSelectedBank(bank.name)}
                    className={`p-4 rounded-[8px] border transition ${
                      selectedBank === bank.name
                        ? "border-[#c2652a] bg-[#c2652a]/5 text-[#c2652a] font-semibold shadow-[0_2px_8px_rgba(194,101,42,0.15)]"
                        : "border-[rgba(216,208,200,0.7)] hover:border-[#c2652a]/50 bg-white text-[#4a3d33]"
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
              <label className="block text-sm font-semibold text-[#605850] mb-2">
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
                className="w-full px-4 py-4 bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] text-lg font-mono transition"
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
              onClick={handlePayment}
              disabled={!selectedBank || !cardNumber || !amount || status.type === "loading"}
              className="w-full py-4 bg-[#c2652a] text-white rounded-[8px] font-bold text-lg hover:bg-[#a8541f] transition-all transform hover:scale-[1.02] shadow-[0_2px_16px_rgba(58,48,42,0.06)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
