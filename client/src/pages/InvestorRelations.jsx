import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Calendar, 
  Download,
  DollarSign,
  Users,
  Globe,
  Award,
  ArrowRight
} from "lucide-react";

export default function InvestorRelations() {
  const financialHighlights = [
    { label: "Total Users", value: "61+ Crore", icon: Users },
    { label: "Annual Revenue", value: "₹2,000+ Cr", icon: DollarSign },
    { label: "Market Presence", value: "Pan-India", icon: Globe },
    { label: "Awards Won", value: "50+", icon: Award }
  ];

  const reports = [
    { title: "Annual Report 2024", date: "March 2024", type: "PDF" },
    { title: "Quarterly Report Q4 2024", date: "December 2024", type: "PDF" },
    { title: "Quarterly Report Q3 2024", date: "September 2024", type: "PDF" },
    { title: "ESG Report 2024", date: "March 2024", type: "PDF" }
  ];

  const events = [
    { title: "Annual General Meeting", date: "June 15, 2024", type: "Virtual" },
    { title: "Q4 Earnings Call", date: "May 10, 2024", type: "Virtual" },
    { title: "Investor Day", date: "September 20, 2024", type: "Hybrid" }
  ];

  return (
    <div className="min-h-screen bg-[#faf5ee]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#c2652a] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#ffffff]">
            Investor Relations
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Building trust through transparency. Discover our financial performance, 
            strategic initiatives, and commitment to sustainable growth.
          </p>
        </div>
      </section>

      {/* Financial Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2a1f17] mb-4">Financial Highlights</h2>
          <p className="text-lg text-[#605850]">Key metrics that drive our success</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialHighlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-[#ffffff] rounded-2xl p-6 border border-[rgba(216,208,200,0.7)] shadow-[0_2px_16px_rgba(58,48,42,0.06)]">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 text-[#c2652a]" />
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-[#2a1f17] mb-2">{item.value}</p>
                <p className="text-sm text-[#605850]">{item.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stock Information */}
      <section className="bg-[#f3ece0] py-16 px-6 border-t border-[rgba(216,208,200,0.7)] border-b">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#ffffff] rounded-2xl p-8 shadow-[0_2px_16px_rgba(58,48,42,0.06)] border border-[rgba(216,208,200,0.7)]">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8 text-[#c2652a]" />
              <h2 className="text-3xl font-bold text-[#2a1f17]">Stock Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-[#605850] mb-2">Current Price</p>
                <p className="text-2xl font-bold text-[#2a1f17]">₹1,234.56</p>
                <p className="text-sm text-green-600 mt-1">+2.5% (1D)</p>
              </div>
              <div>
                <p className="text-sm text-[#605850] mb-2">Market Cap</p>
                <p className="text-2xl font-bold text-[#2a1f17]">₹50,000 Cr</p>
                <p className="text-sm text-[#8c7e72] mt-1">As of today</p>
              </div>
              <div>
                <p className="text-sm text-[#605850] mb-2">52 Week Range</p>
                <p className="text-2xl font-bold text-[#2a1f17]">₹1,000 - ₹1,500</p>
                <p className="text-sm text-[#8c7e72] mt-1">High - Low</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reports & Documents */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2a1f17] mb-4">Reports & Documents</h2>
          <p className="text-lg text-[#605850]">Access our latest financial reports and disclosures</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <div key={index} className="bg-[#ffffff] border border-[rgba(216,208,200,0.7)] rounded-[16px] p-6 hover:shadow-[0_2px_16px_rgba(58,48,42,0.06)] transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#c2652a]" />
                  <div>
                    <h3 className="font-bold text-[#2a1f17]">{report.title}</h3>
                    <p className="text-sm text-[#605850]">{report.date}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#c2652a]/10 text-[#c2652a] border border-[#c2652a]/20 rounded-full text-xs font-semibold">
                  {report.type}
                </span>
              </div>
              <button className="flex items-center gap-2 text-[#c2652a] hover:text-[#a8541f] font-semibold transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-[#f3ece0] py-16 px-6 border-t border-[rgba(216,208,200,0.7)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2a1f17] mb-4">Upcoming Events</h2>
            <p className="text-lg text-[#605850]">Join us for investor meetings and earnings calls</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={index} className="bg-[#ffffff] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)] shadow-[0_2px_16px_rgba(58,48,42,0.06)]">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-[#c2652a]" />
                  <span className="px-3 py-1 bg-[#c2652a]/10 text-[#c2652a] border border-[#c2652a]/20 rounded-full text-xs font-semibold">
                    {event.type}
                  </span>
                </div>
                <h3 className="font-bold text-[#2a1f17] mb-2">{event.title}</h3>
                <p className="text-sm text-[#605850] mb-4">{event.date}</p>
                <button className="flex items-center gap-2 text-[#c2652a] hover:text-[#a8541f] font-semibold text-sm transition-colors">
                  Register <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Investor Relations */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-[#c2652a] rounded-[16px] p-8 text-white text-center shadow-[0_2px_16px_rgba(58,48,42,0.06)]">
          <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-lg opacity-90 mb-6">
            Our Investor Relations team is here to help. Reach out for any queries about 
            our financial performance or strategic direction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:investors@Cloud income.com" 
              className="px-6 py-3 bg-white text-[#c2652a] rounded-[8px] font-semibold hover:bg-[#faf5ee] transition-colors"
            >
              Email Investor Relations
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 border border-[rgba(216,208,200,0.7)] text-white rounded-[8px] font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
