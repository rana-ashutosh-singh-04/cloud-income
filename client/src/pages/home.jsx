import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Footer from "../components/footer";
import logo from "../assets/phonepe_logo.jpeg";

export default function Home({ user }) {
  const [open, setOpen] = useState(false);

  const NavRoutes = [
    { label: "Home", to: "/" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Send", to: "/send" },
    { label: "Bills", to: "/bills" },
    { label: "Trust & Safety", to: "/trust" },
  ];

  const navLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Our Solutions", to: "/solutions" },
    { label: "Investor Relations", to: "/investors" },
    { label: "Contact Us", to: "/contact" },
    { label: "Trust & Safety", to: "/trust" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <header className="w-full bg-white shadow sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="PhonePe" className="h-10 w-auto object-contain" />
          </div>

          {/* Desktop Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8">
            {(user ? NavRoutes : navLinks).map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="hover:text-purple-700 transition text-sm font-semibold text-gray-900"
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">
                  Hello, {user.name || "User"}
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                  className="px-4 py-1 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu (Mobile Only) */}
          <button
            className="md:hidden text-purple-700"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden bg-white overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 py-4" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col gap-4 px-6 text-gray-900 font-medium">
            {(user ? NavRoutes : navLinks).map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="hover:text-purple-700"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Buttons */}
            {user ? (
              <>
                <span className="text-gray-700 font-medium">
                  Hello, {user.name || "User"}
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                  className="px-4 py-1 bg-purple-700 text-white rounded-lg hover:bg-purple-800 mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-100"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </ul>
        </div>
      </header>

      {/* CONTENT */}
      {user ? (
        <main className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome back 👋
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-gray-700 font-medium mb-2">Your Balance</h3>
              <p className="text-3xl font-bold text-purple-700">
                ₹{user?.balance || "0.00"}
              </p>
            </div>

            <Link
              to="/send"
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-gray-700 font-medium mb-2">Send Money</h3>
              <p className="text-purple-700 font-semibold">Transfer Instantly</p>
            </Link>

            <Link
              to="/bills"
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-gray-700 font-medium mb-2">Pay Bills</h3>
              <p className="text-purple-700 font-semibold">Quick Payments</p>
            </Link>
          </div>
        </main>
      ) : (
        <main className="flex flex-col items-center justify-center text-center py-20 px-6">
          <h2 className="text-4xl font-bold text-purple-700 mb-6">
            Welcome to PhonePe Clone
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mb-6">
            Experience secure payments, money transfers, and recharges — all in
            one place. Join millions of users already using PhonePe Clone.
          </p>
          <div className="flex gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 text-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-100 text-lg"
            >
              Login
            </Link>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
