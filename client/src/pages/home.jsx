import React, { lazy, Suspense, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { Send, Receipt, Smartphone, CreditCard, Zap, Shield, TrendingUp, Users, Lock, Clock, Globe, BarChart3, Briefcase } from "lucide-react";
import Navbar from "../components/Navbar";
import LazySection from "../components/LazySection";

// Lazy load heavy components for code splitting (Next.js-like optimization)
const Footer = lazy(() => import("../components/Footer"));
import Hero from "../components/Hero";
import FeatureHighlight from "../components/FeatureHighlight";
import TestimonialCard from "../components/TestimonialCard";
import StockMarketWidget from "../components/StockMarketWidget";
import LandingContent from "../components/LandingContent";

import { useAuth } from "../hooks/useAuth";

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c2652a]"></div>
  </div>
);

// Memoized Service Card Component for better performance
const ServiceCard = memo(({ service }) => {
  const Icon = service.icon;

  return (
    <Link
      to={service.link}
      className="bg-white rounded-[16px] p-6 shadow-[0_2px_16px_rgba(58,48,42,0.06)] hover:shadow-xl transition-all text-center group relative overflow-hidden border border-[rgba(216,208,200,0.7)] hover:border-[#c2652a]"
    >
      {/* Hover Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-[#c2652a] to-[#a8541f] opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

      <div className={`bg-[#c2652a] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg relative z-10`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="font-bold text-[#2a1f17] mb-1 group-hover:text-[#c2652a] transition-colors relative z-10">
        {service.title}
      </h3>
      <p className="text-xs text-[#8c7e72] relative z-10">{service.desc}</p>
    </Link>
  );
});

ServiceCard.displayName = 'ServiceCard';

function Home() {
  const { user } = useAuth();

  // Memoize data to prevent unnecessary re-renders (Next.js-like optimization)
  const services = useMemo(() => [
    { icon: Send, title: "Send Money", desc: "Transfer to anyone instantly", link: "/send" },
    { icon: Receipt, title: "Pay Bills", desc: "Electricity, Water & More", link: "/bills" },
    { icon: Smartphone, title: "Recharge", desc: "Mobile, DTH & Data Card", link: "/recharge" },
    { icon: CreditCard, title: "Credit Card", desc: "Pay credit card bills", link: "/credit" },
    { icon: BarChart3, title: "Stock Market", desc: "Trade stocks & track trends", link: "/stocks" },
    { icon: Briefcase, title: "Freelance Gigs", desc: "Earn & secure payouts in Escrow", link: "/our-solutions" },
  ], []);

  const features = useMemo(() => [
    {
      icon: Shield,
      title: "100% Secure",
      desc: "Bank-grade encryption, PCI DSS compliance, and secured milestone escrow guarantees that protect both freelancers and clients."
    },
    {
      icon: Zap,
      title: "Instant Payments",
      desc: "Transfer money via UPI in seconds, or receive immediate release of freelance escrow payouts straight to your bank account."
    },
    {
      icon: Users,
      title: "61+ Crore Users",
      desc: "Join millions of Indians who trust Cloud Income for personal payments and secure gig workspace contract transactions."
    },
    {
      icon: Lock,
      title: "Privacy First",
      desc: "Your data is protected with industry-leading privacy standards. We never share your information."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      desc: "Round-the-clock customer support to help you with any queries or issues you might face."
    },
    {
      icon: Globe,
      title: "Widely Accepted",
      desc: "Accepted at over 4.4 crore merchants across India - from local shops to major brands."
    }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: "Rahul Sharma",
      role: "Business Owner",
      content: "Cloud income has revolutionized how I accept payments. It's fast, secure, and my customers love it!",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Freelancer",
      content: "Sending money to clients has never been easier. The instant transfers are a game-changer.",
      rating: 5
    },
    {
      name: "Amit Kumar",
      role: "Student",
      content: "Best payment app! Simple UI, quick transactions, and great offers. Highly recommended!",
      rating: 5
    }
  ], []);

  return (
    <div className="min-h-screen bg-[#faf5ee]">
      <Navbar />

      {/* Hero Section */}
      <Hero />
      
      {/* New Landing Content based on image reference */}
      <LandingContent />

      {/* Stock Market Section */}
      <div className="bg-white">
        <StockMarketWidget />
      </div>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2a1f17] mb-4">
            {user ? "Quick Actions" : "All Payment Solutions"}
          </h2>
          <p className="text-lg text-[#605850] max-w-2xl mx-auto">
            Everything you need for seamless digital payments, all in one place
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </section>

      {/* Features Section - Lazy Loaded */}
      {!user && (
        <LazySection fallback={<SectionLoader />}>
          <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Why Choose Cloud income?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Experience the best in digital payments with features designed for modern India
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <FeatureHighlight
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.desc}
                    delay={0}
                  />
                ))}
              </div>
            </div>
          </section>
        </LazySection>
      )}

      {/* Testimonials Section - Lazy Loaded */}
      {!user && (
        <LazySection fallback={<SectionLoader />}>
          <section className="bg-[#f3ece0] py-20 px-6 border-t border-[rgba(216,208,200,0.7)]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-[#2a1f17] mb-4">
                  Loved by Millions
                </h2>
                <p className="text-lg text-[#605850] max-w-2xl mx-auto">
                  See what our users have to say about their Cloud income experience
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={index}
                    name={testimonial.name}
                    role={testimonial.role}
                    content={testimonial.content}
                    rating={testimonial.rating}
                    delay={0}
                  />
                ))}
              </div>
            </div>
          </section>
        </LazySection>
      )}

      {/* Footer - Lazy Loaded */}
      <Suspense fallback={<div className="min-h-[400px] bg-[#faf5ee]"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default memo(Home);
