import { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/card";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/footer";
export default function Signup() {
  const nav = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    vpa: "",
    pin: "",
  });

  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signup(form);
      nav("/");
    } catch (e) {
      setErr(e?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-8">
        <Card>
          <h2 className="text-2xl font-semibold mb-6 text-center text-purple-700">
            Create Your Account
          </h2>

          <form onSubmit={submit} className="grid gap-4 text-sm">
            {/* Full Name */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            {/* Phone Number */}
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            {/* UPI ID */}
            <input
              name="vpa"
              value={form.vpa}
              onChange={handleChange}
              placeholder="UPI ID (e.g. name@pay)"
              className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            {/* PIN */}
            <input
              name="pin"
              value={form.pin}
              onChange={handleChange}
              type="password"
              placeholder="Set PIN"
              className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            {/* Submit Button */}
            <button className="bg-purple-700 text-white rounded-lg py-2 text-sm font-medium hover:bg-purple-800 transition">
              Create Account
            </button>
          </form>

          {/* Error Message */}
          {err && (
            <div className="text-sm mt-3 text-rose-600 text-center font-medium">
              {err}
            </div>
          )}

          {/* Already have account */}
          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-700 font-medium hover:underline">
              Login
            </Link>
          </p>
        </Card>
      </main>
      <Footer></Footer>
    </div>
  );
}
