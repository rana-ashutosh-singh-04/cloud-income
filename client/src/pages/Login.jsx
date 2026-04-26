import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/card";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Login() {
  const nav = useNavigate();
  const { login, initFromStorage, user } = useAuth();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    initFromStorage();
    if (user) nav("/");
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login({ phone, pin });
      nav("/");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf5ee]">
      <Navbar />

      <main className="flex flex-col items-center justify-center px-4 mt-10 mb-16 flex-1">
        <Card className="w-full max-w-md shadow-[0_2px_16px_rgba(58,48,42,0.06)] border border-[rgba(216,208,200,0.7)] bg-[#ffffff] p-8">
          <h2 className="text-3xl font-bold text-center text-[#2a1f17] mb-8">
            Welcome Back
          </h2>

          <form onSubmit={submit} className="grid gap-5 text-sm">
            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="text-[#605850] mb-1 font-medium">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2.5 focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] transition"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* PIN */}
            <div className="flex flex-col">
              <label className="text-[#605850] mb-1 font-medium">PIN</label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                type="password"
                className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2.5 focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] transition"
                placeholder="Enter your PIN"
                required
              />
            </div>

            {/* Login Button */}
            <button className="bg-[#c2652a] text-white rounded-[8px] py-3 mt-2 font-semibold text-[15px] hover:bg-[#a8541f] transition-all">
              Login
            </button>
          </form>

          {/* Error Message */}
          {err && (
            <div className="text-sm mt-4 text-[#8c3c3c] text-center font-medium bg-[#8c3c3c]/10 py-2 rounded-lg border border-[#8c3c3c]/20">
              {err}
            </div>
          )}

          {/* Signup Option */}
          <p className="text-sm mt-6 text-center text-[#605850]">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#c2652a] font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
