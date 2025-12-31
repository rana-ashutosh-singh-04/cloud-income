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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex flex-col items-center px-4 mt-10 mb-16 flex-1">
        <Card className="w-full max-w-md shadow-lg">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">
            Welcome Back
          </h2>

          <form onSubmit={submit} className="grid gap-5 text-sm">
            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1 font-medium">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 outline-none text-[15px]"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* PIN */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1 font-medium">PIN</label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                type="password"
                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 outline-none text-[15px]"
                placeholder="Enter your PIN"
                required
              />
            </div>

            {/* Login Button */}
            <button className="bg-purple-700 text-white rounded-lg py-3 mt-2 font-semibold text-[15px] hover:bg-purple-800 transition-all">
              Login
            </button>
          </form>

          {/* Error Message */}
          {err && (
            <div className="text-sm mt-4 text-rose-600 text-center font-medium bg-rose-50 py-2 rounded-lg border border-rose-200">
              {err}
            </div>
          )}

          {/* Signup Option */}
          <p className="text-sm mt-6 text-center text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-700 font-semibold hover:underline"
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
