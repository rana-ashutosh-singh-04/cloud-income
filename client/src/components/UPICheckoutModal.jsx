import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronRight,
  Wallet,
  Building,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function UPICheckoutModal({ open, onClose }) {
  const { user } = useAuth();
  const [step, setStep] = useState("input"); // input, sandbox_razorpay, success
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  
  // Sandbox specific states
  const [sandboxOption, setSandboxOption] = useState(""); // card, upi, netbanking
  const [sandboxCardNum, setSandboxCardNum] = useState("");
  const [sandboxUpiId, setSandboxUpiId] = useState("");

  useEffect(() => {
    if (!open) {
      setStep("input");
      setAmount("");
      setError("");
      setLoading(false);
      setReference("");
      setSandboxOption("");
      setSandboxCardNum("");
      setSandboxUpiId("");
    }
  }, [open]);

  if (!open) return null;

  const quickAmounts = [200, 500, 1000, 2000, 5000];

  // Synthesize success chime sound via Web Audio API
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
      playTone(783.99, 0, 0.2); // G5
      playTone(1046.50, 0.1, 0.35); // C6
    } catch (e) {
      console.warn("Chime playback failed", e);
    }
  };

  const handleProceedPayment = async () => {
    setError("");
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError("Please enter a valid deposit amount");
      return;
    }

    setLoading(true);

    try {
      // Create simulated order on backend
      await api.post("/txn/razorpay-order", {
        amount: num,
      });

      setStep("sandbox_razorpay");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to initiate transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxPaymentSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const mockPaymentId = `pay_mock_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data } = await api.post("/txn/razorpay-verify", {
        razorpay_payment_id: mockPaymentId,
        amount: Number(amount) * 100, // convert to paisa
      });

      setReference(data.reference);
      playSuccessChime();
      setStep("success");
    } catch {
      setError("Sandbox payment simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2a1f17]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      {/* STEP 1: Enter Amount (Standard Checkout Portal) */}
      {step === "input" && (
        <div className="bg-[#ffffff] rounded-[24px] shadow-[0_4px_30px_rgba(58,48,42,0.15)] border border-[rgba(216,208,200,0.8)] w-full max-w-md overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[rgba(216,208,200,0.6)] bg-[#faf5ee]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c2652a]/10 flex items-center justify-center border border-[#c2652a]/15">
                <Wallet className="w-5 h-5 text-[#c2652a]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#2a1f17]">Add Money via Razorpay</h3>
                <p className="text-xs text-[#8c7e72]">Add funds securely using credit card, netbanking, or UPI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[rgba(216,208,200,0.4)] text-[#8c7e72] hover:text-[#4a3d33] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-[14px] text-amber-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Sandbox Deposit Mode Active</span>
                <span>The platform is running in simulated sandbox mode. No real payments will be made.</span>
              </div>
            </div>

            {/* Amount input */}
            <div>
              <label className="block text-xs font-semibold text-[#8c7e72] uppercase tracking-wider mb-2">
                Enter Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-[#605850]">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setError("");
                    setAmount(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-4 bg-[#faf5ee]/40 border border-[rgba(216,208,200,0.8)] focus:border-[#c2652a] focus:ring-1 focus:ring-[#c2652a] rounded-[14px] text-2xl font-bold text-[#2a1f17] outline-none transition"
                  min="1"
                  required
                />
              </div>

              {/* Quick Options */}
              <div className="flex flex-wrap gap-2 mt-3">
                {quickAmounts.map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setError("");
                      setAmount(val.toString());
                    }}
                    className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold border transition ${
                      amount === val.toString()
                        ? "bg-[#c2652a] text-white border-[#c2652a]"
                        : "bg-white text-[#605850] border-[rgba(216,208,200,0.7)] hover:border-[#c2652a]/50"
                    }`}
                  >
                    +₹{val}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-[10px] text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <button
              onClick={handleProceedPayment}
              disabled={loading}
              className="w-full py-4 bg-[#c2652a] hover:bg-[#a8541f] text-white font-bold rounded-[12px] shadow-md transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Initiating...
                </>
              ) : (
                "Proceed to Pay"
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Sandbox Mock Razorpay Modal */}
      {step === "sandbox_razorpay" && (
        <div className="bg-[#ffffff] rounded-[24px] shadow-[0_4px_30px_rgba(58,48,42,0.2)] border-2 border-[#1c82e6] w-full max-w-sm overflow-hidden animate-scale-in select-none">
          {/* Razorpay Themed Header */}
          <div className="bg-[#1c82e6] px-5 py-5 text-white flex justify-between items-center relative">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-xl tracking-tight">Razorpay</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                  Testmode
                </span>
              </div>
              <h4 className="text-[11px] opacity-85 mt-0.5">Cloud Income • Add Funds</h4>
            </div>
            <div className="text-right">
              <span className="text-xs opacity-75 font-semibold block uppercase">Amount</span>
              <span className="font-extrabold text-lg">₹{amount}</span>
            </div>
          </div>

          {/* Checkout Body */}
          <div className="p-5 space-y-4">
            <h5 className="text-[11px] font-bold text-[#8c7e72] uppercase tracking-wider">
              Select Payment Method
            </h5>

            {/* Simulated Payment Options */}
            <div className="space-y-2">
              {/* Card option */}
              <div className="border border-[rgba(216,208,200,0.7)] rounded-[10px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSandboxOption("card")}
                  className={`w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-[#4a3d33] transition ${
                    sandboxOption === "card" ? "bg-[#1c82e6]/5" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#1c82e6]" />
                    <div>
                      <span className="block font-bold">Card</span>
                      <span className="text-[10px] text-[#8c7e72]">Visa, MasterCard, RuPay</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8c7e72]" />
                </button>
                {sandboxOption === "card" && (
                  <div className="p-3 bg-[#faf5ee]/50 border-t border-[rgba(216,208,200,0.5)] space-y-2.5 animate-scale-in">
                    <input
                      type="text"
                      placeholder="Card Number (e.g. 4111 1111 ...)"
                      value={sandboxCardNum}
                      onChange={(e) => setSandboxCardNum(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[rgba(216,208,200,0.8)] rounded-lg text-xs outline-none focus:border-[#1c82e6]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-3 py-2 bg-white border border-[rgba(216,208,200,0.8)] rounded-lg text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-3 py-2 bg-white border border-[rgba(216,208,200,0.8)] rounded-lg text-xs outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* UPI option */}
              <div className="border border-[rgba(216,208,200,0.7)] rounded-[10px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSandboxOption("upi")}
                  className={`w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-[#4a3d33] transition ${
                    sandboxOption === "upi" ? "bg-[#1c82e6]/5" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-[#1c82e6]" />
                    <div>
                      <span className="block font-bold">UPI / QR Code</span>
                      <span className="text-[10px] text-[#8c7e72]">Google Pay, PhonePe, Paytm</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8c7e72]" />
                </button>
                {sandboxOption === "upi" && (
                  <div className="p-3 bg-[#faf5ee]/50 border-t border-[rgba(216,208,200,0.5)] space-y-2 animate-scale-in">
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g. user@upi)"
                      value={sandboxUpiId}
                      onChange={(e) => setSandboxUpiId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[rgba(216,208,200,0.8)] rounded-lg text-xs outline-none focus:border-[#1c82e6]"
                    />
                  </div>
                )}
              </div>

              {/* Netbanking option */}
              <div className="border border-[rgba(216,208,200,0.7)] rounded-[10px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSandboxOption("netbanking")}
                  className={`w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-[#4a3d33] transition ${
                    sandboxOption === "netbanking" ? "bg-[#1c82e6]/5" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-[#1c82e6]" />
                    <div>
                      <span className="block font-bold">Netbanking</span>
                      <span className="text-[10px] text-[#8c7e72]">SBI, HDFC, ICICI, Axis</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8c7e72]" />
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-[8px] text-red-700 text-[10px] font-semibold text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleSandboxPaymentSubmit}
              disabled={loading || !sandboxOption}
              className="w-full py-3 bg-[#1c82e6] hover:bg-[#1670c9] text-white text-xs font-bold rounded-[10px] shadow transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Simulating Payment..." : `Pay ₹${amount}`}
            </button>

            <button
              onClick={() => setStep("input")}
              className="w-full py-2 text-center text-[10px] text-gray-500 font-semibold hover:underline"
            >
              Cancel & Go Back
            </button>
          </div>

          {/* Footer banner */}
          <div className="bg-[#f8f9fa] border-t border-[rgba(216,208,200,0.5)] px-4 py-2.5 flex items-center justify-center gap-1.5 text-[9px] text-[#8c7e72] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
            Secured by Razorpay API Integration
          </div>
        </div>
      )}

      {/* STEP 3: Payment Success screen */}
      {step === "success" && (
        <div className="bg-[#ffffff] rounded-[24px] shadow-[0_4px_30px_rgba(58,48,42,0.15)] border border-[rgba(216,208,200,0.8)] w-full max-w-sm overflow-hidden animate-scale-in text-center p-8 flex flex-col justify-center items-center space-y-6 min-h-[350px]">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center border-4 border-green-500 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none animate-ping opacity-25 bg-green-400 rounded-full -z-10"></div>
          </div>

          <div className="space-y-2">
            <h3 className="font-black text-2xl text-[#2a1f17]">Payment Successful</h3>
            <p className="text-xs text-[#8c7e72] font-semibold tracking-wider uppercase">
              Wallet Loaded via Razorpay
            </p>
          </div>

          <div className="bg-[#faf5ee] border border-[rgba(216,208,200,0.75)] rounded-[16px] p-4 w-full space-y-2 text-left shadow-inner">
            <div className="flex justify-between text-xs text-[#605850]">
              <span>Amount Deposited:</span>
              <span className="font-bold text-[#2a1f17]">₹{amount}</span>
            </div>
            <div className="flex justify-between text-xs text-[#605850]">
              <span>New Wallet Balance:</span>
              <span className="font-extrabold text-[#c2652a]">
                ₹{((user?.balance || 0) + Number(amount)).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            {reference && (
              <div className="flex justify-between text-[10px] text-[#8c7e72] pt-2 border-t border-[rgba(216,208,200,0.45)]">
                <span>Payment Ref:</span>
                <span className="font-mono text-[#2a1f17] select-all">{reference.slice(0, 18)}...</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-[12px] shadow-md transition transform active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
