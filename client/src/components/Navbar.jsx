import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "our solutions", to: "/" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Investor Relations", to: "/investor-relations" },
    { label: "Contact Us", to: "/contact" },
    { label: "Trust & Safety", to: "/trust-safety" },
  ];

  return (
    <>
      <style>
        {`
          @keyframes fadeDownNav {
            from { opacity: 0; transform: translateY(-20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .nav-header {
            animation: fadeDownNav 0.7s ease both;
          }
          .nav-link {
            transition: opacity 0.2s, color 0.2s;
            white-space: nowrap;
          }
          .nav-link:hover {
            opacity: 0.45;
          }
        `}
      </style>
      {/* Spacer to prevent content overlap since the navbar is absolute */}
      <div className="h-[90px] w-full" aria-hidden="true"></div>

      <header className="nav-header absolute top-[20px] left-0 w-full z-[100] px-6 md:px-12 flex items-center justify-between pointer-events-none">

        {/* Logo - Far Left */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }} className="pointer-events-auto flex-shrink-0 hover:opacity-80 transition-opacity">
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#c2652a', flexShrink: 0 }} />
          <span style={{ fontFamily: 'Georgia,serif', fontSize: '20px', fontWeight: 700, color: '#2a1f17', lineHeight: 1.2 }}>
            Cloud<br />Income
          </span>
        </Link>

        {/* Right Side: Auth Buttons & Mobile Menu Toggle */}
        <div className="pointer-events-auto flex items-center gap-4 flex-shrink-0">
          {user ? (
            <button
              onClick={handleLogout}
              className="hidden md:block border border-[#8c3c3c]/40 text-[#8c3c3c] hover:bg-[#8c3c3c]/5 px-4 py-1.5 rounded-full transition nav-link text-sm font-semibold bg-white/50 backdrop-blur-sm"
            >
              Logout
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-[#4a3d33] hover:text-[#c2652a] text-sm font-semibold transition nav-link bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[rgba(216,208,200,0.7)]">Log in</Link>
              <Link to="/signup" className="bg-[#c2652a] text-white hover:bg-[#a55220] px-4 py-1.5 rounded-full text-sm font-semibold transition shadow-sm">Sign up</Link>
            </div>
          )}

          {/* Mobile Button */}
          <button
            className="md:hidden text-[#c2652a] p-2 bg-[rgba(250,245,238,0.85)] backdrop-blur-[16px] border border-[rgba(216,208,200,0.7)] rounded-full shadow-[0_2px_24px_rgba(0,0,0,0.08)]"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="absolute top-[calc(100%+16px)] left-6 right-6 md:hidden bg-[rgba(250,245,238,0.95)] backdrop-blur-[16px] shadow-[0_2px_24px_rgba(0,0,0,0.08)] px-6 py-6 border border-[rgba(216,208,200,0.7)] rounded-[24px] pointer-events-auto">
            <ul className="flex flex-col gap-4 text-[#4a3d33] font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="nav-link text-base py-1"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="border border-[#8c3c3c]/40 text-[#8c3c3c] hover:bg-[#8c3c3c]/5 px-4 py-2 rounded-full transition w-full text-left mt-2 nav-link"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2 mt-2 border-t border-[rgba(216,208,200,0.7)] pt-4">
                  <Link to="/login" onClick={() => setOpen(false)} className="text-[#4a3d33] hover:text-[#c2652a] text-base py-2 transition nav-link">Log in</Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="bg-[#c2652a] text-white hover:bg-[#a55220] px-4 py-2 rounded-full text-center text-base font-semibold transition">Sign up</Link>
                </div>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* Center Pill Box (Navigation Links) - Fixed so it moves with the user on scroll */}
      <nav className="nav-header hidden md:flex items-center bg-[rgba(250,245,238,0.85)] backdrop-blur-[16px] border border-[rgba(216,208,200,0.7)] rounded-full px-[32px] py-[14px] shadow-[0_2px_24px_rgba(0,0,0,0.08)] pointer-events-auto fixed top-[20px] left-1/2 -translate-x-1/2 z-[100]">
        <div className="flex items-center gap-8 text-sm font-semibold text-[#4a3d33]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="nav-link px-2 py-1"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
