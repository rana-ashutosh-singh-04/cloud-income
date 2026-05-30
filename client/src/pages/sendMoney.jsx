import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/card";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import {
  Send,
  User,
  Wallet,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  QrCode,
  UserPlus,
  Wifi,
  WifiOff,
} from "lucide-react";
import QRModal from "../components/QRMOdal";

export default function SendMoney() {
  const { user, setUser } = useAuth();
  const socket = useSocket();
  const [vpa, setVpa] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [recentContacts, setRecentContacts] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(""); // processing, success, failed

  // UPI PIN Modal states
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinReference, setPinReference] = useState("");

  useEffect(() => {
    loadRecentTransactions();
  }, []);

  // Listen for real-time transaction updates
  useEffect(() => {
    if (socket.lastTransaction) {
      setPaymentStatus("success");
      setStatus({
        type: "success",
        message: "Payment processed successfully!",
        reference: socket.lastTransaction.reference,
      });
      setVpa("");
      setAmount("");
      setNote("");
      setLoading(false);
      loadRecentTransactions();
      socket.clearTransaction();
    }
  }, [socket.lastTransaction, socket]);

  // Listen for real-time balance updates
 useEffect(() => {
  if (!socket.balanceUpdate) return;

  const newBalance = socket.balanceUpdate.balance;

  // 🛑 Guard against invalid balance
  if (typeof newBalance !== "number") {
    console.warn("Invalid balance update ignored:", newBalance);
    return;
  }

  setUser(prevUser => {
    if (!prevUser) return prevUser;

    // 🛑 Avoid unnecessary re-renders
    if (prevUser.balance === newBalance) {
      return prevUser;
    }

    const updatedUser = {
      ...prevUser,
      balance: newBalance,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  });
}, [socket.balanceUpdate, setUser, socket]);

  const loadRecentTransactions = async () => {
    try {
      const { data } = await api.get("/txn/recent");
      // Extract unique contacts from transactions
      const contacts = new Map();
      data.transactions.forEach((txn) => {
        if (txn.counterpartyName && !contacts.has(txn.counterpartyName)) {
          contacts.set(txn.counterpartyName, {
            name: txn.counterpartyName,
            lastTransaction: txn.createdAt,
          });
        }
      });
      setRecentContacts(Array.from(contacts.values()).slice(0, 5));
    } catch (error) {
      console.error("Error loading recent transactions:", error);
    }
  };

  const playSendChime = () => {
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
      playTone(783.99, 0, 0.25);
      playTone(1046.50, 0.12, 0.4);
    } catch (e) {
      console.warn("Chime playback failed", e);
    }
  };


  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    setPinSuccess(false);
    setPinReference("");

    const num = Number(amount);
    if (!vpa) {
      setStatus({ type: "error", message: "Receiver UPI ID or Phone Number is required" });
      return;
    }
    if (isNaN(num) || num <= 0) {
      setStatus({ type: "error", message: "Please enter a valid amount" });
      return;
    }

    setPinModalOpen(true);

    try {
      const { data } = await api.post("/txn/send", {
        vpa,
        amount: num,
        note,
        pin: "000000",
      });

      playSendChime();
      setPinSuccess(true);
      setPinReference(data.transaction.reference);
      
      // Update UI state (refresh recent transactions, clear note)
      setNote("");
      loadRecentTransactions();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Transaction failed.";
      setStatus({ type: "error", message: errorMessage });
      setPinModalOpen(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen bg-[#faf5ee]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2a1f17] mb-3">
            Send Money
          </h1>
          <p className="text-lg text-[#605850]">
            Transfer money instantly to anyone using UPI
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form - Left Column */}
          <div className="lg:col-span-2">
            <Card className="bg-[#ffffff] shadow-[0_2px_16px_rgba(58,48,42,0.06)] rounded-[16px] p-8 border border-[rgba(216,208,200,0.7)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#c2652a]/10 rounded-[12px] border border-[#c2652a]/20">
                    <Send className="w-6 h-6 text-[#c2652a]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#2a1f17]">New Payment</h2>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {socket.isConnected ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">Live</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-[#8c7e72]" />
                      <span className="text-[#8c7e72]">Offline</span>
                    </>
                  )}
                </div>
              </div>

              <form onSubmit={submit} className="space-y-6">
                {/* VPA Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#605850] mb-2">
                    Receiver UPI ID or Phone Number
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8c7e72]" />
                    <input
                      type="text"
                      value={vpa}
                      onChange={(e) => setVpa(e.target.value)}
                      placeholder="e.g., user@bank or 9876543210"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] text-lg transition"
                      required
                    />
                  </div>
                  <p className="text-xs text-[#8c7e72] mt-2">
                    Enter the receiver's UPI ID or phone number
                  </p>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#605850] mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#605850] font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-4 bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] text-lg font-semibold transition"
                      required
                    />
                  </div>
                  {/* Quick Amount Buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(amt.toString())}
                        className="px-4 py-2 bg-[#f3ece0] hover:bg-[#c2652a]/10 border border-[rgba(216,208,200,0.7)] hover:border-[#c2652a]/20 text-[#605850] hover:text-[#c2652a] rounded-[8px] font-medium transition text-sm"
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#605850] mb-2">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's this for?"
                    className="w-full px-4 py-4 bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] transition"
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
                        : status.type === "info"
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : "bg-[#8c3c3c]/10 border-[#8c3c3c]/20 text-[#8c3c3c]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {status.type === "success" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : status.type === "info" ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      <div>
                        <p className="font-semibold">{status.message}</p>
                        {status.reference && (
                          <p className="text-sm mt-1 opacity-80">
                            Reference: {status.reference}
                          </p>
                        )}
                        {paymentStatus === "processing" && socket.isConnected && (
                          <p className="text-xs mt-1 opacity-70">
                            Processing in real-time...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#c2652a] text-white rounded-[8px] font-bold text-lg hover:bg-[#a8541f] transition-all transform hover:scale-[1.02] shadow-[0_2px_16px_rgba(58,48,42,0.06)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Send Money <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* QR Code Option */}
            <Card className="bg-[#ffffff] shadow-[0_2px_16px_rgba(58,48,42,0.06)] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)]">
              <button
                onClick={() => setQrOpen(true)}
                className="w-full flex flex-col items-center justify-center p-6 bg-[#c2652a] text-white rounded-[8px] hover:bg-[#a8541f] transition transform hover:scale-105"
              >
                <QrCode className="w-10 h-10 mb-3" />
                <span className="font-semibold">Scan QR Code</span>
                <span className="text-xs opacity-90 mt-1">Pay via QR</span>
              </button>
            </Card>

            {/* Recent Contacts */}
            {recentContacts.length > 0 && (
              <Card className="bg-[#ffffff] shadow-[0_2px_16px_rgba(58,48,42,0.06)] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)]">
                <h3 className="font-bold text-lg text-[#2a1f17] mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#c2652a]" />
                  Recent Contacts
                </h3>
                <div className="space-y-2">
                  {recentContacts.map((contact, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // In a real app, this would set the VPA from contact
                        setVpa(contact.name + "@bank");
                      }}
                      className="w-full text-left p-3 bg-[#f3ece0] hover:bg-[#faf5ee] border border-transparent hover:border-[rgba(216,208,200,0.7)] rounded-[8px] transition flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-[#c2652a]/10 border border-[#c2652a]/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#c2652a]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#2a1f17] text-sm">
                          {contact.name}
                        </p>
                        <p className="text-xs text-[#8c7e72]">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Recent
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Help Card */}
            <Card className="bg-[#f3ece0] shadow-[0_2px_16px_rgba(58,48,42,0.06)] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)]">
              <h3 className="font-bold text-lg text-[#2a1f17] mb-2">Need Help?</h3>
              <p className="text-sm text-[#605850] mb-4">
                Make sure the UPI ID is correct before sending money.
              </p>
              <ul className="text-xs text-[#605850] space-y-1">
                <li>• Double-check the receiver's UPI ID</li>
                <li>• Keep your transaction reference number</li>
                <li>• Contact support if transaction fails</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />

      {/* UPI PIN Keypad Modal Overlay (Google Pay Theme) */}
      {pinModalOpen && (
        <div className="fixed inset-0 bg-[#2a1f17]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          {!pinSuccess ? (
            <div className="w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border-4 border-[#2a1f17] bg-white p-8 text-center flex flex-col justify-center items-center space-y-6 min-h-[350px] animate-scale-in">
              <div className="w-16 h-16 border-4 border-[#c2652a] border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h4 className="font-bold text-lg text-gray-900">Processing Transfer</h4>
                <p className="text-xs text-gray-500 mt-1">Sending funds securely...</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#ffffff] rounded-[24px] shadow-[0_4px_30px_rgba(58,48,42,0.15)] border border-[rgba(216,208,200,0.8)] w-full max-w-sm overflow-hidden animate-scale-in text-center p-8 flex flex-col justify-center items-center space-y-6 min-h-[350px]">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center border-4 border-green-500 animate-bounce">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none animate-ping opacity-25 bg-green-400 rounded-full -z-10"></div>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-2xl text-[#2a1f17]">Money Sent Successfully</h3>
                <p className="text-xs text-[#8c7e72] font-semibold tracking-wider uppercase">
                  P2P UPI TRANSFER
                </p>
              </div>

              <div className="bg-[#faf5ee] border border-[rgba(216,208,200,0.75)] rounded-[16px] p-4 w-full space-y-2 text-left shadow-inner">
                <div className="flex justify-between text-xs text-[#605850]">
                  <span>Sent To:</span>
                  <span className="font-bold text-[#2a1f17]">{vpa}</span>
                </div>
                <div className="flex justify-between text-xs text-[#605850]">
                  <span>Amount Sent:</span>
                  <span className="font-bold text-red-600">-₹{amount}</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#8c7e72] pt-2 border-t border-[rgba(216,208,200,0.45)]">
                  <span>Transaction UTR:</span>
                  <span className="font-mono text-[#2a1f17] select-all">{pinReference.slice(0, 18)}...</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPinModalOpen(false);
                  setPinSuccess(false);
                  setVpa("");
                  setAmount("");
                }}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-[12px] shadow-md transition transform active:scale-95 cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
