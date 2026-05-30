import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import TransactionItem from "../components/TransactionItem";
import QRModal from "../components/QRMOdal";
import UPICheckoutModal from "../components/UPICheckoutModal";
import WithdrawModal from "../components/WithdrawModal";
import PaymentNotification from "../components/PaymentNotification";
import Card from "../components/card";
import MoneyTile from "../components/MoneyTitle";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import {
  Send, QrCode, Scan, ArrowUpRight, ArrowDownLeft,
  TrendingUp, TrendingDown, Wallet, Gift, Coins,
  BarChart3, PieChart, Calendar, Filter, Search,
  CreditCard, Receipt, Smartphone, Zap, Building2,
  Briefcase, ShieldCheck, User, Copy, Check, ExternalLink
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const socket = useSocket();
  const [profile, setProfile] = useState(null);
  const [txns, setTxns] = useState([]);
  const [stockHoldings, setStockHoldings] = useState([]);
  const [qrOpen, setQrOpen] = useState(false);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // all, debit, credit
  const [searchQuery, setSearchQuery] = useState("");
  const [freelanceStats, setFreelanceStats] = useState({ activeGigs: 0, lockedEscrow: 0, completedGigs: 0 });
  const [copiedVpa, setCopiedVpa] = useState(false);

  useEffect(() => {
    loadData();
    // Load freelance stats from local storage
    try {
      const savedProjects = localStorage.getItem("freelance_projects");
      const escrow = localStorage.getItem("freelance_escrow_balance");
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        const currentUsername = user ? user.name : "You (Guest Student)";
        const active = parsed.filter(p => p.freelancerName === currentUsername && p.status === "IN_PROGRESS").length;
        const completed = parsed.filter(p => p.freelancerName === currentUsername && p.status === "COMPLETED").length;
        setFreelanceStats({
          activeGigs: active,
          completedGigs: completed,
          lockedEscrow: escrow ? Number(escrow) : 0
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  // Listen for real-time transaction updates
  useEffect(() => {
    if (socket.lastTransaction) {
      setTxns((prev) => [socket.lastTransaction, ...prev]);
      socket.clearTransaction();
    }
  }, [socket.lastTransaction, socket]);

  // Listen for real-time balance updates
  useEffect(() => {
    if (socket.balanceUpdate) {
      const newBalance = socket.balanceUpdate.balance;
      setProfile((prev) => {
        if (!prev) return prev;
        if (prev.balance === newBalance) return prev;
        return { ...prev, balance: newBalance };
      });
      setUser((prev) => {
        if (!prev) return prev;
        if (prev.balance === newBalance) return prev;
        const updated = { ...prev, balance: newBalance };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });
    }
  }, [socket.balanceUpdate, setUser]);

  const loadData = async () => {
    try {
      const [{ data: me }, { data: list }] = await Promise.all([
        api.get("/auth/me"),
        api.get("/txn/recent"),
      ]);
      setProfile(me.user);
      setTxns(list.transactions);

      try {
        const { data: stocks } = await api.get("/stocks/holdings");
        setStockHoldings(stocks.holdings);
      } catch {
        // Stocks might not be available
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyVpaToClipboard = () => {
    if (profile?.vpa) {
      navigator.clipboard.writeText(profile.vpa);
      setCopiedVpa(true);
      setTimeout(() => setCopiedVpa(false), 2000);
    }
  };

  // Calculate statistics
  const stats = {
    totalSpent: txns
      .filter((t) => t.type === "DEBIT")
      .reduce((sum, t) => sum + t.amount, 0),
    totalReceived: txns
      .filter((t) => t.type === "CREDIT")
      .reduce((sum, t) => sum + t.amount, 0),
    transactionCount: txns.length,
    monthlySpent: txns
      .filter((t) => {
        const txnDate = new Date(t.createdAt);
        const now = new Date();
        return (
          t.type === "DEBIT" &&
          txnDate.getMonth() === now.getMonth() &&
          txnDate.getFullYear() === now.getFullYear()
        )
      })
      .reduce((sum, t) => sum + t.amount, 0),
  };

  // Generate monthly spending data for chart
  const monthlyData = (() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString("default", { month: "short" });
      const spent = txns
        .filter((t) => {
          const txnDate = new Date(t.createdAt);
          return (
            t.type === "DEBIT" &&
            txnDate.getMonth() === date.getMonth() &&
            txnDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);
      months.push({ month: monthName, spent });
    }
    return months;
  })();

  // Filter transactions
  const filteredTxns = txns.filter((txn) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "debit" && txn.type === "DEBIT") ||
      (filter === "credit" && txn.type === "CREDIT");
    const matchesSearch =
      !searchQuery ||
      txn.counterpartyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.note?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });



  const categories = [
    { name: "Food & Dining", amount: stats.monthlySpent * 0.3, color: "#f59e0b" },
    { name: "Shopping", amount: stats.monthlySpent * 0.25, color: "#8b5cf6" },
    { name: "Bills & Utilities", amount: stats.monthlySpent * 0.2, color: "#3b82f6" },
    { name: "Transport", amount: stats.monthlySpent * 0.15, color: "#10b981" },
    { name: "Entertainment", amount: stats.monthlySpent * 0.1, color: "#ec4899" },
  ].filter((c) => c.amount > 0);

  const CHART_COLORS = ["#c2652a", "#a8541f", "#9fb093", "#8c7e72", "#605850"];

  return (
    <div className="min-h-screen bg-[#faf5ee]">
      <Navbar />

      <style>{`
        @keyframes floatGradient {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.15); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .mesh-blob-1 {
          animation: floatGradient 12s infinite alternate ease-in-out;
        }
        .mesh-blob-2 {
          animation: floatGradient 16s infinite alternate-reverse ease-in-out;
        }
        .mesh-blob-3 {
          animation: floatGradient 10s infinite alternate ease-in-out;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
      `}</style>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* ASYMMETRIC GRID SYSTEM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT 2/3 COLUMN: Main Wallet & Analytics */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* STUNNING GLOWING MESH HEADER */}
            <div className="relative rounded-[28px] overflow-hidden shadow-xl border border-[rgba(216,208,200,0.7)] bg-white min-h-[220px] flex items-center">
              {/* Mesh background blobs */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
                <div className="mesh-blob-1 absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#c2652a] to-[#a8541f] blur-3xl"></div>
                <div className="mesh-blob-2 absolute -bottom-20 right-10 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#9fb093] to-[#8fa482] blur-3xl"></div>
                <div className="mesh-blob-3 absolute top-10 left-1/3 w-[250px] h-[250px] rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 blur-3xl"></div>
              </div>

              {/* Glass container overlay */}
              <div className="relative z-10 w-full p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/45 backdrop-blur-md">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#c2652a] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                      {profile?.name ? profile.name.charAt(0) : <User className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-xs text-[#8c7e72] font-bold uppercase tracking-wider">Welcome Back,</p>
                      <h1 className="text-2xl font-bold text-[#2a1f17] font-serif">{profile?.name || "User"}</h1>
                    </div>
                  </div>
                  
                  {profile?.vpa && (
                    <div className="inline-flex items-center gap-2 bg-[#f3ece0] border border-[rgba(216,208,200,0.7)] px-3 py-1.5 rounded-full text-xs text-[#605850]">
                      <span className="font-semibold">{profile.vpa}</span>
                      <button 
                        onClick={copyVpaToClipboard} 
                        className="text-[#c2652a] hover:text-[#a8541f] transition active:scale-90"
                        title="Copy UPI ID"
                      >
                        {copiedVpa ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-left md:text-right flex flex-col items-start md:items-end">
                  <p className="text-xs text-[#8c7e72] font-bold uppercase tracking-wider mb-1">Available Wallet Balance</p>
                  <p className="text-4xl md:text-5xl font-bold text-[#2a1f17] tracking-tight mb-4 font-serif">
                    ₹{Number(profile?.balance || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setAddMoneyOpen(true)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#c2652a] text-white font-bold rounded-full hover:bg-[#a8541f] transition shadow-sm active:scale-95 text-xs"
                    >
                      <Wallet className="w-4 h-4" />
                      Add Balance
                    </button>
                    <button
                      onClick={() => setWithdrawOpen(true)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-[#c2652a] border border-[#c2652a]/20 font-bold rounded-full hover:bg-[#faf5ee] transition shadow-sm active:scale-95 text-xs"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* HIGH-FIDELITY STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[rgba(216,208,200,0.7)] hover:shadow-md transition duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-[#c2652a]/10 rounded-xl text-[#c2652a]">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#8c7e72] font-bold uppercase tracking-wider">This Month</span>
                </div>
                <p className="text-2xl font-bold text-[#2a1f17] font-serif">
                  ₹{stats.monthlySpent.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-[#605850] mt-1">Total Expenses</p>
              </div>

              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[rgba(216,208,200,0.7)] hover:shadow-md transition duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-[#c2652a]/10 rounded-xl text-[#c2652a]">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#8c7e72] font-bold uppercase tracking-wider">Payments In</span>
                </div>
                <p className="text-2xl font-bold text-[#2a1f17] font-serif">
                  ₹{stats.totalReceived.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-[#605850] mt-1">Total Earnings</p>
              </div>

              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[rgba(216,208,200,0.7)] hover:shadow-md transition duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-[#c2652a]/10 rounded-xl text-[#c2652a]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#8c7e72] font-bold uppercase tracking-wider">Active Gigs</span>
                </div>
                <p className="text-2xl font-bold text-[#2a1f17] font-serif">
                  {freelanceStats.activeGigs}
                </p>
                <p className="text-xs text-[#605850] mt-1">Contracts In Progress</p>
              </div>

              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[rgba(216,208,200,0.7)] hover:shadow-md transition duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-[#c2652a]/10 rounded-xl text-green-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#8c7e72] font-bold uppercase tracking-wider">Locked Escrow</span>
                </div>
                <p className="text-2xl font-bold text-green-600 font-serif">
                  ₹{freelanceStats.lockedEscrow.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-[#605850] mt-1">Held Payments</p>
              </div>
            </div>

            {/* MONTHLY SPENDING CHART CARD */}
            <Card className="bg-white rounded-[24px] p-6 border border-[rgba(216,208,200,0.7)] shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-[rgba(216,208,200,0.3)] pb-4">
                <h3 className="font-bold text-lg text-[#2a1f17] font-serif flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#c2652a]" />
                  Spending Analytics
                </h3>
                <span className="text-xs text-[#8c7e72] font-semibold">Monthly Outflow Trend</span>
              </div>
              <div className="w-full">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(216,208,200,0.4)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8c7e72" }} />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#8c7e72" }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Debited"]}
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "rgba(216,208,200,0.7)", borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="spent"
                      stroke="#c2652a"
                      strokeWidth={3.5}
                      dot={{ fill: "#c2652a", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* RECENT TRANSACTIONS STREAM */}
            <Card className="bg-white rounded-[24px] p-6 border border-[rgba(216,208,200,0.7)] shadow-sm">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4 border-b border-[rgba(216,208,200,0.3)] pb-4">
                <h3 className="font-bold text-lg text-[#2a1f17] font-serif flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#c2652a]" />
                  Transaction Stream
                </h3>
                
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c7e72]" />
                    <input
                      type="text"
                      placeholder="Filter transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 bg-[#faf5ee] border border-[rgba(216,208,200,0.7)] rounded-full text-[#4a3d33] placeholder-[#8c7e72] text-xs focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none transition w-[160px] sm:w-[200px]"
                    />
                  </div>
                  
                  {/* Filter tabs */}
                  <div className="flex items-center bg-[#f3ece0]/60 rounded-full p-0.5 border border-[rgba(216,208,200,0.7)]">
                    {["all", "debit", "credit"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition ${filter === f
                          ? "bg-[#c2652a] text-white shadow-sm"
                          : "text-[#605850] hover:text-[#2a1f17]"
                        }`}
                      >
                        {f === "all" ? "All" : f === "debit" ? "Out" : "In"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {filteredTxns.length > 0 ? (
                  filteredTxns.map((txn) => (
                    <TransactionItem key={txn.id || txn._id} txn={txn} />
                  ))
                ) : (
                  <div className="text-center text-[#8c7e72] py-12 italic text-sm">
                    No transactions found in this query.
                  </div>
                )}
              </div>
            </Card>

          </div>

          {/* RIGHT 1/3 COLUMN: Actions, Gigs Workspace & Portfolios */}
          <div className="space-y-8 lg:col-span-1">
            
            {/* PREMIUM QUICK ACTIONS */}
            <Card className="bg-white rounded-[24px] p-6 border border-[rgba(216,208,200,0.7)] shadow-sm">
              <h3 className="font-bold text-lg text-[#2a1f17] font-serif flex items-center gap-2 mb-6 border-b border-[rgba(216,208,200,0.3)] pb-4">
                <Zap className="w-5 h-5 text-[#c2652a]" />
                Quick Operations
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/send")}
                  className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-[#c2652a] to-[#a8541f] text-white rounded-2xl hover:shadow-lg transition-all transform hover:scale-[1.03] duration-200"
                >
                  <Send className="w-6 h-6 mb-2" />
                  <span className="text-xs font-semibold">Send UPI</span>
                </button>

                <button
                  onClick={() => setQrOpen(true)}
                  className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-[#9fb093] to-[#8fa482] text-white rounded-2xl hover:shadow-lg transition-all transform hover:scale-[1.03] duration-200"
                >
                  <QrCode className="w-6 h-6 mb-2" />
                  <span className="text-xs font-semibold">My QR</span>
                </button>

                <button
                  onClick={() => navigate("/our-solutions")}
                  className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-[#c2652a]/80 to-[#a8541f]/75 text-white rounded-2xl hover:shadow-lg transition-all transform hover:scale-[1.03] duration-200"
                >
                  <Briefcase className="w-6 h-6 mb-2" />
                  <span className="text-xs font-semibold">Freelance Gigs</span>
                </button>

                <button
                  onClick={() => navigate("/bills")}
                  className="flex flex-col items-center justify-center p-5 bg-[#faf5ee] border border-[rgba(216,208,200,0.7)] text-[#4a3d33] rounded-2xl hover:bg-[#faf5ee]/40 transition-all transform hover:scale-[1.03] duration-200"
                >
                  <Receipt className="w-6 h-6 mb-2 text-[#c2652a]" />
                  <span className="text-xs font-semibold">Pay Bills</span>
                </button>

                <button
                  onClick={() => navigate("/stocks")}
                  className="flex flex-col items-center justify-center p-5 bg-[#faf5ee] border border-[rgba(216,208,200,0.7)] text-[#4a3d33] rounded-2xl hover:bg-[#faf5ee]/40 transition-all transform hover:scale-[1.03] duration-200"
                >
                  <TrendingUp className="w-6 h-6 mb-2 text-[#c2652a]" />
                  <span className="text-xs font-semibold">Stock Market</span>
                </button>

                <button
                  onClick={() => navigate("/recharge")}
                  className="flex flex-col items-center justify-center p-5 bg-[#faf5ee] border border-[rgba(216,208,200,0.7)] text-[#4a3d33] rounded-2xl hover:bg-[#faf5ee]/40 transition-all transform hover:scale-[1.03] duration-200"
                >
                  <Smartphone className="w-6 h-6 mb-2 text-[#c2652a]" />
                  <span className="text-xs font-semibold">Recharges</span>
                </button>
              </div>
            </Card>

            {/* FREELANCE ECOSYSTEM CONSOLE */}
            <Card className="bg-[#f3ece0]/40 border border-[rgba(216,208,200,0.7)] rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-[rgba(216,208,200,0.5)] pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#c2652a]" />
                  <h4 className="font-bold text-sm text-[#2a1f17] font-serif">Freelance Summary</h4>
                </div>
                <Link to="/our-solutions" className="text-xs font-bold text-[#c2652a] hover:underline flex items-center gap-0.5">
                  <span>Workspace</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              
              <div className="space-y-4 text-xs text-[#605850]">
                <div className="flex justify-between items-center">
                  <span>Simulated Active Gigs:</span>
                  <span className="font-bold text-[#2a1f17]">{freelanceStats.activeGigs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completed Contracts:</span>
                  <span className="font-bold text-[#2a1f17]">{freelanceStats.completedGigs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Locked in Milestone Escrow:</span>
                  <span className="font-bold text-green-600">₹{freelanceStats.lockedEscrow.toLocaleString("en-IN")}</span>
                </div>
                
                <div className="bg-white border border-[rgba(216,208,200,0.6)] rounded-xl p-3.5 text-[11px] leading-relaxed text-[#8c7e72]">
                  <p className="font-bold text-[#c2652a] mb-1">💡 Payment Escrow Security</p>
                  Post a freelance project in Client mode to fund the milestone contract and secure payouts for student developers.
                </div>
              </div>
            </Card>

            {/* STOCKS PORTFOLIO PANEL */}
            {stockHoldings.length > 0 && (
              <Card className="bg-white rounded-[24px] p-6 border border-[rgba(216,208,200,0.7)] shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-[rgba(216,208,200,0.3)] pb-3">
                  <h3 className="font-bold text-sm text-[#2a1f17] font-serif flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#c2652a]" />
                    Invested Portfolio
                  </h3>
                  <button
                    onClick={() => navigate("/stocks")}
                    className="text-[#c2652a] hover:text-[#a8541f] font-bold text-xs transition"
                  >
                    Details →
                  </button>
                </div>
                <div className="space-y-3">
                  {stockHoldings.slice(0, 3).map((holding) => (
                    <div
                      key={holding.symbol}
                      className="bg-[#faf5ee] rounded-xl p-3.5 border border-[rgba(216,208,200,0.5)] flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-[#2a1f17]">{holding.symbol}</h4>
                        <p className="text-[10px] text-[#8c7e72] mt-0.5">{holding.quantity} Shares</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xs text-[#2a1f17]">
                          ₹{holding.totalValue.toLocaleString("en-IN")}
                        </span>
                        <p className={`text-[10px] font-semibold mt-0.5 ${holding.profitLossPercent >= 0 ? "text-green-600" : "text-[#8c3c3c]"}`}>
                          {holding.profitLossPercent >= 0 ? "▲ +" : "▼ "}
                          {holding.profitLossPercent.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* CATEGORY OUTFLOW SPENDING */}
            {categories.length > 0 && (
              <Card className="bg-white rounded-[24px] p-6 border border-[rgba(216,208,200,0.7)] shadow-sm">
                <h3 className="font-bold text-sm text-[#2a1f17] font-serif flex items-center gap-2 mb-4 border-b border-[rgba(216,208,200,0.3)] pb-3">
                  <PieChart className="w-4 h-4 text-[#c2652a]" />
                  Category Outflow
                </h3>
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={180}>
                    <RechartsPieChart>
                      <Tooltip
                        formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                        contentStyle={{ backgroundColor: "#ffffff", borderColor: "rgba(216,208,200,0.7)", borderRadius: "10px", fontSize: "11px" }}
                      />
                      <Pie
                        data={categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="amount"
                      >
                        {categories.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  
                  {/* Custom Legend */}
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[rgba(216,208,200,0.2)] text-[10px] text-[#605850]">
                    {categories.slice(0, 4).map((entry, idx) => (
                      <div key={entry.name} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                        <span className="truncate">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

          </div>

        </div>
      </main>

      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
      <UPICheckoutModal open={addMoneyOpen} onClose={() => setAddMoneyOpen(false)} />
      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} onWithdrawSuccess={loadData} />
      <PaymentNotification
        payment={socket.paymentReceived}
        onClose={socket.clearPaymentNotification}
      />
    </div>
  );
}
