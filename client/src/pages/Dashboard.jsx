import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TransactionItem from "../components/TransactionItem";
import QRModal from "../components/QRMOdal";
import PaymentNotification from "../components/PaymentNotification";
import Card from "../components/card";
import MoneyTile from "../components/MoneyTitle";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { 
  Send, QrCode, Scan, ArrowUpRight, ArrowDownRight, 
  TrendingUp, TrendingDown, Wallet, Gift, Coins, 
  BarChart3, PieChart, Calendar, Filter, Search,
  CreditCard, Receipt, Smartphone, Zap, Building2
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
  const [filter, setFilter] = useState("all"); // all, debit, credit
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  // Listen for real-time transaction updates
  useEffect(() => {
    if (socket.lastTransaction) {
      // Add new transaction to the list
      setTxns((prev) => [socket.lastTransaction, ...prev]);
      socket.clearTransaction();
    }
  }, [socket.lastTransaction]);

  // Listen for real-time balance updates
  useEffect(() => {
    if (socket.balanceUpdate && profile) {
      const updatedProfile = { ...profile, balance: socket.balanceUpdate.balance };
      setProfile(updatedProfile);
      if (user) {
        setUser({ ...user, balance: socket.balanceUpdate.balance });
        localStorage.setItem("user", JSON.stringify({ ...user, balance: socket.balanceUpdate.balance }));
      }
    }
  }, [socket.balanceUpdate, profile, user, setUser]);

  const loadData = async () => {
    try {
      const [{ data: me }, { data: list }] = await Promise.all([
        api.get("/auth/me"),
        api.get("/txn/recent"),
      ]);
      setProfile(me.user);
      setTxns(list.transactions);

      // Load stock holdings if available
      try {
        const { data: stocks } = await api.get("/stocks/holdings");
        setStockHoldings(stocks.holdings);
      } catch (e) {
        // Stocks might not be available, ignore
      }
    } catch (e) {
      console.error(e);
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

  // Calculate portfolio value
  const portfolioValue = stockHoldings.reduce((sum, h) => sum + (h.totalValue || 0), 0);
  const portfolioProfitLoss = stockHoldings.reduce((sum, h) => sum + (h.profitLoss || 0), 0);

  // Spending categories (mock data based on transaction notes)
  const categories = [
    { name: "Food & Dining", amount: stats.monthlySpent * 0.3, color: "#f59e0b" },
    { name: "Shopping", amount: stats.monthlySpent * 0.25, color: "#8b5cf6" },
    { name: "Bills & Utilities", amount: stats.monthlySpent * 0.2, color: "#3b82f6" },
    { name: "Transport", amount: stats.monthlySpent * 0.15, color: "#10b981" },
    { name: "Entertainment", amount: stats.monthlySpent * 0.1, color: "#ec4899" },
  ].filter((c) => c.amount > 0);

  const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm opacity-90 mb-2">Welcome back,</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {profile?.name || "User"}
              </h1>
              <p className="text-lg opacity-90">Here's your financial overview</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Total Balance</p>
              <p className="text-4xl md:text-5xl font-bold">
                ₹{Number(profile?.balance || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-red-100 rounded-xl">
                <ArrowDownRight className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs text-gray-500">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats.monthlySpent.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total Spent</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-100 rounded-xl">
                <ArrowUpRight className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats.totalReceived.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total Received</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">All Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.transactionCount}</p>
            <p className="text-xs text-gray-600 mt-1">Transactions</p>
          </div>

          {portfolioValue > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500">Portfolio</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{portfolioValue.toLocaleString("en-IN")}
              </p>
              <p className={`text-xs mt-1 ${portfolioProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                {portfolioProfitLoss >= 0 ? "+" : ""}
                ₹{Math.abs(portfolioProfitLoss).toLocaleString("en-IN")}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-xl mb-6 text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/send")}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Send className="w-8 h-8 mb-2" />
              <span className="font-semibold">Send Money</span>
            </button>

            <button
              onClick={() => setQrOpen(true)}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <QrCode className="w-8 h-8 mb-2" />
              <span className="font-semibold">Receive</span>
            </button>

            <button
              onClick={() => navigate("/bills")}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Receipt className="w-8 h-8 mb-2" />
              <span className="font-semibold">Pay Bills</span>
            </button>

            <button
              onClick={() => navigate("/stocks")}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl hover:from-indigo-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <TrendingUp className="w-8 h-8 mb-2" />
              <span className="font-semibold">Stocks</span>
            </button>
          </div>
        </Card>

        {/* Charts and Analytics */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Spending Chart */}
          <Card className="shadow-lg rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Monthly Spending
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Spent"]}
                />
                <Line
                  type="monotone"
                  dataKey="spent"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Spending Categories */}
          {categories.length > 0 && (
            <Card className="shadow-lg rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-xl mb-6 text-gray-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                Spending Categories
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        {/* Portfolio Summary (if stocks exist) */}
        {stockHoldings.length > 0 && (
          <Card className="shadow-lg rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Stock Portfolio
              </h3>
              <button
                onClick={() => navigate("/stocks")}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                View All →
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {stockHoldings.slice(0, 3).map((holding) => (
                <div
                  key={holding.symbol}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{holding.symbol}</h4>
                    <span
                      className={`text-sm font-semibold ${
                        holding.profitLossPercent >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {holding.profitLossPercent >= 0 ? "+" : ""}
                      {holding.profitLossPercent.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{holding.companyName}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Qty: {holding.quantity}</span>
                    <span className="font-semibold text-gray-900">
                      ₹{holding.totalValue.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Transactions Section */}
        <Card className="shadow-lg rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Recent Transactions
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {/* Filter */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                    filter === "all"
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("debit")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                    filter === "debit"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sent
                </button>
                <button
                  onClick={() => setFilter("credit")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                    filter === "credit"
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Received
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredTxns.length > 0 ? (
              filteredTxns.map((txn) => (
                <TransactionItem key={txn.id || txn._id} txn={txn} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p className="text-sm">No transactions found</p>
              </div>
            )}
          </div>
        </Card>
      </main>

      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
      <PaymentNotification
        payment={socket.paymentReceived}
        onClose={socket.clearPaymentNotification}
      />
    </div>
  );
}
