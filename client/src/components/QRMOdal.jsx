import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import {
  X,
  QrCode,
  ShieldCheck,
  Sparkles,
  User,
  CreditCard,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export default function QRModal({ open, onClose }) {
  const { user } = useAuth();
  const [senderName, setSenderName] = useState("John Doe");
  const [amount, setAmount] = useState("500");
  const [note, setNote] = useState("Dinner");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setSuccess(false);
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open || !user) return null;

  // Real-time scan URL format for UPI standard (VPA and Name)
  const upiUrl = `upi://pay?pa=${user.vpa}&pn=${encodeURIComponent(
    user.name
  )}&cu=INR`;
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiUrl
  )}`;

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    
    const num = Number(amount);
    if (!senderName) {
      setError("Please enter a sender name");
      return;
    }
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid transfer amount");
      return;
    }

    setLoading(true);
    try {
      await api.post("/txn/simulate-receive", {
        senderName,
        amount: num,
        note,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to simulate incoming payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2a1f17]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-[#ffffff] rounded-[24px] shadow-[0_4px_30px_rgba(58,48,42,0.15)] border border-[rgba(216,208,200,0.8)] w-full max-w-3xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[rgba(216,208,200,0.6)] bg-[#faf5ee]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c2652a]/10 flex items-center justify-center border border-[#c2652a]/15">
              <QrCode className="w-5 h-5 text-[#c2652a]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#2a1f17]">Receive via UPI QR</h3>
              <p className="text-xs text-[#8c7e72]">Show your QR code or simulate incoming payment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[rgba(216,208,200,0.4)] text-[#8c7e72] hover:text-[#4a3d33] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Split Columns */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[rgba(216,208,200,0.6)]">
          {/* LEFT: QR Code Display */}
          <div className="p-6 md:p-8 flex flex-col items-center justify-between text-center space-y-4">
            <div className="space-y-1">
              <h4 className="font-extrabold text-[#2a1f17] text-md">{user.name}</h4>
              <p className="text-xs font-mono text-[#8c7e72] bg-[#faf5ee] px-3 py-1 rounded-full border border-[#eae5df]">
                {user.vpa}
              </p>
            </div>

            <div className="bg-[#f3ece0]/40 p-4 border border-[rgba(216,208,200,0.6)] rounded-[20px] shadow-inner flex items-center justify-center">
              <img
                src={qrImageSrc}
                alt={`${user.name} UPI QR`}
                className="w-48 h-48 rounded-[12px] bg-white border border-[#d8d0c8] shadow-sm"
              />
            </div>

            <div className="space-y-1.5 text-center">
              <p className="text-xs text-[#605850]">
                Scan with GPay, PhonePe, Paytm, or BHIM to pay
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8c7e72]">
                <ShieldCheck className="w-4 h-4 text-[#c2652a]" /> Secure Instant Bank Settlement
              </div>
            </div>
          </div>

          {/* RIGHT: Live Sandbox payment simulator */}
          <div className="p-6 md:p-8 bg-[#faf5ee]/25 flex flex-col justify-between">
            <form onSubmit={handleSimulatePayment} className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#c2652a] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#c2652a]" />
                Sandbox Payment Simulator
              </div>
              <p className="text-xs text-[#605850] leading-relaxed">
                Want to test the real-time notifications? Fill in the details below to simulate another user scanning your QR code and paying you!
              </p>

              {/* Sender Name */}
              <div>
                <label className="block text-[10px] font-bold text-[#8c7e72] uppercase tracking-wider mb-1.5">
                  Simulated Sender Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c7e72]" />
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(216,208,200,0.8)] focus:border-[#c2652a] focus:ring-1 focus:ring-[#c2652a] rounded-[10px] text-sm text-[#2a1f17] outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Transfer Amount */}
                <div>
                  <label className="block text-[10px] font-bold text-[#8c7e72] uppercase tracking-wider mb-1.5">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-[#8c7e72]">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="500"
                      className="w-full pl-8 pr-4 py-2.5 bg-white border border-[rgba(216,208,200,0.8)] focus:border-[#c2652a] focus:ring-1 focus:ring-[#c2652a] rounded-[10px] text-sm font-bold text-[#2a1f17] outline-none transition"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Transfer Note */}
                <div>
                  <label className="block text-[10px] font-bold text-[#8c7e72] uppercase tracking-wider mb-1.5">
                    Note / Purpose
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Dinner"
                    className="w-full px-4 py-2.5 bg-white border border-[rgba(216,208,200,0.8)] focus:border-[#c2652a] focus:ring-1 focus:ring-[#c2652a] rounded-[10px] text-sm text-[#2a1f17] outline-none transition"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-[8px] text-red-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-[8px] text-green-700 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle className="w-4 h-4 text-green-600" /> Payment simulation triggered!
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#c2652a] hover:bg-[#a8541f] text-white text-xs font-bold rounded-[10px] shadow-sm transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" /> Simulate QR Payment Scan
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-[rgba(216,208,200,0.45)] text-[10px] text-[#8c7e72] flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Simulating will deduct balance from a mock user and credit it live.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[rgba(216,208,200,0.6)] bg-[#faf5ee]/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#f3ece0] hover:bg-[#e6dccb] border border-[rgba(216,208,200,0.8)] text-[#4a3d33] text-sm font-bold rounded-[10px] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}