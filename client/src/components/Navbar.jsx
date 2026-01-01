import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../assets/phonepe_logo.jpeg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "our solutions", to:"/"},
    { label: "Dashboard", to: "/dashboard" },
    { label: "Investor Relations", to: "/investor-relations" },
    { label: "Contact Us", to: "/contact" },
    { label: "Trust & Safety", to: "/trust-safety" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between ">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="PhonePe Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-900">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="hover:text-purple-700 transition px-4 py-1"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </div>

        {/* Logout */}
        {user && (
          <button
            onClick={handleLogout}
            className="hidden md:block bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}

        {/* Mobile Button */}
        <button
          className="md:hidden text-purple-700"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <XMarkIcon className="w-7 h-7" />
          ) : (
            <Bars3Icon className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg px-6 pt-4 pb-6">
          <ul className="flex flex-col gap-4 text-gray-800 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="hover:text-purple-700"
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
