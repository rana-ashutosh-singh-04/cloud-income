import { useState } from "react";
import emailjs from "@emailjs/browser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send,
  Headphones,
  FileText,
  HelpCircle,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = (e) => {
  e.preventDefault(); 

  emailjs
    .send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,      
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      },
     import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      console.log("Email sent successfully");

      setSubmitted(true);

      // form reset
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => setSubmitted(false), 3000);
    })
    .catch((error) => {
      console.error("Email send failed:", error);
      alert("Failed to send message. Please try again.");
    });
};


  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      details: "+91-620-228-5568",
      description: "24/7 customer support"
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "singhrananshutosh6@gmail.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Office Address",
      details: "Cloud income Tower, Bangalore",
      description: "Visit us Monday - Friday, 9 AM - 6 PM"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "24/7 Support Available",
      description: "Customer service always ready"
    }
  ];

  const quickLinks = [
    { icon: HelpCircle, title: "Help Center", link: "#", description: "FAQs and guides" },
    { icon: FileText, title: "Documentation", link: "#", description: "API and developer docs" },
    { icon: Headphones, title: "Live Chat", link: "#", description: "Chat with support" }
  ];

  return (
    <div className="min-h-screen bg-[#faf5ee]">
      <Navbar />
      
      {/* Hero Section (Figma Inspired) */}
      <section className="bg-[#faf5ee] relative flex items-center justify-center pt-32 pb-16 px-6 overflow-hidden">
        {/* Ghost Text Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-bold text-[#c2652a] opacity-[0.04] whitespace-nowrap select-none pointer-events-none tracking-tighter">
          LET'S TALK!
        </div>

        <div className="max-w-7xl w-full mx-auto bg-[#ffffff] rounded-[32px] overflow-hidden shadow-xl relative z-10 flex flex-col lg:flex-row border border-[rgba(216,208,200,0.7)]">
          {/* Left Side - Visual & Branding */}
          <div className="w-full lg:w-1/2 p-12 lg:p-16 flex flex-col justify-between bg-[rgba(250,245,238,0.5)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#c2652a]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c2652a]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <h1 className="text-6xl md:text-8xl font-bold text-[#2a1f17] font-serif leading-[0.9] tracking-tight mb-8">
                Let's<br/>
                <span className="text-[#c2652a] relative inline-block">
                  talk!
                  <span className="absolute inset-0 text-[#c2652a] opacity-30 translate-x-1 translate-y-1 blur-sm pointer-events-none">talk!</span>
                  <span className="absolute inset-0 text-[#c2652a] opacity-30 -translate-x-1 -translate-y-1 blur-sm pointer-events-none">talk!</span>
                </span>
              </h1>
              <p className="text-[#605850] text-lg font-medium max-w-sm leading-snug">
                We're here to help! Reach out to us through any of the channels below, and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>

          {/* Right Side - Community info */}
          <div className="w-full lg:w-1/2 p-12 lg:p-16 bg-white flex flex-col justify-center items-start lg:items-end text-left lg:text-right border-t lg:border-t-0 lg:border-l border-[rgba(216,208,200,0.7)]">
            <div className="mb-8 w-full">
              <span className="text-sm font-bold tracking-widest text-[#c2652a] uppercase mb-4 block">Join Our Community</span>
              <p className="text-[#605850] text-base leading-relaxed max-w-sm lg:ml-auto">
                Connect with us on social media for the latest updates, feature announcements, and to join a community of like-minded individuals building the future of finance.
              </p>
            </div>
            
            <div className="flex gap-4 lg:justify-end w-full">
               <a href="#" className="w-12 h-12 rounded-full border border-[rgba(216,208,200,0.7)] flex items-center justify-center hover:bg-[#c2652a] hover:border-[#c2652a] hover:text-white transition-all text-[#2a1f17] shadow-sm">
                 <Twitter className="w-5 h-5" />
               </a>
               <a href="#" className="w-12 h-12 rounded-full border border-[rgba(216,208,200,0.7)] flex items-center justify-center hover:bg-[#c2652a] hover:border-[#c2652a] hover:text-white transition-all text-[#2a1f17] shadow-sm">
                 <Linkedin className="w-5 h-5" />
               </a>
               <a href="#" className="w-12 h-12 rounded-full border border-[rgba(216,208,200,0.7)] flex items-center justify-center hover:bg-[#c2652a] hover:border-[#c2652a] hover:text-white transition-all text-[#2a1f17] shadow-sm">
                 <Instagram className="w-5 h-5" />
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={index} className="bg-[#ffffff] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)] shadow-[0_2px_16px_rgba(58,48,42,0.06)] hover:shadow-xl transition-shadow">
                <div className={`bg-[#c2652a] w-12 h-12 rounded-[12px] flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#2a1f17] mb-2">{method.title}</h3>
                <p className="text-lg font-semibold text-[#2a1f17] mb-1 break-all">{method.details}</p>
                <p className="text-sm text-[#8c7e72]">{method.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#ffffff] rounded-[16px] p-8 border border-[rgba(216,208,200,0.7)] shadow-[0_2px_16px_rgba(58,48,42,0.06)]">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-[#c2652a]" />
                <h2 className="text-3xl font-bold text-[#2a1f17]">Send us a Message</h2>
              </div>
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-800 font-semibold">
                    ✓ Thank you! Your message has been sent. We'll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#605850] mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33]"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#605850] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#605850] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33]"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#605850] mb-2">
                    Subject *
                  </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33]"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#605850] mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-[rgba(216,208,200,0.7)] rounded-[8px] focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#4a3d33] resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#c2652a] text-white rounded-[8px] font-bold text-lg hover:bg-[#a8541f] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div className="bg-[#f3ece0] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)]">
              <h3 className="font-bold text-[#2a1f17] mb-4">Quick Links</h3>
              <div className="space-y-4">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.link}
                      className="flex items-start gap-3 p-3 bg-[#ffffff] border border-[rgba(216,208,200,0.7)] rounded-[8px] hover:shadow-md transition"
                    >
                      <Icon className="w-5 h-5 text-[#c2652a] mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#2a1f17] text-sm">{link.title}</p>
                        <p className="text-xs text-[#8c7e72]">{link.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#ffffff] rounded-[16px] p-6 border border-[rgba(216,208,200,0.7)] shadow-[0_2px_16px_rgba(58,48,42,0.06)]">
              <h3 className="font-bold text-[#2a1f17] mb-4">Response Time</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#605850]">Email Support</span>
                  <span className="font-semibold text-[#2a1f17]">Within 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#605850]">Phone Support</span>
                  <span className="font-semibold text-[#2a1f17]">Immediate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#605850]">Live Chat</span>
                  <span className="font-semibold text-[#2a1f17]">Within 5 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
