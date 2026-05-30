import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  Building,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export default function WithdrawModal({ open, onClose, onWithdrawSuccess }) {
  const { user } = useAuth();
  const [step, setStep] = useState("input"); // input, pin, success
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("upi"); // upi, bank
  
  // Method details
  const [vpa, setVpa] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  
  // PIN entry states
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (!open) {
      setStep("input");
      setAmount("");
      setMethod("upi");
      setVpa("");
      setBankName("");
      setAccountNo("");
      setIfsc("");
      setError("");
      setReference("");
    }
  }, [open]);

  if (!open) return null;

  const quickAmounts = [200, 500, 1000, 2000, 5000];

  // Synthesize success chime sound
  const playSuccessChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const playTone = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      playTone(523.25, 0, 0.15); // C5
      playTone(659.25, 0.08, 0.15); // E5
      playTone(783.99, 0.16, 0.35); // G5
    } catch (e) {
      console.warn("Chime playback failed", e);
    }
  };

  const handleProceedToPin = async () => {
    setError("");
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError("Please enter a valid amount to withdraw");
      return;
    }
    if (num > (user?.balance || 0)) {
      setError("Insufficient wallet balance");
      return;
    }

    if (method === "upi") {
      if (!vpa || !vpa.includes("@")) {
        setError("Please enter a valid UPI ID (e.g. name@upi)");
        return;
      }
    } else {
      if (!bankName.trim()) {
        setError("Please enter the bank name");
        return;
      }
      if (!accountNo.trim() || accountNo.length < 8) {
        setError("Please enter a valid account number");
        return;
      }
      if (!ifsc.trim() || ifsc.length < 4) {
        setError("Please enter a valid IFSC code");
        return;
      }
    }

    setStep("pin");

    try {
      const details =
        method === "upi"
          ? { vpa }
          : { bankName, accountNo, ifsc };

      const { data } = await api.post("/txn/withdraw", {
        method,
        details,
        amount: num,
        pin: "000000",
      });

      setReference(data.reference);
      playSuccessChime();
      setStep("success");
      if (onWithdrawSuccess) {
        onWithdrawSuccess();
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to process withdrawal."
      );
      setStep("input");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2a1f17]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      {/* STEP 1: Details & Amount Input */}
      {step === "input" && (
        <div className="bg-white rounded-[24px] shadow-[0_4px_30px_rgba(58,48,42,0.15)] border border-[rgba(216,208,200,0.8)] w-full max-w-md overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[rgba(216,208,200,0.6)] bg-[#faf5ee]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c2652a]/10 flex items-center justify-center border border-[#c2652a]/15">
                <CreditCard className="w-5 h-5 text-[#c2652a]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#2a1f17]">Withdraw Money</h3>
                <p className="text-xs text-[#8c7e72]">Withdraw wallet balance to Bank or UPI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[rgba(216,208,200,0.4)] text-[#8c7e72] hover:text-[#4a3d33] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3.5 bg-[#8c3c3c]/10 border border-[#8c3c3c]/20 rounded-[12px] text-[#8c3c3c] text-xs flex items-start gap-2 animate-shake">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Wallet Balance Display */}
            <div className="p-4 bg-[#faf5ee] border border-[rgba(216,208,200,0.6)] rounded-[16px] flex justify-between items-center">
              <span className="text-sm text-[#605850]">Available Balance</span>
              <span className="font-bold text-[#c2652a] text-lg">
                ₹{Number(user?.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Amount input */}
            <div>
              <label className="block text-xs font-semibold text-[#8c7e72] uppercase tracking-wider mb-2">
                Withdrawal Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-[#605850]">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white border border-[rgba(216,208,200,0.8)] rounded-[12px] text-[#2a1f17] text-2xl font-bold placeholder-[#d8d0c0] focus:ring-2 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none transition"
                />
              </div>

              {/* Quick selectors */}
              <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-thin">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className="px-3.5 py-1.5 bg-[#faf5ee] hover:bg-[#c2652a]/10 hover:text-[#c2652a] border border-[rgba(216,208,200,0.8)] rounded-full text-xs font-semibold text-[#605850] transition cursor-pointer"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Method Select */}
            <div>
              <label className="block text-xs font-semibold text-[#8c7e72] uppercase tracking-wider mb-2">
                Withdrawal Route
              </label>
              <div className="grid grid-cols-2 gap-3 bg-[#faf5ee] p-1 border border-[rgba(216,208,200,0.8)] rounded-[12px]">
                <button
                  type="button"
                  onClick={() => setMethod("upi")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-[8px] text-sm font-semibold transition cursor-pointer ${
                    method === "upi"
                      ? "bg-white text-[#c2652a] shadow-[0_2px_8px_rgba(194,101,42,0.1)] border border-[rgba(216,208,200,0.6)]"
                      : "text-[#605850] hover:text-[#2a1f17]"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  UPI ID
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("bank")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-[8px] text-sm font-semibold transition cursor-pointer ${
                    method === "bank"
                      ? "bg-white text-[#c2652a] shadow-[0_2px_8px_rgba(194,101,42,0.1)] border border-[rgba(216,208,200,0.6)]"
                      : "text-[#605850] hover:text-[#2a1f17]"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  Bank Account
                </button>
              </div>
            </div>

            {/* Method inputs */}
            {method === "upi" ? (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#8c7e72]">
                  Destination UPI ID / VPA
                </label>
                <input
                  type="text"
                  placeholder="e.g. user@okaxis"
                  value={vpa}
                  onChange={(e) => setVpa(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[rgba(216,208,200,0.8)] rounded-[12px] text-[#2a1f17] placeholder-[#d8d0c0] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none transition text-sm"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8c7e72] mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[rgba(216,208,200,0.8)] rounded-[12px] text-[#2a1f17] placeholder-[#d8d0c0] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none transition text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8c7e72] mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 501002342345"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-[rgba(216,208,200,0.8)] rounded-[12px] text-[#2a1f17] placeholder-[#d8d0c0] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8c7e72] mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0000060"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-[rgba(216,208,200,0.8)] rounded-[12px] text-[#2a1f17] placeholder-[#d8d0c0] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none transition text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleProceedToPin}
              className="w-full mt-4 py-3.5 bg-[#c2652a] text-white font-bold rounded-[12px] shadow-md hover:bg-[#a8541f] transition transform hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              Proceed to Verification
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Processing Loader */}
      {step === "pin" && (
        <div className="bg-white rounded-[24px] shadow-[0_4px_30px_rgba(58,48,42,0.15)] border border-[rgba(216,208,200,0.8)] w-full max-w-sm p-8 text-center text-[#2a1f17] animate-scale-in flex flex-col justify-center items-center space-y-6 min-h-[350px]">
          <div className="w-16 h-16 border-4 border-[#c2652a] border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h4 className="font-bold text-lg text-gray-900">Processing Withdrawal</h4>
            <p className="text-xs text-gray-500 mt-1">Processing settlement to your bank/UPI...</p>
          </div>
        </div>
      )}

      {/* STEP 3: Success Screen */}
      {step === "success" && (
        <div className="bg-white rounded-[24px] shadow-[0_4px_30px_rgba(58,48,42,0.15)] border border-[rgba(216,208,200,0.8)] w-full max-w-sm p-8 text-center text-[#2a1f17] animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h3 className="font-extrabold text-2xl tracking-tight mb-2">Withdrawal Initiated</h3>
          <p className="text-sm text-[#8c7e72] mb-6">
            Your transfer of <span className="font-bold text-[#2a1f17]">₹{Number(amount).toLocaleString("en-IN")}</span> has been queued for instant settlement.
          </p>

          <div className="bg-[#faf5ee] border border-[rgba(216,208,200,0.6)] rounded-[16px] p-4 text-left space-y-2.5 text-xs text-[#605850] mb-6">
            <div className="flex justify-between">
              <span>Transfer Type</span>
              <span className="font-semibold text-[#2a1f17] uppercase">{method === "upi" ? "UPI Transfer" : "Bank Settlement"}</span>
            </div>
            <div className="flex justify-between">
              <span>Recipient Info</span>
              <span className="font-semibold text-[#2a1f17] break-all">{method === "upi" ? vpa : `${bankName} (${accountNo.slice(-4)})`}</span>
            </div>
            <div className="flex justify-between">
              <span>Reference Transaction</span>
              <span className="font-mono text-[#2a1f17] tracking-wider uppercase select-all">{reference || "WITH_0190FF"}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#c2652a] text-white font-bold rounded-[12px] shadow-sm hover:bg-[#a8541f] transition transform active:scale-95 cursor-pointer"
          >
            Go Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
