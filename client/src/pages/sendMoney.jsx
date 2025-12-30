import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Search,
  UserPlus,
  Wifi,
  WifiOff,
} from "lucide-react";
import QRModal from "../components/QRMOdal";

export default function SendMoney() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();
  const [vpa, setVpa] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [recentContacts, setRecentContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(""); // processing, success, failed

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
  }, [socket.lastTransaction]);

  // Listen for real-time balance updates
  useEffect(() => {
    if (socket.balanceUpdate && user) {
      setUser({ ...user, balance: socket.balanceUpdate.balance });
      // Update localStorage
      const updatedUser = { ...user, balance: socket.balanceUpdate.balance };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }, [socket.balanceUpdate, user, setUser]);

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

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    setPaymentStatus("processing");
    setLoading(true);

    try {
      const { data } = await api.post("/txn/send", {
        vpa,
        amount: Number(amount),
        note,
      });
      
      // Real-time update will be handled by WebSocket
      // But show immediate feedback
      setPaymentStatus("processing");
      setStatus({
        type: "info",
        message: "Processing payment...",
        reference: data.transaction.reference,
      });
      
      // Wait a moment for WebSocket to update
      setTimeout(() => {
        if (paymentStatus !== "success") {
          setStatus({
            type: "success",
            message: "Money sent successfully!",
            reference: data.transaction.reference,
          });
          setVpa("");
          setAmount("");
          setNote("");
          setPaymentStatus("");
          setLoading(false);
          loadRecentTransactions();
        }
      }, 1000);
    } catch (err) {
      setPaymentStatus("failed");
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message || "Transaction failed";
      setStatus({
        type: "error",
        message: errorMessage,
      });
      console.error("Transaction error:", err?.response?.data || err);
      setLoading(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Send Money
          </h1>
          <p className="text-lg text-gray-600">
            Transfer money instantly to anyone using UPI
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form - Left Column */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Send className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">New Payment</h2>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {socket.isConnected ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">Live</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Offline</span>
                    </>
                  )}
                </div>
              </div>

              <form onSubmit={submit} className="space-y-6">
                {/* VPA Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Receiver UPI ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={vpa}
                      onChange={(e) => setVpa(e.target.value)}
                      placeholder="e.g., user@bank"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the receiver's UPI ID or phone number
                  </p>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
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
                        className="px-4 py-2 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-lg font-medium transition text-sm"
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's this for?"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        : status.type === "info"
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : "bg-red-50 border-red-200 text-red-800"
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
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <Card className="shadow-xl rounded-2xl p-6 border border-gray-100">
              <button
                onClick={() => setQrOpen(true)}
                className="w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition transform hover:scale-105"
              >
                <QrCode className="w-10 h-10 mb-3" />
                <span className="font-semibold">Scan QR Code</span>
                <span className="text-xs opacity-90 mt-1">Pay via QR</span>
              </button>
            </Card>

            {/* Recent Contacts */}
            {recentContacts.length > 0 && (
              <Card className="shadow-xl rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-600" />
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
                      className="w-full text-left p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {contact.name}
                        </p>
                        <p className="text-xs text-gray-500">
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
            <Card className="shadow-xl rounded-2xl p-6 border border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Make sure the UPI ID is correct before sending money.
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Double-check the receiver's UPI ID</li>
                <li>• Keep your transaction reference number</li>
                <li>• Contact support if transaction fails</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
}
