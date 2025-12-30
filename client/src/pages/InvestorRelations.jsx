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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Financial Highlights</h2>
          <p className="text-lg text-gray-600">Key metrics that drive our success</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialHighlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 text-purple-600" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stock Information */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Stock Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Price</p>
                <p className="text-2xl font-bold text-gray-900">₹1,234.56</p>
                <p className="text-sm text-green-600 mt-1">+2.5% (1D)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Market Cap</p>
                <p className="text-2xl font-bold text-gray-900">₹50,000 Cr</p>
                <p className="text-sm text-gray-500 mt-1">As of today</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">52 Week Range</p>
                <p className="text-2xl font-bold text-gray-900">₹1,000 - ₹1,500</p>
                <p className="text-sm text-gray-500 mt-1">High - Low</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reports & Documents */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Reports & Documents</h2>
          <p className="text-lg text-gray-600">Access our latest financial reports and disclosures</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.date}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                  {report.type}
                </span>
              </div>
              <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600">Join us for investor meetings and earnings calls</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {event.type}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{event.date}</p>
                <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm">
                  Register <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Investor Relations */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-lg opacity-90 mb-6">
            Our Investor Relations team is here to help. Reach out for any queries about 
            our financial performance or strategic direction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:investors@phonepay.com" 
              className="px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Email Investor Relations
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition"
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

