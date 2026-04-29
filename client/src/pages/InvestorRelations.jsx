import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  TrendingUp, 
  FileText, 
  Calendar, 
  Download,
  Mail,
  ArrowUpRight
} from "lucide-react";

export default function InvestorRelations() {
  const [activeTab, setActiveTab] = useState('q4');

  return (
    <div className="min-h-screen bg-[#faf5ee] text-[#3a302a] font-sans antialiased relative investor-page">
      <style>{`
        .investor-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.018;
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
          opacity: 0.06;
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
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { opacity: 0; animation: fadeUp 0.7s ease-out forwards; }
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.45s; }
        .delay-4 { animation-delay: 0.6s; }
      `}</style>

      <Navbar />

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Decorative cloud blobs */}
          <svg className="cloud-deco" style={{width: '700px', top: '-80px', right: '-120px'}} viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="380" cy="180" rx="280" ry="200" fill="#c2652a"/>
            <ellipse cx="560" cy="120" rx="160" ry="130" fill="#8c3c3c"/>
          </svg>

          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="max-w-2xl fade-up">
              <span className="text-[#c2652a] font-medium tracking-widest text-xs uppercase mb-4 block">Stakeholder Transparency</span>
              <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] text-[#3a302a] mb-8 italic">
                Passive Income,<br/>Built on Cloud.
              </h1>
              <p className="text-xl text-[#605850] font-light leading-relaxed mb-10 max-w-lg fade-up delay-1">
                Generating recurring revenue through disciplined cloud infrastructure investments and transparent income distribution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 fade-up delay-2">
                <button className="bg-[#c2652a] text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  Latest Annual Report
                  <Download className="w-5 h-5" />
                </button>
                <button className="border border-[#9a9088] px-8 py-4 rounded-lg font-medium hover:bg-stone-100/40 transition-all text-center">
                  View Income Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Hero visual — cloud income illustration */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-70 pointer-events-none hidden lg:flex items-center justify-center pr-16">
            <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" style={{width: '100%', maxWidth: '480px'}}>
              {/* Background warm blob */}
              <ellipse cx="280" cy="180" rx="200" ry="160" fill="#f0e8dc" opacity="0.6"/>
              {/* Large cloud body */}
              <ellipse cx="240" cy="200" rx="170" ry="100" fill="#e8ddd0" opacity="0.7"/>
              <circle cx="160" cy="195" r="70" fill="#e8ddd0" opacity="0.7"/>
              <circle cx="300" cy="180" r="90" fill="#e8ddd0" opacity="0.7"/>
              <circle cx="220" cy="155" r="80" fill="#ddd4c8" opacity="0.6"/>
              {/* Income streams dropping from cloud */}
              <line x1="170" y1="260" x2="170" y2="310" stroke="#c2652a" strokeWidth="2" strokeDasharray="4 4" opacity="0.7"/>
              <line x1="220" y1="270" x2="220" y2="330" stroke="#c2652a" strokeWidth="2" strokeDasharray="4 4" opacity="0.7"/>
              <line x1="270" y1="260" x2="270" y2="315" stroke="#c2652a" strokeWidth="2" strokeDasharray="4 4" opacity="0.7"/>
              <line x1="320" y1="250" x2="320" y2="305" stroke="#8c3c3c" strokeWidth="2" strokeDasharray="4 4" opacity="0.6"/>
              {/* Drop coins / dots */}
              <circle cx="170" cy="318" r="10" fill="#c2652a" opacity="0.8"/>
              <circle cx="220" cy="338" r="10" fill="#c2652a" opacity="0.8"/>
              <circle cx="270" cy="323" r="10" fill="#c2652a" opacity="0.8"/>
              <circle cx="320" cy="312" r="10" fill="#8c3c3c" opacity="0.7"/>
              {/* Dollar signs inside coins */}
              <text x="166" y="322" fontFamily="EB Garamond,serif" fontSize="12" fill="white" fontWeight="600">$</text>
              <text x="216" y="342" fontFamily="EB Garamond,serif" fontSize="12" fill="white" fontWeight="600">$</text>
              <text x="266" y="327" fontFamily="EB Garamond,serif" fontSize="12" fill="white" fontWeight="600">$</text>
              <text x="316" y="316" fontFamily="EB Garamond,serif" fontSize="12" fill="white" fontWeight="600">$</text>
              {/* Upward trend line on cloud */}
              <polyline points="155,215 185,195 215,205 250,175 290,165 320,145" stroke="#c2652a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
              <circle cx="320" cy="145" r="5" fill="#c2652a" opacity="0.9"/>
            </svg>
          </div>
        </section>

        {/* Financial Performance */}
        <section className="bg-[#f6f0e8] py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <h2 className="text-4xl font-serif mb-4 italic text-[#2a1f17]">Income Performance</h2>
                <p className="text-[#605850] max-w-md">Consistent distributions across diversified cloud asset classes, anchored by recurring SaaS and infrastructure revenue.</p>
              </div>
              <div className="flex bg-[#faf5ee] p-1 rounded-lg border border-[#d8d0c8]">
                <button 
                  className={`px-6 py-2 text-sm font-medium rounded transition-colors ${activeTab === 'q4' ? 'bg-[#c2652a] text-white' : 'text-[#605850] hover:text-[#c2652a]'}`}
                  onClick={() => setActiveTab('q4')}
                >
                  Q4 2023
                </button>
                <button 
                  className={`px-6 py-2 text-sm font-medium rounded transition-colors ${activeTab === 'fy' ? 'bg-[#c2652a] text-white' : 'text-[#605850] hover:text-[#c2652a]'}`}
                  onClick={() => setActiveTab('fy')}
                >
                  FY 2023
                </button>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="bento-grid">

              {/* Bar chart card */}
              <div className="col-span-12 lg:col-span-8 bg-[#faf5ee] p-10 rounded-xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] relative overflow-hidden group border border-[rgba(216,208,200,0.4)]">
                <h3 className="text-2xl font-serif mb-8 text-[#2a1f17]">Distribution Momentum</h3>
                <div className="h-64 flex items-end gap-3 mb-4">
                  <div className="bar w-full bg-[#c2652a]/20 rounded-t-sm hover:bg-[#c2652a]/40 transition-all duration-500 cursor-pointer relative group/bar" style={{height: '30%'}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#605850] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">$0.82/sh</span>
                  </div>
                  <div className="bar w-full bg-[#c2652a]/20 rounded-t-sm hover:bg-[#c2652a]/40 transition-all duration-500 cursor-pointer relative group/bar" style={{height: '45%'}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#605850] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">$1.10/sh</span>
                  </div>
                  <div className="bar w-full bg-[#c2652a]/20 rounded-t-sm hover:bg-[#c2652a]/40 transition-all duration-500 cursor-pointer relative group/bar" style={{height: '62%'}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#605850] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">$1.44/sh</span>
                  </div>
                  <div className="bar w-full bg-[#c2652a]/20 rounded-t-sm hover:bg-[#c2652a]/40 transition-all duration-500 cursor-pointer relative group/bar" style={{height: '72%'}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#605850] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">$1.68/sh</span>
                  </div>
                  <div className="bar w-full bg-[#c2652a]/20 rounded-t-sm hover:bg-[#c2652a]/40 transition-all duration-500 cursor-pointer relative group/bar" style={{height: '82%'}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#605850] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">$1.97/sh</span>
                  </div>
                  <div className="bar w-full bg-[#c2652a] rounded-t-sm transition-all duration-500 cursor-pointer relative group/bar" style={{height: '100%'}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#c2652a] font-semibold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">$2.34/sh</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-sans text-[#605850] tracking-wider">
                  <span>2018</span><span>2019</span><span>2020</span><span>2021</span><span>2022</span><span>2023</span>
                </div>
              </div>

              {/* Yield highlight card */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#8c3c3c] text-white p-10 rounded-xl flex flex-col justify-between">
                <div>
                  <TrendingUp className="w-10 h-10 mb-6 block opacity-90" strokeWidth={1.5} />
                  <h3 className="text-4xl font-serif leading-tight italic">11.8%<br/>Annual Yield</h3>
                </div>
                <p className="text-sm opacity-80 mt-8">Exceeding benchmark indices for the 9th consecutive distribution cycle.</p>
              </div>

              {/* AUM stat card */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#ece6dc] p-10 rounded-xl">
                <h4 className="text-sm font-sans uppercase tracking-widest text-[#c2652a] mb-2">Assets Under Management</h4>
                <div className="text-5xl font-serif italic text-[#3a302a] mb-4">$2.4B</div>
                <p className="text-sm text-[#605850]">Deployed across SaaS, cloud infrastructure, and recurring API revenue streams.</p>
              </div>

              {/* Donut / investor composition */}
              <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-xl border border-[#d8d0c8] flex flex-col md:flex-row items-center gap-8">
                {/* SVG donut chart */}
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
                    <div className="text-[10px] uppercase font-sans text-[#605850]">Institutional</div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <h4 className="text-2xl font-serif mb-4 text-[#2a1f17]">Investor Composition</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-[#4a3d33]"><span className="w-3 h-3 rounded-full bg-[#c2652a] inline-block"></span> Institutional</span>
                      <span className="font-bold text-[#2a1f17]">68%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-[#4a3d33]"><span className="w-3 h-3 rounded-full bg-[#c2652a]/40 inline-block"></span> Private Wealth</span>
                      <span className="font-bold text-[#2a1f17]">24%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-[#4a3d33]"><span className="w-3 h-3 rounded-full bg-[#8c3c3c] inline-block"></span> Retail Investors</span>
                      <span className="font-bold text-[#2a1f17]">8%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Investor Toolkit */}
        <section className="py-24 max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-serif mb-4 italic text-[#2a1f17]">Investor Toolkit</h2>
          <p className="text-[#605850] mb-12 max-w-xl">Everything you need to track, research, and engage with your Cloud Income investment.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a className="group p-8 bg-[#faf5ee] border border-[#d8d0c8] rounded-xl hover:bg-[#c2652a] transition-all duration-300 block" href="#">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#c2652a]/10 rounded-lg flex items-center justify-center text-[#c2652a] group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <FileText strokeWidth={1.5} />
                </div>
                <ArrowUpRight className="text-[#9a9088] group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2 text-[#2a1f17] group-hover:text-white transition-colors">Income Reports</h3>
              <p className="text-sm text-[#605850] group-hover:text-white/80 transition-colors">Quarterly distribution summaries and detailed asset-level income breakdowns.</p>
            </a>

            <a className="group p-8 bg-[#faf5ee] border border-[#d8d0c8] rounded-xl hover:bg-[#c2652a] transition-all duration-300 block" href="#">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#c2652a]/10 rounded-lg flex items-center justify-center text-[#c2652a] group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <Calendar strokeWidth={1.5} />
                </div>
                <ArrowUpRight className="text-[#9a9088] group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2 text-[#2a1f17] group-hover:text-white transition-colors">Distribution Calendar</h3>
              <p className="text-sm text-[#605850] group-hover:text-white/80 transition-colors">Upcoming payment dates, ex-dividend dates, and investor roadshows.</p>
            </a>

            <a className="group p-8 bg-[#faf5ee] border border-[#d8d0c8] rounded-xl hover:bg-[#c2652a] transition-all duration-300 block" href="#">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#c2652a]/10 rounded-lg flex items-center justify-center text-[#c2652a] group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <Mail strokeWidth={1.5} />
                </div>
                <ArrowUpRight className="text-[#9a9088] group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2 text-[#2a1f17] group-hover:text-white transition-colors">Email Alerts</h3>
              <p className="text-sm text-[#605850] group-hover:text-white/80 transition-colors">Subscribe for immediate notification of distributions, SEC filings, and news.</p>
            </a>
          </div>
        </section>

        {/* Leadership / Governance */}
        <section className="py-24 bg-[#e6e0d6]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif italic mb-6 text-[#2a1f17]">Leadership & Governance</h2>
              <p className="text-[#605850] max-w-xl mx-auto">Led by a diverse team of independent directors committed to the highest standards of fiduciary responsibility and digital infrastructure expertise.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group">
                <div className="aspect-[4/5] bg-stone-200 rounded-xl overflow-hidden mb-6 relative">
                  <img alt="executive portrait" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwrDoHyrhAs94HNtFRmLnwAhJSdPllKl4Z2kzBo5chu_9JH5vbWmCgCmT29LIsWOTcm0yeZxUYf3W3sQ6ezNS4cZoy-ya3WQMNmPCVgum0RR-dWWkZD9deNV1qNNTAoO0YEbRJN1vs289I85kr5lnlYO0MXMeiMz4Pwums1OQR4NNZ20ywQr9F4eoX2J8IDITl3BxD9mBEmBroUhSrcNlPlyYIPrp2AHY_wBInhIds5l0EcAPUru22LVfKCzFAV1GMLbP43c6WwhcL"/>
                  <div className="absolute inset-0 bg-[#c2652a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="text-xl font-serif font-bold italic text-[#2a1f17]">James Hartwell</h4>
                <p className="text-sm text-[#c2652a] uppercase tracking-widest font-medium">Chief Executive Officer</p>
              </div>

              <div className="group">
                <div className="aspect-[4/5] bg-stone-200 rounded-xl overflow-hidden mb-6 relative">
                  <img alt="executive portrait" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVf_E3hCx7ypSWNGyWxfGyzvEwWohEZxnBtH4MrkBqibJbmC3jtozg-HFKwvtrf3GzYu21fHY0TapC9__xGJWPqSJVLDL8zYiJEc3JzWoZ2sQgUUgoGRDEI4LU9lF7ZkaZyvah31ogZ5-w9bCAEd6ibcf5wumb7OBauVhBRUa2_Vpa_67tGxPlC3jneDNm_1z7xKFGTaFchKrhYaDZE4M-NY0Cu5vQTFRdLoT1nxVJmIrahbARmVKNYycDZYxLBCk2eq5tpavJ1zSs"/>
                  <div className="absolute inset-0 bg-[#c2652a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="text-xl font-serif font-bold italic text-[#2a1f17]">Priya Nair</h4>
                <p className="text-sm text-[#c2652a] uppercase tracking-widest font-medium">Chief Financial Officer</p>
              </div>

              <div className="group">
                <div className="aspect-[4/5] bg-stone-200 rounded-xl overflow-hidden mb-6 relative">
                  <img alt="executive portrait" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD84xzr8bQgFYBmbOZYLu7xaA00JVbOz6ZfUMPOAV0ASJbc9X_dMA_jGCrAzHDR_DyimKUFB4SqZOq_RRbSFrYOoKaXP5DJLeUYu8OkYSq36CH-rD5T2FnbO60hyhLZj7VHBs0t64dHKpTzJecinCuNdGO2bl4ROQ_MxOjFsaH70h1WFB_7pq_XbhmzjKbJMuNHm4Cgu5A9X0VINnEisymg6rNy5BBvvLlcO33h4J5TKm7fL4XUaSqfVX5hVEYpvg3jyIKm1eYHB11y"/>
                  <div className="absolute inset-0 bg-[#c2652a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="text-xl font-serif font-bold italic text-[#2a1f17]">David Okafor</h4>
                <p className="text-sm text-[#c2652a] uppercase tracking-widest font-medium">Lead Independent Director</p>
              </div>

              <div className="group">
                <div className="aspect-[4/5] bg-stone-200 rounded-xl overflow-hidden mb-6 relative">
                  <img alt="executive portrait" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5tKXmJ03-znjBA0l9jLffDqs761mB4qNhKvQeTrWJj__7XDRXkZwyVUAPy8ItQYtyePatGD-fp2mkR9EvleheaCoXtedN-bqt0yV0BW191xx_gtq2tblFIvBxXX2Y-HA8MiUrp0X3HwkJ2ea_UCzXA363kOlktMu8yMn31s4MAfMYF1vxz_PRbkahsAMwO9qZlEAtcOClKRiPXhzcfyAjdz_H5qVaRmRBUdds8YdrDYDUc1MhMGB0GjCw_o1aHNnSWp1bra1coXoc"/>
                  <div className="absolute inset-0 bg-[#c2652a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="text-xl font-serif font-bold italic text-[#2a1f17]">Mei-Lin Torres</h4>
                <p className="text-sm text-[#c2652a] uppercase tracking-widest font-medium">Head of Risk & Compliance</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-white text-center">
          <div className="max-w-4xl mx-auto px-8">
            <span className="text-[#c2652a] font-medium tracking-widest text-xs uppercase mb-6 block">Get Started</span>
            <h2 className="text-5xl font-serif italic mb-8 text-[#2a1f17]">Ready to earn from the cloud?</h2>
            <p className="text-xl text-[#605850] font-light mb-12">Connect with our Investor Relations team for inquiries or to schedule a one-on-one briefing.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-[#c2652a] text-white px-10 py-4 rounded-lg font-medium hover:opacity-90 transition-all block">Contact IR Team</Link>
              <button className="border border-[#9a9088] px-10 py-4 rounded-lg font-medium hover:bg-[#faf5ee] text-[#3a302a] transition-all">Request Data Package</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
