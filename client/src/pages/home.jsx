import React, { lazy, Suspense, useMemo, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Send, Receipt, Smartphone, CreditCard, Zap, Shield, TrendingUp, Users, Lock, Clock, Globe, BarChart3 } from "lucide-react";
import Navbar from "../components/Navbar";
import LazySection from "../components/LazySection";

// Lazy load heavy components for code splitting (Next.js-like optimization)
const Footer = lazy(() => import("../components/Footer"));
const HeroDecorations = lazy(() => import("../components/HeroDecorations"));
import FeatureHighlight from "../components/FeatureHighlight";
import TestimonialCard from "../components/TestimonialCard";
import StockMarketWidget from "../components/StockMarketWidget";

import { useAuth } from "../hooks/useAuth";

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

// Memoized Service Card Component for better performance
const ServiceCard = memo(({ service, index }) => {
  const Icon = service.icon;
  
  return (
    <Link
      to={service.link}
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all text-center group relative overflow-hidden border border-gray-100 hover:border-purple-200"
    >
      {/* Hover Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg relative z-10`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors relative z-10">
        {service.title}
      </h3>
      <p className="text-xs text-gray-600 relative z-10">{service.desc}</p>
    </Link>
  );
});

ServiceCard.displayName = 'ServiceCard';

function Home() {
  const { user } = useAuth();

  // Memoize data to prevent unnecessary re-renders (Next.js-like optimization)
  const services = useMemo(() => [
    { icon: Send, title: "Send Money", desc: "Transfer to anyone instantly", link: "/send", color: "bg-blue-500" },
    { icon: Receipt, title: "Pay Bills", desc: "Electricity, Water & More", link: "/bills", color: "bg-green-500" },
    { icon: Smartphone, title: "Recharge", desc: "Mobile, DTH & Data Card", link: "/recharge", color: "bg-yellow-500" },
    { icon: CreditCard, title: "Credit Card", desc: "Pay credit card bills", link: "/credit", color: "bg-purple-500" },
    { icon: BarChart3, title: "Stock Market", desc: "Trade stocks & track trends", link: "/stocks", color: "bg-indigo-500" },
    { icon: TrendingUp, title: "Investments", desc: "Mutual Funds & Gold", link: "/invest", color: "bg-orange-500" },
    { icon: Zap, title: "Insurance", desc: "Health, Life & Travel", link: "/insurance", color: "bg-pink-500" },
  ], []);

  const features = useMemo(() => [
    { 
      icon: Shield, 
      title: "100% Secure", 
      desc: "Bank-grade encryption and security protocols ensure your money stays safe. PCI DSS compliant and ISO 27001 certified." 
    },
    { 
      icon: Zap, 
      title: "Instant Payments", 
      desc: "Transfer money to anyone, anywhere in seconds. No waiting, no delays - just instant transactions." 
    },
    { 
      icon: Users, 
      title: "61+ Crore Users", 
      desc: "Join millions of Indians who trust PhonePe for their daily payments and financial needs." 
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
      content: "PhonePe has revolutionized how I accept payments. It's fast, secure, and my customers love it!",
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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-24 px-6 relative overflow-hidden">
        <Suspense fallback={null}>
          <HeroDecorations />
        </Suspense>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-6 inline-block">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
              ✨ Trusted by 61+ Crore Indians
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {user ? (
              <>
                Welcome back,<br />
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                  {user.name || "User"}!
                </span>
              </>
            ) : (
              <>
                India's Most<br />
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                  Trusted Payments App
                </span>
              </>
            )}
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
            {user 
              ? "Manage your money, pay bills, and send money to anyone, anywhere with just a few taps."
              : "Pay, send money, recharge, pay bills, book flights & movie tickets, and do a lot more. Simple, fast, and secure."}
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/signup"
                className="px-10 py-4 bg-white text-purple-700 rounded-full font-bold hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 text-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-10 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all backdrop-blur-sm text-lg"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>


      {/* Stock Market Section */}
      <StockMarketWidget />

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {user ? "Quick Actions" : "All Payment Solutions"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                  Why Choose PhonePe?
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
                    delay={index * 100}
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
          <section className="bg-white py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Loved by Millions
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  See what our users have to say about their PhonePe experience
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
                    delay={index * 150}
                  />
                ))}
              </div>
            </div>
          </section>
        </LazySection>
      )}

      {/* Footer - Lazy Loaded */}
      <Suspense fallback={<div className="min-h-[400px] bg-gray-50"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default memo(Home);
