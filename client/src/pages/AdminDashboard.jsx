import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/card";
import { api } from "../lib/api";
import {
  Users as UsersIcon,
  Wallet,
  TrendingUp,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Search,
  Award,
  CircleDot,
  CheckCircle2,
  XCircle,
  TrendingDown
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stockTransactions, setStockTransactions] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search filters
  const [userQuery, setUserQuery] = useState("");
  const [txnQuery, setTxnQuery] = useState("");
  const [stockQuery, setStockQuery] = useState("");

  // User edit modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [balanceForm, setBalanceForm] = useState({ balance: 0, rewards: 0, gold: 0 });

  // Stock forms state
  const [editingStock, setEditingStock] = useState(null);
  const [stockForm, setStockForm] = useState({ symbol: "", name: "", price: "" });
  const [isAddingStock, setIsAddingStock] = useState(false);

  // Promotion form state
  const [promoteQuery, setPromoteQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, txnRes, stockRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/transactions"),
        api.get("/stocks/market") // available to both user & admin
      ]);
      setUsers(usersRes.data.users || []);
      setTransactions(txnRes.data.transactions || []);
      setStockTransactions(txnRes.data.stockTransactions || []);
      setStocks(stockRes.data.stocks || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  };

  // User Actions
  const handleEditUser = (u) => {
    setSelectedUser(u);
    setBalanceForm({ balance: u.balance, rewards: u.rewards, gold: u.gold });
  };

  const handleUpdateBalance = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const { data } = await api.put(`/admin/users/${selectedUser._id}/balance`, balanceForm);
      setUsers(users.map(u => u._id === selectedUser._id ? { ...u, ...balanceForm } : u));
      setSelectedUser(null);
      showSuccessMessage(data.message || "User resources updated successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update balance");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This will remove all their transactions and stock portfolios.")) return;
    try {
      const { data } = await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      showSuccessMessage(data.message || "User deleted successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const handlePromoteUser = async (e) => {
    e.preventDefault();
    if (!promoteQuery.trim()) return;
    try {
      const { data } = await api.post("/admin/promote", { phoneOrVpa: promoteQuery });
      setUsers(users.map(u => u.phone === data.user.phone || u.vpa === data.user.vpa ? { ...u, isAdmin: true } : u));
      setPromoteQuery("");
      showSuccessMessage(data.message || "User promoted to admin");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to promote user");
    }
  };

  // Stock Actions
  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/admin/stocks", stockForm);
      setStocks([...stocks, data.stock]);
      setStockForm({ symbol: "", name: "", price: "" });
      setIsAddingStock(false);
      showSuccessMessage(data.message || "Stock added successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add stock");
    }
  };

  const handleEditStockPrice = (st) => {
    setEditingStock(st);
    setStockForm({ symbol: st.symbol, name: st.companyName, price: st.currentPrice });
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!editingStock) return;
    try {
      const { data } = await api.put(`/admin/stocks/${editingStock.symbol}`, {
        name: stockForm.name,
        price: stockForm.price
      });
      setStocks(stocks.map(s => s.symbol === editingStock.symbol ? data.stock : s));
      setEditingStock(null);
      setStockForm({ symbol: "", name: "", price: "" });
      showSuccessMessage(data.message || "Stock updated successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update stock");
    }
  };

  const handleDeleteStock = async (symbol) => {
    if (!window.confirm(`Are you sure you want to delete ${symbol} from the market?`)) return;
    try {
      const { data } = await api.delete(`/admin/stocks/${symbol}`);
      setStocks(stocks.filter(s => s.symbol !== symbol));
      showSuccessMessage(data.message || "Stock deleted successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete stock");
    }
  };

  // Filtered lists
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
      u.phone.includes(userQuery) ||
      u.vpa.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredTxns = transactions.filter(
    (t) =>
      t.counterpartyName.toLowerCase().includes(txnQuery.toLowerCase()) ||
      t.reference?.toLowerCase().includes(txnQuery.toLowerCase()) ||
      (t.sender?.name && t.sender.name.toLowerCase().includes(txnQuery.toLowerCase())) ||
      (t.receiver?.name && t.receiver.name.toLowerCase().includes(txnQuery.toLowerCase()))
  );

  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(stockQuery.toLowerCase()) ||
      s.companyName.toLowerCase().includes(stockQuery.toLowerCase())
  );

  // Stats Calculations
  const totalUsers = users.length;
  const totalBalance = users.reduce((acc, u) => acc + (u.balance || 0), 0);
  const totalGold = users.reduce((acc, u) => acc + (u.gold || 0), 0);
  const totalRewards = users.reduce((acc, u) => acc + (u.rewards || 0), 0);
  const platformTrades = stockTransactions.length;
  const transactionVolume = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

  // Chart Data preparation
  const userDistributionData = [
    { name: "Super Admins", value: users.filter(u => u.isAdmin).length },
    { name: "Regular Users", value: users.filter(u => !u.isAdmin).length }
  ];
  const COLORS = ["#c2652a", "#d9b48f"];

  const topStocksData = stocks
    .slice(0, 5)
    .map(s => ({ name: s.symbol, Price: s.currentPrice }));

  return (
    <div className="min-h-screen flex flex-col bg-[#faf5ee]">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2a1f17] tracking-tight">Super Admin Panel</h1>
            <p className="text-sm text-[#8c7e72]">Monitor app transactions, manage user balances, promote roles, and trade settings.</p>
          </div>
          
          {/* Quick Promote Bar */}
          <form onSubmit={handlePromoteUser} className="flex gap-2 bg-[#ffffff] p-1.5 rounded-full border border-[rgba(216,208,200,0.7)] shadow-sm self-start">
            <input
              value={promoteQuery}
              onChange={(e) => setPromoteQuery(e.target.value)}
              placeholder="Promote by Phone / VPA"
              className="bg-transparent text-sm px-4 py-1.5 focus:outline-none placeholder-[#8c7e72] text-[#4a3d33]"
              required
            />
            <button className="bg-[#c2652a] text-white hover:bg-[#a55220] px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer">
              Promote
            </button>
          </form>
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-[#8c3c3c]/20 bg-[#8c3c3c]/5 text-[#8c3c3c] text-sm font-semibold flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="hover:opacity-75 cursor-pointer">Close</button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 text-sm font-semibold flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => setSuccess("")} className="hover:opacity-75 cursor-pointer">Close</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[rgba(216,208,200,0.5)] mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: CircleDot },
            { id: "users", label: "User Management", icon: UsersIcon },
            { id: "txns", label: "Transactions Log", icon: FileText },
            { id: "stocks", label: "Market Stocks", icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all cursor-pointer ${
                  active
                    ? "border-[#c2652a] text-[#c2652a]"
                    : "border-transparent text-[#8c7e72] hover:text-[#2a1f17]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* -------------------- TAB CONTENT: OVERVIEW -------------------- */}
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Stat Cards */}
            <Card className="bg-white border border-[rgba(216,208,200,0.7)] p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#8c7e72] uppercase tracking-wider">Total Users</p>
                <h3 className="text-2xl font-bold text-[#2a1f17] mt-1">{totalUsers}</h3>
              </div>
              <div className="p-3 bg-[#c2652a]/10 rounded-full text-[#c2652a]">
                <UsersIcon className="w-6 h-6" />
              </div>
            </Card>

            <Card className="bg-white border border-[rgba(216,208,200,0.7)] p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#8c7e72] uppercase tracking-wider">Deposited Balance</p>
                <h3 className="text-2xl font-bold text-[#2a1f17] mt-1">₹{totalBalance.toLocaleString("en-IN")}</h3>
              </div>
              <div className="p-3 bg-[#c2652a]/10 rounded-full text-[#c2652a]">
                <Wallet className="w-6 h-6" />
              </div>
            </Card>

            <Card className="bg-white border border-[rgba(216,208,200,0.7)] p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#8c7e72] uppercase tracking-wider">Gold Assets Held</p>
                <h3 className="text-2xl font-bold text-[#2a1f17] mt-1">{totalGold.toFixed(2)} g</h3>
              </div>
              <div className="p-3 bg-[#c2652a]/10 rounded-full text-[#c2652a]">
                <Award className="w-6 h-6" />
              </div>
            </Card>

            <Card className="bg-white border border-[rgba(216,208,200,0.7)] p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#8c7e72] uppercase tracking-wider">Stock Trades (Trades)</p>
                <h3 className="text-2xl font-bold text-[#2a1f17] mt-1">{platformTrades}</h3>
              </div>
              <div className="p-3 bg-[#c2652a]/10 rounded-full text-[#c2652a]">
                <TrendingUp className="w-6 h-6" />
              </div>
            </Card>

            {/* Charts Section */}
            <div className="md:col-span-2 lg:col-span-3 bg-white border border-[rgba(216,208,200,0.7)] rounded-[24px] p-6 shadow-sm">
              <h4 className="text-base font-bold text-[#2a1f17] mb-4">Stock Price Rankings</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topStocksData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#8c7e72" fontSize={12} tickLine={false} />
                    <YAxis stroke="#8c7e72" fontSize={12} tickLine={false} />
                    <Tooltip cursor={{ fill: "rgba(194,101,42,0.05)" }} />
                    <Bar dataKey="Price" fill="#c2652a" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Role breakdown */}
            <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
              <h4 className="text-base font-bold text-[#2a1f17]">User Roles Breakdown</h4>
              <div className="h-48 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {userDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around text-xs font-semibold text-[#605850]">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#c2652a]"></span> Admins
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#d9b48f]"></span> Users
                </span>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: USER MANAGEMENT -------------------- */}
        {activeTab === "users" && (
          <div className="grid gap-6">
            {/* Search and stats bar */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7e72] w-4.5 h-4.5" />
                <input
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Search by name, phone number, or UPI ID..."
                  className="bg-white border border-[rgba(216,208,200,0.7)] rounded-full pl-10 pr-4 py-2.5 w-full text-sm focus:ring-1 focus:ring-[#c2652a] focus:outline-none text-[#4a3d33] shadow-sm"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[24px] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#faf5ee] border-b border-[rgba(216,208,200,0.7)] text-[#605850] font-semibold">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Phone / UPI VPA</th>
                      <th className="px-6 py-4">Balance</th>
                      <th className="px-6 py-4">Gold Balance</th>
                      <th className="px-6 py-4">Reward Points</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(216,208,200,0.3)]">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-[#faf5ee]/30 transition text-[#4a3d33]">
                        <td className="px-6 py-4 font-semibold">{u.name}</td>
                        <td className="px-6 py-4 text-xs font-mono text-[#8c7e72]">
                          <div>{u.phone}</div>
                          <div>{u.vpa}</div>
                        </td>
                        <td className="px-6 py-4 font-bold">₹{u.balance.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4">{u.gold?.toFixed(2) || "0.00"} g</td>
                        <td className="px-6 py-4">{u.rewards || "0"} pts</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.isAdmin 
                              ? "bg-[#c2652a]/10 text-[#c2652a]" 
                              : "bg-[#8c7e72]/10 text-[#605850]"
                          }`}>
                            {u.isAdmin ? "Super Admin" : "User"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditUser(u)}
                              className="p-1.5 hover:bg-[#c2652a]/10 hover:text-[#c2652a] rounded transition cursor-pointer text-[#605850]"
                              title="Modify assets/balance"
                            >
                              <Edit2 className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={u._id === user.id}
                              className={`p-1.5 rounded transition ${
                                u._id === user.id 
                                  ? "opacity-30 cursor-not-allowed text-gray-400" 
                                  : "hover:bg-[#8c3c3c]/10 hover:text-[#8c3c3c] cursor-pointer text-[#8c3c3c]"
                              }`}
                              title="Delete user"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center px-6 py-8 text-[#8c7e72]">No users matched your query.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit User Balance Modal (Inline/Overlay Card depending on Selection) */}
            {selectedUser && (
              <div className="fixed inset-0 bg-[#2a1f17]/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white border border-[rgba(216,208,200,0.7)] p-6 shadow-xl relative animate-fade-in">
                  <h4 className="text-lg font-bold text-[#2a1f17] mb-2">Modify User Resources</h4>
                  <p className="text-xs text-[#8c7e72] mb-6">Updating resources for <span className="font-bold text-[#4a3d33]">{selectedUser.name}</span></p>

                  <form onSubmit={handleUpdateBalance} className="grid gap-4 text-sm">
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-[#605850] mb-1">Wallet Balance (₹)</label>
                      <input
                        type="number"
                        value={balanceForm.balance}
                        onChange={(e) => setBalanceForm({ ...balanceForm, balance: e.target.value })}
                        className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2 focus:ring-1 focus:ring-[#c2652a] focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-[#605850] mb-1">Gold Balance (grams)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={balanceForm.gold}
                        onChange={(e) => setBalanceForm({ ...balanceForm, gold: e.target.value })}
                        className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2 focus:ring-1 focus:ring-[#c2652a] focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-[#605850] mb-1">Reward Points (pts)</label>
                      <input
                        type="number"
                        value={balanceForm.rewards}
                        onChange={(e) => setBalanceForm({ ...balanceForm, rewards: e.target.value })}
                        className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2 focus:ring-1 focus:ring-[#c2652a] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-[#c2652a] text-white hover:bg-[#a8541f] rounded-[8px] py-2.5 font-semibold text-center transition cursor-pointer"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedUser(null)}
                        className="flex-1 bg-white border border-[rgba(216,208,200,0.7)] hover:bg-[#faf5ee] rounded-[8px] py-2.5 font-semibold text-center text-[#605850] transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* -------------------- TAB CONTENT: TRANSACTIONS LOG -------------------- */}
        {activeTab === "txns" && (
          <div className="grid gap-6">
            {/* Search Filter */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7e72] w-4.5 h-4.5" />
              <input
                value={txnQuery}
                onChange={(e) => setTxnQuery(e.target.value)}
                placeholder="Search transactions by reference, sender, or receiver..."
                className="bg-white border border-[rgba(216,208,200,0.7)] rounded-full pl-10 pr-4 py-2.5 w-full text-sm focus:ring-1 focus:ring-[#c2652a] focus:outline-none text-[#4a3d33] shadow-sm"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* UPI & Transfer Logs */}
              <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[24px] p-6 shadow-sm">
                <h4 className="text-base font-bold text-[#2a1f17] mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#c2652a]" /> UPI & Platform Transfers
                </h4>
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#faf5ee] border-b border-[rgba(216,208,200,0.7)] text-[#605850] font-semibold">
                        <th className="px-4 py-3">Participants</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Reference / Note</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(216,208,200,0.3)]">
                      {filteredTxns.map((t) => (
                        <tr key={t._id} className="hover:bg-[#faf5ee]/30 transition text-[#4a3d33]">
                          <td className="px-4 py-3 font-semibold text-xs">
                            <div className="text-[#c2652a]">From: {t.sender?.name || "System/Gateway"}</div>
                            <div className="text-emerald-700">To: {t.receiver?.name || t.counterpartyName}</div>
                          </td>
                          <td className="px-4 py-3 font-bold">₹{t.amount}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.type === 'DEBIT' 
                                ? 'bg-red-50 text-red-600 border border-red-200' 
                                : 'bg-green-50 text-green-600 border border-green-200'
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-mono text-[10px] text-[#8c7e72]">{t.reference || "N/A"}</div>
                            <div className="italic text-[#605850]">{t.note}</div>
                          </td>
                          <td className="px-4 py-3 text-[#8c7e72]">{new Date(t.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {filteredTxns.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center px-4 py-6 text-[#8c7e72]">No transactions logged yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Stock Market Trade Logs */}
              <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[24px] p-6 shadow-sm">
                <h4 className="text-base font-bold text-[#2a1f17] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#c2652a]" /> Stock Trading Activity
                </h4>
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#faf5ee] border-b border-[rgba(216,208,200,0.7)] text-[#605850] font-semibold">
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Stock Info</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Ref ID</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(216,208,200,0.3)]">
                      {stockTransactions.map((st) => (
                        <tr key={st._id} className="hover:bg-[#faf5ee]/30 transition text-[#4a3d33]">
                          <td className="px-4 py-3 font-semibold">{st.user?.name || "Deleted User"}</td>
                          <td className="px-4 py-3">
                            <div className="font-bold">{st.symbol}</div>
                            <div className="text-[10px] text-[#8c7e72]">{st.companyName}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              st.type === 'BUY' 
                                ? 'bg-[#c2652a]/10 text-[#c2652a]' 
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            }`}>
                              {st.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            <div>₹{st.totalAmount.toLocaleString("en-IN")}</div>
                            <div className="text-[10px] text-[#8c7e72]">{st.quantity} @ ₹{st.price}</div>
                          </td>
                          <td className="px-4 py-3 font-mono text-[10px] text-[#8c7e72]">{st.reference?.slice(0, 13)}...</td>
                          <td className="px-4 py-3 text-[#8c7e72]">{new Date(st.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {stockTransactions.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center px-4 py-6 text-[#8c7e72]">No stock activities logged yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: STOCKS MANAGEMENT -------------------- */}
        {activeTab === "stocks" && (
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7e72] w-4.5 h-4.5" />
                <input
                  value={stockQuery}
                  onChange={(e) => setStockQuery(e.target.value)}
                  placeholder="Search stocks by symbol or company..."
                  className="bg-white border border-[rgba(216,208,200,0.7)] rounded-full pl-10 pr-4 py-2.5 w-full text-sm focus:ring-1 focus:ring-[#c2652a] focus:outline-none text-[#4a3d33] shadow-sm"
                />
              </div>
              <button
                onClick={() => {
                  setEditingStock(null);
                  setStockForm({ symbol: "", name: "", price: "" });
                  setIsAddingStock(true);
                }}
                className="bg-[#c2652a] text-white hover:bg-[#a55220] px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm self-start"
              >
                <Plus className="w-4 h-4" /> Add New Stock
              </button>
            </div>

            {/* Stocks Table */}
            <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[24px] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#faf5ee] border-b border-[rgba(216,208,200,0.7)] text-[#605850] font-semibold">
                      <th className="px-6 py-4">Symbol</th>
                      <th className="px-6 py-4">Company Name</th>
                      <th className="px-6 py-4">Current Price</th>
                      <th className="px-6 py-4">Price Change</th>
                      <th className="px-6 py-4">Percentage Change</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(216,208,200,0.3)]">
                    {filteredStocks.map((s) => (
                      <tr key={s.symbol} className="hover:bg-[#faf5ee]/30 transition text-[#4a3d33]">
                        <td className="px-6 py-4 font-mono font-bold text-[#c2652a]">{s.symbol}</td>
                        <td className="px-6 py-4">{s.companyName}</td>
                        <td className="px-6 py-4 font-bold">₹{s.currentPrice.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1 font-semibold ${
                            s.change >= 0 ? "text-emerald-600" : "text-red-500"
                          }`}>
                            {s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            s.changePercent >= 0 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                              : "bg-red-50 text-red-600 border border-red-200"
                          }`}>
                            {s.changePercent >= 0 ? "▲" : "▼"} {Math.abs(s.changePercent).toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditStockPrice(s)}
                              className="p-1.5 hover:bg-[#c2652a]/10 hover:text-[#c2652a] rounded transition cursor-pointer text-[#605850]"
                              title="Modify Stock Details"
                            >
                              <Edit2 className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStock(s.symbol)}
                              className="p-1.5 hover:bg-[#8c3c3c]/10 hover:text-[#8c3c3c] rounded transition cursor-pointer text-[#8c3c3c]"
                              title="Delete Stock Listing"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStocks.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center px-6 py-8 text-[#8c7e72]">No stocks listed currently.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add / Edit Stock Modals */}
            {(isAddingStock || editingStock) && (
              <div className="fixed inset-0 bg-[#2a1f17]/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white border border-[rgba(216,208,200,0.7)] p-6 shadow-xl relative animate-fade-in">
                  <h4 className="text-lg font-bold text-[#2a1f17] mb-6">
                    {isAddingStock ? "Add New Tradable Stock" : `Edit Stock Detail (${editingStock.symbol})`}
                  </h4>

                  <form onSubmit={isAddingStock ? handleAddStock : handleUpdateStock} className="grid gap-4 text-sm">
                    {isAddingStock && (
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold text-[#605850] mb-1">Stock Ticker Symbol</label>
                        <input
                          placeholder="e.g. RELIANCE, TCS"
                          value={stockForm.symbol}
                          onChange={(e) => setStockForm({ ...stockForm, symbol: e.target.value })}
                          className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2 focus:ring-1 focus:ring-[#c2652a] focus:outline-none uppercase"
                          required
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-[#605850] mb-1">Company Name</label>
                      <input
                        placeholder="e.g. Reliance Industries Ltd"
                        value={stockForm.name}
                        onChange={(e) => setStockForm({ ...stockForm, name: e.target.value })}
                        className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2 focus:ring-1 focus:ring-[#c2652a] focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-[#605850] mb-1">Stock Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={stockForm.price}
                        onChange={(e) => setStockForm({ ...stockForm, price: e.target.value })}
                        className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2 focus:ring-1 focus:ring-[#c2652a] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-[#c2652a] text-white hover:bg-[#a8541f] rounded-[8px] py-2.5 font-semibold text-center transition cursor-pointer"
                      >
                        {isAddingStock ? "Add Listing" : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingStock(false);
                          setEditingStock(null);
                        }}
                        className="flex-1 bg-white border border-[rgba(216,208,200,0.7)] hover:bg-[#faf5ee] rounded-[8px] py-2.5 font-semibold text-center text-[#605850] transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Card>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
