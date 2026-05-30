import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  TrendingUp, 
  FileText, 
  Calendar, 
  Download, 
  Mail, 
  ArrowUpRight,
  Shield, 
  Lock, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  ShieldCheck,
  Key,
  Globe,
  Award,
  Users,
  Zap,
  Server
} from "lucide-react";

export default function TrustAndInvestors() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine the default active tab based on the URL search query parameter
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") === "investor" ? "investor" : "trust";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Keep state in sync if search params change externally
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setActiveTab(params.get("tab") === "investor" ? "investor" : "trust");
  }, [location.search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "investor") {
      navigate("/trust-safety?tab=investor", { replace: true });
    } else {
      navigate("/trust-safety?tab=trust", { replace: true });
    }
  };

  // State for Q4/FY in Investor section
  const [financialTab, setFinancialTab] = useState('q4');

  // Trust & Safety Page Data
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All transactions are encrypted using industry-standard AES-256 encryption. Your data is protected at every step."
    },
    {
      icon: Shield,
      title: "PCI DSS Compliant",
      description: "We're certified PCI DSS Level 1 compliant, the highest level of security certification for payment processors."
    },
    {
      icon: Key,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security with 2FA. Your account is protected even if your password is compromised."
    },
    {
      icon: Eye,
      title: "Privacy First",
      description: "We never share your personal or financial information with third parties without your explicit consent."
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Our servers are protected by multiple layers of security, including firewalls, intrusion detection, and DDoS protection."
    },
    {
      icon: ShieldCheck,
      title: "Regular Security Audits",
      description: "We conduct regular security audits and penetration testing to ensure our systems remain secure."
    }
  ];

  const safetyTips = [
    {
      icon: AlertTriangle,
      title: "Never Share Your PIN",
      description: "Cloud income will never ask for your PIN or OTP. If someone asks, it's a scam."
    },
    {
      icon: CheckCircle,
      title: "Verify Before You Pay",
      description: "Always verify the recipient's details before sending money. Double-check UPI IDs and phone numbers."
    },
    {
      icon: Shield,
      title: "Use Official App Only",
      description: "Download Cloud income only from official app stores. Beware of fake apps that may steal your information."
    },
    {
      icon: Lock,
      title: "Keep App Updated",
      description: "Regular updates include security patches. Always keep your Cloud income app updated to the latest version."
    }
  ];

  const certifications = [
    { name: "PCI DSS Level 1", icon: Award, description: "Payment Card Industry Data Security Standard" },
    { name: "ISO 27001", icon: ShieldCheck, description: "Information Security Management" },
    { name: "SOC 2 Type II", icon: Shield, description: "Security, Availability & Confidentiality" },
    { name: "GDPR Compliant", icon: Globe, description: "General Data Protection Regulation" }
  ];

  const stats = [
    { value: "61+ Crore", label: "Trusted Users", icon: Users },
    { value: "100%", label: "Encrypted Transactions", icon: Lock },
    { value: "24/7", label: "Security Monitoring", icon: Zap },
    { value: "0", label: "Data Breaches", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-[#faf5ee] text-[#3a302a] font-sans antialiased relative trust-investor-page">
      <style>{`
        .trust-investor-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.015'/%3E%3C/svg%3E");
          opacity: 1;
          z-index: 0;
          pointer-events: none;
        }
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
        }
        .cloud-deco {
          position: absolute;
          opacity: 0.05;
          pointer-events: none;
        }
        @keyframes grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .bar { transform-origin: bottom; animation: grow 0.8s ease-out forwards; }
        .bar:nth-child(1) { animation-delay: 0.1s; }
        .bar:nth-child(2) { animation-delay: 0.2s; }
        .bar:nth-child(3) { animation-delay: 0.3s; }
        .bar:nth-child(4) { animation-delay: 0.4s; }
        .bar:nth-child(5) { animation-delay: 0.5s; }
        .bar:nth-child(6) { animation-delay: 0.6s; }
        
        @keyframes dash {
          from { stroke-dashoffset: 565; }
          to { stroke-dashoffset: 158; }
        }
        .donut-ring { animation: dash 1.4s ease-out 0.5s forwards; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { opacity: 0; animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
      `}</style>

      <Navbar />

      <main className="relative z-10">
        
        {/* Unified Hero Header with Tab Switcher */}
        <section className="pt-20 pb-12 overflow-hidden bg-gradient-to-b from-[#f5ecd8]/30 to-transparent">
          <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
            <span className="text-[#c2652a] font-medium tracking-widest text-xs uppercase mb-3 block fade-up">
              Fiduciary Trust, Security & Performance
            </span>
            <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] text-[#2a1f17] mb-6 italic fade-up delay-1">
              Building the Future of Income,<br/>
              <span className="text-[#c2652a] not-italic font-bold">Safeguarded.</span>
            </h1>
            <p className="text-lg text-[#605850] font-light leading-relaxed max-w-2xl mx-auto mb-10 fade-up delay-2">
              Our dual commitment: delivering secure, compliant payment solutions for millions of users while generating institutional-grade recurring cloud asset yield for our stakeholders.
            </p>

            {/* Segmented Control Tab Switcher */}
            <div className="inline-flex bg-white/70 backdrop-blur-md p-1.5 rounded-full border border-[rgba(216,208,200,0.8)] shadow-[0_8px_32px_rgba(58,48,42,0.06)] fade-up delay-3">
              <button 
                onClick={() => handleTabChange("trust")}
                className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "trust" 
                    ? "bg-[#c2652a] text-white shadow-md" 
                    : "text-[#605850] hover:text-[#c2652a]"
                }`}
              >
                <Shield className="w-4 h-4" />
                Trust & Safety
              </button>
              <button 
                onClick={() => handleTabChange("investor")}
                className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "investor" 
                    ? "bg-[#c2652a] text-white shadow-md" 
                    : "text-[#605850] hover:text-[#c2652a]"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Investor Relations
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic Content Panel */}
        <div className="transition-opacity duration-300">
          
          {/* TAB 1: TRUST AND SAFETY */}
          {activeTab === "trust" && (
            <div className="fade-up">
              
              {/* Trust Hero Branding Visual */}
              <section className="px-6 py-6 max-w-7xl mx-auto">
                <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_32px_rgba(58,48,42,0.05)] relative flex flex-col lg:flex-row border border-[rgba(216,208,200,0.6)]">
                  {/* Left Side */}
                  <div className="w-full lg:w-1/2 p-12 lg:p-16 flex flex-col justify-between bg-[rgba(250,245,238,0.4)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#c2652a]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c2652a]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-[#c2652a]/10 rounded-2xl flex items-center justify-center mb-8">
                        <Shield className="w-9 h-9 text-[#c2652a]" />
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold text-[#2a1f17] font-serif leading-[1.1] mb-6">
                        Securing Every<br/>
                        <span className="text-[#c2652a] relative inline-block">
                          Transaction
                          <span className="absolute inset-0 text-[#c2652a] opacity-20 translate-x-0.5 translate-y-0.5 blur-sm pointer-events-none">Transaction</span>
                        </span>
                      </h2>
                      <p className="text-[#605850] text-base leading-relaxed max-w-md">
                        Your trust is built on security. Cloud Income guards your financial details with bank-grade encryption protocols and sophisticated fraud-detection mechanisms.
                      </p>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="w-full lg:w-1/2 p-12 lg:p-16 bg-white flex flex-col justify-center items-start lg:items-end text-left lg:text-right border-t lg:border-t-0 lg:border-l border-[rgba(216,208,200,0.6)]">
                    <div className="mb-8 w-full">
                      <span className="text-xs font-bold tracking-widest text-[#c2652a] uppercase mb-4 block">Bank-Grade Protection</span>
                      <p className="text-[#605850] text-base leading-relaxed max-w-sm lg:ml-auto">
                        We monitor all transactions around the clock, employing advanced risk models to proactively neutralize threats. Your peace of mind is baked directly into our system.
                      </p>
                    </div>
                    
                    <div className="flex gap-4 lg:justify-end w-full">
                       <div className="w-14 h-14 rounded-full border border-[rgba(216,208,200,0.6)] flex items-center justify-center text-[#2a1f17] shadow-sm bg-[#faf5ee] hover:scale-105 transition-transform duration-300">
                         <Lock className="w-6 h-6 text-[#c2652a]" />
                       </div>
                       <div className="w-14 h-14 rounded-full border border-[rgba(216,208,200,0.6)] flex items-center justify-center text-[#2a1f17] shadow-sm bg-[#faf5ee] hover:scale-105 transition-transform duration-300">
                         <ShieldCheck className="w-6 h-6 text-[#c2652a]" />
                       </div>
                       <div className="w-14 h-14 rounded-full border border-[rgba(216,208,200,0.6)] flex items-center justify-center text-[#2a1f17] shadow-sm bg-[#faf5ee] hover:scale-105 transition-transform duration-300">
                         <Server className="w-6 h-6 text-[#c2652a]" />
                       </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security Stats */}
              <section className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="bg-white rounded-2xl p-8 border border-[rgba(216,208,200,0.5)] shadow-[0_4px_20px_rgba(58,48,42,0.03)] text-center group hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 bg-[#c2652a]/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#c2652a]/10 transition-colors">
                          <Icon className="w-6 h-6 text-[#c2652a]" />
                        </div>
                        <p className="text-3xl font-bold text-[#2a1f17] mb-2">{stat.value}</p>
                        <p className="text-xs text-[#8c7e72] font-semibold uppercase tracking-wider">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Security Features */}
              <section className="bg-[#f3ece0]/60 py-20 px-8 border-t border-b border-[rgba(216,208,200,0.5)]">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h3 className="text-4xl font-serif text-[#2a1f17] mb-4 italic">Security Infrastructure</h3>
                    <p className="text-[#605850] max-w-xl mx-auto">
                      Enterprise-grade engineering protocols built to protect and preserve client resources at scale.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {securityFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="bg-white rounded-2xl p-8 border border-[rgba(216,208,200,0.5)] shadow-[0_2px_16px_rgba(58,48,42,0.02)] hover:shadow-lg transition-all duration-300">
                          <div className="w-12 h-12 bg-[#c2652a]/10 rounded-xl flex items-center justify-center mb-6">
                            <Icon className="w-6 h-6 text-[#c2652a]" />
                          </div>
                          <h4 className="font-serif font-bold text-lg text-[#2a1f17] mb-2">{feature.title}</h4>
                          <p className="text-sm text-[#8c7e72] leading-relaxed">{feature.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Certifications */}
              <section className="max-w-7xl mx-auto px-8 py-20">
                <div className="text-center mb-16">
                  <h3 className="text-4xl font-serif text-[#2a1f17] mb-4 italic">Certifications & Compliance</h3>
                  <p className="text-[#605850] max-w-xl mx-auto">
                    Governed by leading regulatory standards to assure absolute compliance in digital banking and payment management.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {certifications.map((cert, index) => {
                    const Icon = cert.icon;
                    return (
                      <div key={index} className="bg-white rounded-2xl p-8 border border-[rgba(216,208,200,0.5)] shadow-[0_4px_20px_rgba(58,48,42,0.03)] text-center hover:border-[#c2652a] transition duration-300">
                        <div className="w-12 h-12 bg-[#c2652a]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-6 h-6 text-[#c2652a]" />
                        </div>
                        <h4 className="font-serif font-bold text-[#2a1f17] mb-1">{cert.name}</h4>
                        <p className="text-xs text-[#8c7e72]">{cert.description}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Safety Tips */}
              <section className="bg-[#f3ece0]/60 py-20 px-8 border-t border-b border-[rgba(216,208,200,0.5)]">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h3 className="text-4xl font-serif text-[#2a1f17] mb-4 italic">Consumer Safety Tips</h3>
                    <p className="text-[#605850] max-w-xl mx-auto">
                      Proactive advice to protect your private data and account access credentials.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {safetyTips.map((tip, index) => {
                      const Icon = tip.icon;
                      return (
                        <div key={index} className="bg-white rounded-2xl p-8 border border-[rgba(216,208,200,0.5)] shadow-[0_4px_20px_rgba(58,48,42,0.03)]">
                          <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-[#c2652a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Icon className="w-6 h-6 text-[#c2652a]" />
                            </div>
                            <div>
                              <h4 className="font-serif font-bold text-[#2a1f17] mb-2">{tip.title}</h4>
                              <p className="text-sm text-[#8c7e72] leading-relaxed">{tip.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Report Security Issue */}
              <section className="max-w-7xl mx-auto px-8 py-20">
                <div className="bg-[#8c3c3c] rounded-[24px] p-10 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                  
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-8 h-8 text-white" />
                        <h3 className="text-3xl font-serif italic font-bold">Report a Security Vulnerability</h3>
                      </div>
                      <p className="text-white/80 leading-relaxed text-base">
                        If you have discovered a potential safety or system vulnerability, report it to our response unit immediately. We investigate all valid submissions with high priority.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                      <a 
                        href="mailto:security@Cloudincome.com" 
                        className="px-8 py-4 bg-white text-[#8c3c3c] rounded-xl font-semibold hover:bg-[#faf5ee] transition-all text-center whitespace-nowrap shadow-md"
                      >
                        Email Response Team
                      </a>
                      <Link
                        to="/contact"
                        className="px-8 py-4 border border-white/40 text-white rounded-xl font-semibold hover:bg-white/10 transition-all text-center whitespace-nowrap"
                      >
                        Contact support
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* Policy Disclosures */}
              <section className="max-w-7xl mx-auto px-8 pb-20">
                <div className="bg-white rounded-2xl p-10 border border-[rgba(216,208,200,0.5)] shadow-[0_4px_24px_rgba(58,48,42,0.03)] text-center">
                  <h3 className="text-2xl font-serif text-[#2a1f17] mb-3 italic">Policy Disclosures</h3>
                  <p className="text-[#605850] mb-8 max-w-lg mx-auto">
                    Review our operational frameworks covering privacy protocols, cookies usage, and service agreements.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a href="#" className="px-6 py-3 bg-[#c2652a]/5 border border-[#c2652a]/15 text-[#c2652a] rounded-lg font-semibold hover:bg-[#c2652a]/10 transition-all">
                      Privacy Policy
                    </a>
                    <a href="#" className="px-6 py-3 bg-[#c2652a]/5 border border-[#c2652a]/15 text-[#c2652a] rounded-lg font-semibold hover:bg-[#c2652a]/10 transition-all">
                      Terms of Service
                    </a>
                    <a href="#" className="px-6 py-3 bg-[#c2652a]/5 border border-[#c2652a]/15 text-[#c2652a] rounded-lg font-semibold hover:bg-[#c2652a]/10 transition-all">
                      Cookie Policy
                    </a>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: INVESTOR RELATIONS */}
          {activeTab === "investor" && (
            <div className="fade-up">
              
              {/* Investor Hero Visual Section */}
              <section className="relative pb-16 pt-4 overflow-hidden">
                <svg className="cloud-deco" style={{width: '700px', top: '-100px', right: '-120px'}} viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="380" cy="180" rx="280" ry="200" fill="#c2652a"/>
                  <ellipse cx="560" cy="120" rx="160" ry="130" fill="#8c3c3c"/>
                </svg>

                <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                  <div className="max-w-xl text-left">
                    <span className="text-[#c2652a] font-medium tracking-widest text-xs uppercase mb-3 block">Stakeholder Transparency</span>
                    <h2 className="text-4xl md:text-5xl font-serif italic text-[#3a302a] leading-tight mb-6">
                      Passive Income,<br/>Built on Cloud infrastructure.
                    </h2>
                    <p className="text-base text-[#605850] font-light leading-relaxed mb-8">
                      We optimize recurring distributions through systematic acquisition and curation of high-performing SaaS assets and distributed storage nodes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="bg-[#c2652a] text-white px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md">
                        Latest Annual Report
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="border border-[#9a9088] px-8 py-4 rounded-xl font-medium hover:bg-stone-100/40 text-[#3a302a] transition-all text-center">
                        View Income Schedule
                      </button>
                    </div>
                  </div>

                  {/* Cloud Income Visual Illustration */}
                  <div className="w-full lg:w-1/2 flex items-center justify-center">
                    <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" style={{width: '100%', maxWidth: '440px'}} className="drop-shadow-lg">
                      <ellipse cx="280" cy="180" rx="200" ry="160" fill="#f0e8dc" opacity="0.6"/>
                      <ellipse cx="240" cy="200" rx="170" ry="100" fill="#e8ddd0" opacity="0.7"/>
                      <circle cx="160" cy="195" r="70" fill="#e8ddd0" opacity="0.7"/>
                      <circle cx="300" cy="180" r="90" fill="#e8ddd0" opacity="0.7"/>
                      <circle cx="220" cy="155" r="80" fill="#ddd4c8" opacity="0.6"/>
                      <line x1="170" y1="260" x2="170" y2="310" stroke="#c2652a" strokeWidth="2" strokeDasharray="4 4" opacity="0.7"/>
                      <line x1="220" y1="270" x2="220" y2="330" stroke="#c2652a" strokeWidth="2" strokeDasharray="4 4" opacity="0.7"/>
                      <line x1="270" y1="260" x2="270" y2="315" stroke="#c2652a" strokeWidth="2" strokeDasharray="4 4" opacity="0.7"/>
                      <line x1="320" y1="250" x2="320" y2="305" stroke="#8c3c3c" strokeWidth="2" strokeDasharray="4 4" opacity="0.6"/>
                      <circle cx="170" cy="318" r="10" fill="#c2652a" opacity="0.8"/>
                      <circle cx="220" cy="338" r="10" fill="#c2652a" opacity="0.8"/>
                      <circle cx="270" cy="323" r="10" fill="#c2652a" opacity="0.8"/>
                      <circle cx="320" cy="312" r="10" fill="#8c3c3c" opacity="0.7"/>
                      <text x="166" y="322" fontFamily="serif" fontSize="12" fill="white" fontWeight="600">$</text>
                      <text x="216" y="342" fontFamily="serif" fontSize="12" fill="white" fontWeight="600">$</text>
                      <text x="266" y="327" fontFamily="serif" fontSize="12" fill="white" fontWeight="600">$</text>
                      <text x="316" y="316" fontFamily="serif" fontSize="12" fill="white" fontWeight="600">$</text>
                      <polyline points="155,215 185,195 215,205 250,175 290,165 320,145" stroke="#c2652a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
                      <circle cx="320" cy="145" r="5" fill="#c2652a" opacity="0.9"/>
                    </svg>
                  </div>
                </div>
              </section>

              {/* Financial Performance Bento Grid */}
              <section className="bg-[#f6f0e8] py-20">
                <div className="max-w-7xl mx-auto px-8">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                      <h3 className="text-4xl font-serif italic text-[#2a1f17]">Income Performance</h3>
                      <p className="text-[#605850] max-w-md mt-2">Consistent quarterly performance profiles across SaaS properties, enterprise APIs, and digital systems.</p>
                    </div>
                    <div className="flex bg-[#faf5ee] p-1 rounded-lg border border-[#d8d0c8]">
                      <button 
                        className={`px-6 py-2 text-sm font-medium rounded transition-colors ${financialTab === 'q4' ? 'bg-[#c2652a] text-white' : 'text-[#605850] hover:text-[#c2652a]'}`}
                        onClick={() => setFinancialTab('q4')}
                      >
                        Q4 2025
                      </button>
                      <button 
                        className={`px-6 py-2 text-sm font-medium rounded transition-colors ${financialTab === 'fy' ? 'bg-[#c2652a] text-white' : 'text-[#605850] hover:text-[#c2652a]'}`}
                        onClick={() => setFinancialTab('fy')}
                      >
                        FY 2025
                      </button>
                    </div>
                  </div>

                  <div className="bento-grid">
                    {/* Bar chart card */}
                    <div className="col-span-12 lg:col-span-8 bg-[#faf5ee] p-10 rounded-2xl shadow-[0_4px_24px_rgba(58,48,42,0.03)] relative overflow-hidden group border border-[rgba(216,208,200,0.4)]">
                      <h4 className="text-2xl font-serif mb-8 text-[#2a1f17]">Distribution Momentum</h4>
                      <div className="h-64 flex items-end gap-3 mb-4">
                        <div className="bar w-full bg-[#c2652a]/20 rounded-t hover:bg-[#c2652a]/40 transition-all duration-500 cursor-pointer relative group/bar" style={{height: '30%'}}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#605850] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap font-medium">$0.82/sh</span>
                        </div>
                        <div className="bar w-full bg-[#c2652a]/20 rounded-t hover:bg-[#c2652a]/40 transition-all duration-500 cursor-pointer relative group/bar" style={{height: '45%'}}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#605850] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap font-medium">$1.10/sh</span>
                        </div>
                        <div className="bar w-full bg-[#c2652a]/20 rounded-t hover:bg-[#c2652a]/40 transition-all duration-500 cursor-pointer relative group/bar" style={{height: '62%'}}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#605850] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap font-medium">$1.44/sh</span>
                        </div>
                        <div className="bar w-full bg-[#c2652a]/20 rounded-t hover:bg-[#c2652a]/40 transition-all duration-500 cursor-pointer relative group/bar" style={{height: '72%'}}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#605850] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap font-medium">$1.68/sh</span>
                        </div>
                        <div className="bar w-full bg-[#c2652a]/20 rounded-t hover:bg-[#c2652a]/40 transition-all duration-500 cursor-pointer relative group/bar" style={{height: '82%'}}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#605850] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap font-medium">$1.97/sh</span>
                        </div>
                        <div className="bar w-full bg-[#c2652a] rounded-t transition-all duration-500 cursor-pointer relative group/bar" style={{height: '100%'}}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#c2652a] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">$2.34/sh</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs font-sans font-semibold text-[#8c7e72] tracking-widest mt-6">
                        <span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span><span>2025</span>
                      </div>
                    </div>

                    {/* Yield highlight card */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#8c3c3c] text-white p-10 rounded-2xl flex flex-col justify-between shadow-lg">
                      <div>
                        <TrendingUp className="w-10 h-10 mb-6 block opacity-90" strokeWidth={1.5} />
                        <h4 className="text-4xl font-serif leading-tight italic">11.8%<br/>Annual Yield</h4>
                      </div>
                      <p className="text-sm opacity-80 mt-8">Exceeding leading indices in recurring yield distributions for consecutive reporting periods.</p>
                    </div>

                    {/* AUM stat card */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#ece6dc] p-10 rounded-2xl border border-[rgba(216,208,200,0.5)]">
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-[#c2652a] mb-2">Assets Under Management</h4>
                      <div className="text-5xl font-serif italic text-[#3a302a] mb-4">$2.4B</div>
                      <p className="text-sm text-[#605850] leading-relaxed">Deployed securely across SaaS properties, core cloud infrastructure nodes, and SaaS billing pipelines.</p>
                    </div>

                    {/* Donut / investor composition */}
                    <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-2xl border border-[#d8d0c8] flex flex-col md:flex-row items-center gap-8 shadow-[0_4px_24px_rgba(58,48,42,0.02)]">
                      <div className="relative flex-shrink-0">
                        <svg width="160" height="160" viewBox="0 0 200 200">
                          <circle cx="100" cy="100" r="80" fill="none" stroke="#f0e8dc" strokeWidth="28"/>
                          <circle className="donut-ring" cx="100" cy="100" r="80" fill="none" stroke="#c2652a" strokeWidth="28"
                            strokeDasharray="565" strokeDashoffset="565"
                            strokeLinecap="round"
                            transform="rotate(-90 100 100)"/>
                          <circle cx="100" cy="100" r="80" fill="none" stroke="#8c3c3c" strokeWidth="28"
                            strokeDasharray="90 475"
                            strokeLinecap="round"
                            transform="rotate(136 100 100)" opacity="0.85"/>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-3xl font-serif font-bold text-[#2a1f17]">68%</div>
                          <div className="text-[10px] uppercase font-semibold text-[#8c7e72] tracking-wider">Institutional</div>
                        </div>
                      </div>

                      <div className="flex-1 w-full text-left">
                        <h4 className="text-2xl font-serif mb-4 text-[#2a1f17]">Fiduciary Backing</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2 text-[#4a3d33] font-medium">
                              <span className="w-3 h-3 rounded-full bg-[#c2652a] inline-block"></span>
                              Institutional Partners
                            </span>
                            <span className="font-bold text-[#2a1f17]">68%</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2 text-[#4a3d33] font-medium">
                              <span className="w-3 h-3 rounded-full bg-[#c2652a]/40 inline-block"></span>
                              Private Wealth Funds
                            </span>
                            <span className="font-bold text-[#2a1f17]">24%</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2 text-[#4a3d33] font-medium">
                              <span className="w-3 h-3 rounded-full bg-[#8c3c3c] inline-block"></span>
                              Retail Investors
                            </span>
                            <span className="font-bold text-[#2a1f17]">8%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Investor Toolkit */}
              <section className="py-20 max-w-7xl mx-auto px-8 text-left">
                <h3 className="text-4xl font-serif mb-4 italic text-[#2a1f17]">Investor Toolkit</h3>
                <p className="text-[#605850] mb-12 max-w-xl">
                  Essential resources to analyze operations, track announcements, and audit yields.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <a className="group p-8 bg-white border border-[#d8d0c8]/60 rounded-2xl hover:bg-[#c2652a] hover:border-[#c2652a] transition-all duration-300 block shadow-sm" href="#">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-[#c2652a]/5 rounded-xl flex items-center justify-center text-[#c2652a] group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <FileText strokeWidth={1.5} className="w-6 h-6" />
                      </div>
                      <ArrowUpRight className="text-[#9a9088] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-serif font-bold mb-2 text-[#2a1f17] group-hover:text-white transition-colors">Income Reports</h4>
                    <p className="text-sm text-[#605850] group-hover:text-white/80 transition-colors leading-relaxed">Quarterly distribution updates, tax certificates, and infrastructure yield breakdowns.</p>
                  </a>

                  <a className="group p-8 bg-white border border-[#d8d0c8]/60 rounded-2xl hover:bg-[#c2652a] hover:border-[#c2652a] transition-all duration-300 block shadow-sm" href="#">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-[#c2652a]/5 rounded-xl flex items-center justify-center text-[#c2652a] group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <Calendar strokeWidth={1.5} className="w-6 h-6" />
                      </div>
                      <ArrowUpRight className="text-[#9a9088] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-serif font-bold mb-2 text-[#2a1f17] group-hover:text-white transition-colors">Distribution Calendar</h4>
                    <p className="text-sm text-[#605850] group-hover:text-white/80 transition-colors leading-relaxed">Filing timelines, expected payout windows, and upcoming stakeholder assemblies.</p>
                  </a>

                  <a className="group p-8 bg-white border border-[#d8d0c8]/60 rounded-2xl hover:bg-[#c2652a] hover:border-[#c2652a] transition-all duration-300 block shadow-sm" href="#">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-[#c2652a]/5 rounded-xl flex items-center justify-center text-[#c2652a] group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <Mail strokeWidth={1.5} className="w-6 h-6" />
                      </div>
                      <ArrowUpRight className="text-[#9a9088] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-serif font-bold mb-2 text-[#2a1f17] group-hover:text-white transition-colors">Stakeholder Alert System</h4>
                    <p className="text-sm text-[#605850] group-hover:text-white/80 transition-colors leading-relaxed">Direct updates regarding capital allocations and financial audit disclosures.</p>
                  </a>
                </div>
              </section>

              {/* Leadership & Governance */}
              <section className="py-20 bg-[#e6e0d6]/70">
                <div className="max-w-7xl mx-auto px-8">
                  <div className="text-center mb-16">
                    <h3 className="text-4xl font-serif italic mb-4 text-[#2a1f17]">Leadership & Governance</h3>
                    <p className="text-[#605850] max-w-xl mx-auto">
                      Managed by seasoned professionals in compliance, infrastructure operations, and corporate asset stewardship.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="group">
                      <div className="aspect-[4/5] bg-stone-200 rounded-2xl overflow-hidden mb-6 relative shadow-sm">
                        <img alt="James Hartwell portrait" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwrDoHyrhAs94HNtFRmLnwAhJSdPllKl4Z2kzBo5chu_9JH5vbWmCgCmT29LIsWOTcm0yeZxUYf3W3sQ6ezNS4cZoy-ya3WQMNmPCVgum0RR-dWWkZD9deNV1qNNTAoO0YEbRJN1vs289I85kr5lnlYO0MXMeiMz4Pwums1OQR4NNZ20ywQr9F4eoX2J8IDITl3BxD9mBEmBroUhSrcNlPlyYIPrp2AHY_wBInhIds5l0EcAPUru22LVfKCzFAV1GMLbP43c6WwhcL"/>
                        <div className="absolute inset-0 bg-[#c2652a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h4 className="text-xl font-serif font-bold italic text-[#2a1f17]">James Hartwell</h4>
                      <p className="text-xs text-[#c2652a] uppercase tracking-widest font-semibold mt-1">Chief Executive Officer</p>
                    </div>

                    <div className="group">
                      <div className="aspect-[4/5] bg-stone-200 rounded-2xl overflow-hidden mb-6 relative shadow-sm">
                        <img alt="Priya Nair portrait" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVf_E3hCx7ypSWNGyWxfGyzvEwWohEZxnBtH4MrkBqibJbmC3jtozg-HFKwvtrf3GzYu21fHY0TapC9__xGJWPqSJVLDL8zYiJEc3JzWoZ2sQgUUgoGRDEI4LU9lF7ZkaZyvah31ogZ5-w9bCAEd6ibcf5wumb7OBauVhBRUa2_Vpa_67tGxPlC3jneDNm_1z7xKFGTaFchKrhYaDZE4M-NY0Cu5vQTFRdLoT1nxVJmIrahbARmVKNYycDZYxLBCk2eq5tpavJ1zSs"/>
                        <div className="absolute inset-0 bg-[#c2652a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h4 className="text-xl font-serif font-bold italic text-[#2a1f17]">Priya Nair</h4>
                      <p className="text-xs text-[#c2652a] uppercase tracking-widest font-semibold mt-1">Chief Financial Officer</p>
                    </div>

                    <div className="group">
                      <div className="aspect-[4/5] bg-stone-200 rounded-2xl overflow-hidden mb-6 relative shadow-sm">
                        <img alt="David Okafor portrait" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD84xzr8bQgFYBmbOZYLu7xaA00JVbOz6ZfUMPOAV0ASJbc9X_dMA_jGCrAzHDR_DyimKUFB4SqZOq_RRbSFrYOoKaXP5DJLeUYu8OkYSq36CH-rD5T2FnbO60hyhLZj7VHBs0t64dHKpTzJecinCuNdGO2bl4ROQ_MxOjFsaH70h1WFB_7pq_XbhmzjKbJMuNHm4Cgu5A9X0VINnEisymg6rNy5BBvvLlcO33h4J5TKm7fL4XUaSqfVX5hVEYpvg3jyIKm1eYHB11y"/>
                        <div className="absolute inset-0 bg-[#c2652a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h4 className="text-xl font-serif font-bold italic text-[#2a1f17]">David Okafor</h4>
                      <p className="text-xs text-[#c2652a] uppercase tracking-widest font-semibold mt-1">Lead Independent Director</p>
                    </div>

                    <div className="group">
                      <div className="aspect-[4/5] bg-stone-200 rounded-2xl overflow-hidden mb-6 relative shadow-sm">
                        <img alt="Mei-Lin Torres portrait" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5tKXmJ03-znjBA0l9jLffDqs761mB4qNhKvQeTrWJj__7XDRXkZwyVUAPy8ItQYtyePatGD-fp2mkR9EvleheaCoXtedN-bqt0yV0BW191xx_gtq2tblFIvBxXX2Y-HA8MiUrp0X3HwkJ2ea_UCzXA363kOlktMu8yMn31s4MAfMYF1vxz_PRbkahsAMwO9qZlEAtcOClKRiPXhzcfyAjdz_H5qVaRmRBUdds8YdrDYDUc1MhMGB0GjCw_o1aHNnSWp1bra1coXoc"/>
                        <div className="absolute inset-0 bg-[#c2652a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h4 className="text-xl font-serif font-bold italic text-[#2a1f17]">Mei-Lin Torres</h4>
                      <p className="text-xs text-[#c2652a] uppercase tracking-widest font-semibold mt-1">Head of Risk & Compliance</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* IR CTA Section */}
              <section className="py-24 bg-white text-center">
                <div className="max-w-4xl mx-auto px-8">
                  <span className="text-[#c2652a] font-medium tracking-widest text-xs uppercase mb-4 block">Get in Touch</span>
                  <h3 className="text-4xl font-serif italic mb-6 text-[#2a1f17]">Ready to evaluate Cloud Income?</h3>
                  <p className="text-base text-[#605850] font-light mb-10 max-w-lg mx-auto">
                    Connect with our capital relations desks to receive a prospectus or schedule a one-on-one conference.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/contact" className="bg-[#c2652a] text-white px-10 py-4 rounded-xl font-medium hover:opacity-90 transition-all block shadow-md">
                      Contact IR Desk
                    </Link>
                    <button className="border border-[#9a9088] px-10 py-4 rounded-xl font-medium hover:bg-[#faf5ee] text-[#3a302a] transition-all">
                      Request Prospectus Package
                    </button>
                  </div>
                </div>
              </section>

            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
}
