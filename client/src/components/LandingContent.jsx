import React from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from './FadeIn';

export default function LandingContent() {
  return (
    <div className="bg-[#faf5ee] min-h-screen text-[#2a1f17] font-sans pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Header & 4-Column Features */}
        <FadeIn direction="up">
        <section className="mb-24">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-16 text-[#2a1f17]">
            We've cracked the code.
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#c2652a]/10 flex items-center justify-center mb-4 text-[#c2652a]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Swift setups</h3>
              <p className="text-sm text-[#4a3d33] leading-relaxed">
                Streamline your onboarding with automated processes that get you up and running without technical delays.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-[#c2652a]/10 flex items-center justify-center mb-4 text-[#c2652a]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Custom-fit features</h3>
              <p className="text-sm text-[#4a3d33] leading-relaxed">
                Our platform adapts to your specific needs, delivering tools that fit seamlessly into your existing workflows.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-[#c2652a]/10 flex items-center justify-center mb-4 text-[#c2652a]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Future-proof details</h3>
              <p className="text-sm text-[#4a3d33] leading-relaxed">
                Built with scalability in mind. Grow your business without worrying about infrastructure bottlenecks.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-[#c2652a]/10 flex items-center justify-center mb-4 text-[#c2652a]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Seamless sync</h3>
              <p className="text-sm text-[#4a3d33] leading-relaxed">
                Connect your favorite applications instantly. Our robust API ensures your data flows smoothly across platforms.
              </p>
            </div>
          </div>
        </section>
        </FadeIn>

        {/* Hero Landscape Image */}
        <FadeIn delay={0.2} direction="up">
        <section className="mb-32">
          <div className="w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden relative shadow-lg">
            {/* Placeholder for the landscape image */}
            <div className="absolute inset-0 bg-[#e0d6cb]"></div>
            <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
              alt="Mountain landscape" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>
        </FadeIn>

        {/* See the Big Picture */}
        <section className="mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="left">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-[#2a1f17]">See the Big Picture</h2>
            <p className="text-[#4a3d33] mb-8 leading-relaxed">
              Unlock powerful insights with our comprehensive analytics dashboard. Track growth, identify trends, and make data-driven decisions that propel your business forward.
            </p>
            
            <ul className="space-y-4 mb-10 text-sm text-[#4a3d33]">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#c2652a]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#c2652a] text-xs font-bold">✓</span>
                </div>
                <span>Real-time data visualization and custom reporting tailored to your KPIs.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#c2652a]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#c2652a] text-xs font-bold">✓</span>
                </div>
                <span>Predictive algorithms that highlight emerging market opportunities.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#c2652a]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#c2652a] text-xs font-bold">✓</span>
                </div>
                <span>Comprehensive integration with your existing CRM and sales platforms.</span>
              </li>
            </ul>

            <button className="bg-[#c2652a] text-white hover:bg-[#a55220] px-8 py-3 rounded-full text-sm font-semibold transition shadow-sm">
              Explore Now
            </button>
          </div>
          </FadeIn>
          
          <FadeIn direction="right" delay={0.2}>
          <div className="rounded-3xl overflow-hidden bg-[#e8e2d7] aspect-[4/5] relative shadow-md">
            {/* Placeholder for 3D graphic */}
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop" 
              alt="Abstract 3D shapes" 
              className="w-full h-full object-cover opacity-90"
            />
          </div>
          </FadeIn>
        </section>

        {/* Why Choose Cloud Income? (Table Section) */}
        <FadeIn direction="up">
        <section className="mb-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-[#2a1f17]">Why Choose Cloud Income?</h2>
            <p className="text-[#4a3d33] mb-8 leading-relaxed">
              A tailored approach to business management, bridging the gap between platform and service. See how we stack up against the competition.
            </p>
            <button className="bg-[#c2652a] text-white hover:bg-[#a55220] px-8 py-3 rounded-full text-sm font-semibold transition shadow-sm">
              Get Started
            </button>
          </div>

          <div className="w-full overflow-x-auto border border-[rgba(216,208,200,0.7)] rounded-3xl bg-white/40 backdrop-blur-sm p-2 md:p-8">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-[rgba(216,208,200,0.5)]">
                  <th className="py-6 px-4 font-serif font-bold text-lg text-[#2a1f17] w-1/3">Features</th>
                  <th className="py-6 px-4 font-serif font-bold text-lg text-[#c2652a] w-1/3 text-center">Cloud Income</th>
                  <th className="py-6 px-4 font-serif font-bold text-lg text-[#8c857b] w-1/3 text-center">Alternatives</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#4a3d33]">
                {[
                  "Automated Reporting",
                  "Dedicated Support Rep",
                  "Custom API Integration",
                  "Predictive Analytics",
                  "No Hidden Fees"
                ].map((feature, idx) => (
                  <tr key={idx} className="border-b border-[rgba(216,208,200,0.3)] last:border-0">
                    <td className="py-5 px-4 font-medium">{feature}</td>
                    <td className="py-5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#c2652a]/20 text-[#c2652a] font-bold text-xs">✓</span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="inline-flex items-center justify-center text-[#8c857b] font-bold text-xs">✕</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        </FadeIn>

        {/* Testimonial Section */}
        <section className="mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="left">
          <div className="rounded-3xl overflow-hidden bg-[#e8e2d7] aspect-square relative shadow-md order-2 lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1616161560417-66d4db5892ec?q=80&w=1964&auto=format&fit=crop" 
              alt="Balancing stones" 
              className="w-full h-full object-cover opacity-90"
            />
          </div>
          </FadeIn>
          
          <FadeIn direction="right" delay={0.2}>
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl md:text-3xl font-serif font-medium leading-snug mb-8 text-[#2a1f17]">
              "I was skeptical, but Cloud Income has completely transformed the way I manage my business. The data visualizations are so clear and intuitive, and the platform is so easy to use, I can't imagine running my company without it."
            </h3>
            <div>
              <p className="font-bold text-[#2a1f17]">Alex Brooks</p>
              <p className="text-sm text-[#8c857b]">CEO, TechFlow</p>
            </div>
          </div>
          </FadeIn>
        </section>

        {/* Map Your Success */}
        <FadeIn direction="up">
        <section className="mb-32">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2a1f17]">Map Your Success</h2>
            <button className="border border-[#c2652a] text-[#c2652a] hover:bg-[#c2652a]/5 px-8 py-3 rounded-full text-sm font-semibold transition">
              View Roadmap
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
              <h4 className="text-4xl font-serif font-light text-[#8c857b] mb-4">01</h4>
              <h5 className="font-bold mb-2">Identify</h5>
              <p className="text-sm text-[#4a3d33]">Pinpoint the exact bottlenecks holding your revenue back through our diagnostic dashboard.</p>
            </div>
            <div>
              <h4 className="text-4xl font-serif font-light text-[#8c857b] mb-4">02</h4>
              <h5 className="font-bold mb-2">Implement</h5>
              <p className="text-sm text-[#4a3d33]">Deploy customized solutions with single-click integrations and zero downtime.</p>
            </div>
            <div>
              <h4 className="text-4xl font-serif font-light text-[#8c857b] mb-4">03</h4>
              <h5 className="font-bold mb-2">Scale</h5>
              <p className="text-sm text-[#4a3d33]">Watch your margins expand as our automated tools handle the heavy lifting of operations.</p>
            </div>
          </div>

          <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden relative shadow-lg">
             <img 
              src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=2070&auto=format&fit=crop" 
              alt="Winding road" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>
        </FadeIn>

        {/* Call to Action Footer / Connect */}
        <FadeIn direction="up">
        <section className="text-center max-w-2xl mx-auto border-t border-[rgba(216,208,200,0.5)] pt-24">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-[#2a1f17]">Connect with us</h2>
          <p className="text-[#4a3d33] mb-10 leading-relaxed">
            Join the hundreds of businesses that have supercharged their workflow and reclaimed their time. Your success story starts here.
          </p>
          <button className="bg-[#2a1f17] text-white hover:bg-[#4a3d33] px-10 py-4 rounded-full text-sm font-semibold transition shadow-md">
            Contact Sales
          </button>
        </section>
        </FadeIn>

      </div>
    </div>
  );
}
