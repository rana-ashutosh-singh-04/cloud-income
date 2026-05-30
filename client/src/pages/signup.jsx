import { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/card";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Signup() {
  const nav = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    vpa: "",
    pin: "",
    adminSecret: "",
  });

  const [isSecretAdmin, setIsSecretAdmin] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      // Filter out adminSecret if not signing up as admin
      const payload = { ...form };
      if (!isSecretAdmin) {
        delete payload.adminSecret;
      }
      await signup(payload);
      nav("/");
    } catch (e) {
      setErr(e?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf5ee]">
      <Navbar />

      <main className="w-full max-w-md mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <Card className="shadow-[0_2px_16px_rgba(58,48,42,0.06)] border border-[rgba(216,208,200,0.7)] bg-[#ffffff] p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#2a1f17]">
            Create Your Account
          </h2>

          <form onSubmit={submit} className="grid gap-4 text-sm">
            {/* Full Name */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2 focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] placeholder-[#8c7e72] transition"
              required
            />

            {/* Phone Number */}
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2 focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] placeholder-[#8c7e72] transition"
              required
            />

            {/* UPI ID */}
            <input
              name="vpa"
              value={form.vpa}
              onChange={handleChange}
              placeholder="UPI ID (e.g. name@pay)"
              className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2 focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] placeholder-[#8c7e72] transition"
              required
            />

            {/* PIN */}
            <input
              name="pin"
              value={form.pin}
              onChange={handleChange}
              type="password"
              placeholder="Set PIN"
              className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2 focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] placeholder-[#8c7e72] transition"
              required
            />

            {/* Super Admin Toggle */}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="isSecretAdmin"
                checked={isSecretAdmin}
                onChange={(e) => {
                  setIsSecretAdmin(e.target.checked);
                  if (!e.target.checked) {
                    setForm(prev => ({ ...prev, adminSecret: "" }));
                  }
                }}
                className="w-4 h-4 rounded text-[#c2652a] focus:ring-[#c2652a] accent-[#c2652a] cursor-pointer"
              />
              <label htmlFor="isSecretAdmin" className="text-[#605850] font-medium cursor-pointer select-none">
                Sign up as Super Admin
              </label>
            </div>

            {isSecretAdmin && (
              <input
                name="adminSecret"
                value={form.adminSecret}
                onChange={handleChange}
                type="password"
                placeholder="Admin Secret Key"
                className="bg-white border border-[rgba(216,208,200,0.7)] rounded-[8px] px-4 py-2 focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] placeholder-[#8c7e72] transition animate-fade-in"
                required
              />
            )}

            {/* Submit Button */}
            <button className="bg-[#c2652a] text-white rounded-[8px] py-2.5 mt-2 font-semibold text-[15px] hover:bg-[#a8541f] transition-all cursor-pointer">
              Create Account
            </button>
          </form>

          {/* Error Message */}
          {err && (
            <div className="text-sm mt-4 text-[#8c3c3c] text-center font-medium bg-[#8c3c3c]/10 py-2 rounded-lg border border-[#8c3c3c]/20">
              {err}
            </div>
          )}

          {/* Already have account */}
          <p className="text-sm mt-6 text-center text-[#605850]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#c2652a] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
