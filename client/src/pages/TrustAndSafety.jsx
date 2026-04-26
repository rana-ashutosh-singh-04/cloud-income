import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
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

export default function TrustAndSafety() {
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
    <div className="min-h-screen bg-[#faf5ee]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#c2652a] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-[#ffffff]" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#ffffff]">
            Trust & Safety
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Your security is our top priority. We use bank-grade encryption and 
            industry-leading security practices to keep your money and data safe.
          </p>
        </div>
      </section>

      {/* Security Stats */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-[#ffffff] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)] shadow-[0_2px_16px_rgba(58,48,42,0.06)] text-center">
                <Icon className="w-10 h-10 text-[#c2652a] mx-auto mb-4" />
                <p className="text-3xl font-bold text-[#2a1f17] mb-2">{stat.value}</p>
                <p className="text-sm text-[#8c7e72]">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security Features */}
      <section className="bg-[#f3ece0] py-16 px-6 border-t border-b border-[rgba(216,208,200,0.7)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2a1f17] mb-4">Security Features</h2>
            <p className="text-lg text-[#605850]">
              Multiple layers of protection to keep your account and transactions secure
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-[#ffffff] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)] shadow-[0_2px_16px_rgba(58,48,42,0.06)] hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#c2652a]/10 rounded-[12px] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#c2652a]" />
                  </div>
                  <h3 className="font-bold text-[#2a1f17] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#8c7e72]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2a1f17] mb-4">Certifications & Compliance</h2>
          <p className="text-lg text-[#605850]">
            We meet the highest industry standards for security and compliance
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <div key={index} className="bg-[#ffffff] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)] shadow-[0_2px_16px_rgba(58,48,42,0.06)] text-center hover:border-[#c2652a] transition">
                <Icon className="w-10 h-10 text-[#c2652a] mx-auto mb-4" />
                <h3 className="font-bold text-[#2a1f17] mb-2">{cert.name}</h3>
                <p className="text-xs text-[#8c7e72]">{cert.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety Tips */}
      <section className="bg-[#f3ece0] py-16 px-6 border-t border-b border-[rgba(216,208,200,0.7)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2a1f17] mb-4">Safety Tips</h2>
            <p className="text-lg text-[#605850]">
              Follow these tips to keep your account and transactions safe
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div key={index} className="bg-[#ffffff] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)] shadow-[0_2px_16px_rgba(58,48,42,0.06)]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#c2652a]/10 rounded-[12px] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#c2652a]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2a1f17] mb-2">{tip.title}</h3>
                      <p className="text-sm text-[#8c7e72]">{tip.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Report Security Issue */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-[#8c3c3c] rounded-[16px] p-8 text-white shadow-[0_2px_16px_rgba(58,48,42,0.06)]">
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="w-8 h-8 flex-shrink-0 text-[#ffffff]" />
            <div>
              <h2 className="text-3xl font-bold mb-2 text-[#ffffff]">Report a Security Issue</h2>
              <p className="text-lg opacity-90 text-[#ffffff]">
                If you've noticed any suspicious activity or believe your account has been compromised, 
                contact us immediately. We take security issues very seriously.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:security@Cloudincome.com" 
              className="px-6 py-3 bg-[#ffffff] text-[#8c3c3c] rounded-[8px] font-semibold hover:bg-[#faf5ee] transition text-center"
            >
              Email Security Team
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 border border-white text-[#ffffff] rounded-[8px] font-semibold hover:bg-white/10 transition text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy Policy Link */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-[#ffffff] rounded-[16px] p-8 border border-[rgba(216,208,200,0.7)] shadow-[0_2px_16px_rgba(58,48,42,0.06)] text-center">
          <h3 className="text-2xl font-bold text-[#2a1f17] mb-4">Learn More</h3>
          <p className="text-[#605850] mb-6">
            Read our comprehensive privacy policy and terms of service to understand 
            how we protect and handle your data.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="px-6 py-3 bg-[#c2652a]/10 border border-[#c2652a]/20 text-[#c2652a] rounded-[8px] font-semibold hover:bg-[#c2652a]/20 transition">
              Privacy Policy
            </a>
            <a href="#" className="px-6 py-3 bg-[#c2652a]/10 border border-[#c2652a]/20 text-[#c2652a] rounded-[8px] font-semibold hover:bg-[#c2652a]/20 transition">
              Terms of Service
            </a>
            <a href="#" className="px-6 py-3 bg-[#c2652a]/10 border border-[#c2652a]/20 text-[#c2652a] rounded-[8px] font-semibold hover:bg-[#c2652a]/20 transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
