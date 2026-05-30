import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/sendMoney";
import PayBills from "./pages/payBills";
import StockMarket from "./pages/StockMarket";
import Recharge from "./pages/Recharge";
import CreditCard from "./pages/CreditCard";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import TrustAndInvestors from "./pages/TrustAndInvestors";
import Contact from "./pages/Contact";
import OurSolutions from "./pages/OurSolutions";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

export default function App() {
  const { user, initFromStorage, syncUser } = useAuth();

  useEffect(() => {
    // Load token and user info from localStorage on app start
    initFromStorage();

    const token = localStorage.getItem("token");
    if (token) {
      syncUser();
    }
  }, [initFromStorage, syncUser]);

  return (
    <div className="min-h-screen bg-[#faf5ee] text-[#4a3d33]">
      <Routes>
        {/* 🏠 Everyone can see Home */}
        <Route path="/" element={<Home />} />

        {/* 📄 Public pages */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/trust-safety" element={<TrustAndInvestors />} />
        <Route path="/our-solutions" element={<OurSolutions />} />

        {/* 🔒 Authenticated user routes */}
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/send" element={<SendMoney user={user} />} />
            <Route path="/bills" element={<PayBills user={user} />} />
            <Route path="/stocks" element={<StockMarket />} />
            <Route path="/recharge" element={<Recharge />} />
            <Route path="/credit" element={<CreditCard />} />
            {user.isAdmin && <Route path="/admin" element={<AdminDashboard user={user} />} />}

            {/* Already logged in? Redirect from login/signup */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* Public login/signup */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Redirect protected paths */}
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/send" element={<Navigate to="/login" replace />} />
            <Route path="/bills" element={<Navigate to="/login" replace />} />
            <Route path="/stocks" element={<Navigate to="/login" replace />} />
            <Route path="/recharge" element={<Navigate to="/login" replace />} />
            <Route path="/credit" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Redirect all other unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
