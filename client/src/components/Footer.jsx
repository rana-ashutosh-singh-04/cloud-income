import { Shield, Linkedin, Twitter, Facebook, Youtube } from "lucide-react";
import footerAnimation from "../assets/footerAnimation.svg"
const Footer = () => {
  return (
    
    <footer className="w-full mt-6">

      <div className="w-full font-sans">
      
      {/* ------------------------------------------
          PART 1: SECURITY BANNER
          Placed inside a container to center it
      ------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-4 mb-[-40px] relative z-10">
        <div className="bg-white border border-[rgba(216,208,200,0.7)] rounded-2xl p-6 sm:p-10 text-[#4a3d33] flex flex-col md:flex-row items-center shadow-[0_2px_16px_rgba(58,48,42,0.06)] ">

          <Shield className="w-12 h-12 text-[#c2652a]"  />
                  <div className="text-center mt-2">
                    <div className="text-3xl font-bold text-[#2a1f17]">100%</div>
                    <div className="text-xs font-semibold text-[#8c7e72]">SECURE</div>
                  </div>
          {/* Text Content */}
             <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#2a1f17]">Your money stays safe.</h2>
            <p className="text-sm text-[#8c7e72] mt-1 mb-3">
             Cloud income protects your money with security systems that help minimize frauds.
            </p>
            <div className="flex gap-4 justify-center md:justify-start text-xs font-semibold text-[#605850]">
              <span className="flex items-center gap-1">✓ PCI DSS COMPLIANT</span>
              <span className="flex items-center gap-1">✓ ISO 27001 CERTIFIED</span>
            </div>
          </div>
          </div>
      </div>

      {/* ------------------------------------------
          PART 2: PULSE SECTION
      ------------------------------------------- */}
      <div className="bg-[#f3ece0] pt-24 pb-20 relative overflow-hidden text-[#4a3d33]">
        
        {/* Background Arcs (The decorative circles) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 pointer-events-none">
           {/* Outer Ring */}
           <div className="absolute bottom-[-400px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] border-[20px] border-[#c2652a] rounded-full"></div>
           {/* Middle Ring */}
           <div className="absolute bottom-[-300px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] border-[20px] border-[#c2652a] rounded-full"></div>
           {/* Inner Ring */}
           <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] border-[20px] border-[#c2652a] rounded-full"></div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
             {/* You can replace this with the actual Cloud income SVG Logo */}
             <div className="w-10 h-10 bg-[#c2652a] rounded-md text-white font-bold flex items-center justify-center text-xl">पे</div>
             <h1 className="text-3xl md:text-4xl font-bold text-[#2a1f17]">Cloud income Pulse</h1>
          </div>
          
          <p className="text-lg mb-12 max-w-2xl text-[#605850]">
            Get the latest data trends & insights on Cloud income Pulse!
          </p>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
            
            {/* Item 1 */}
            <div className="flex flex-col items-center">
              <span className="text-sm text-[#8c7e72] mb-1">Trusted by</span>
              <h3 className="text-4xl font-bold text-[#2a1f17]">61+ Crore<span className="text-[#c2652a]">*</span></h3>
              <span className="text-sm text-[#8c7e72]">Registered Users</span>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-center">
              <span className="text-sm text-[#8c7e72] mb-1">Accepted in</span>
              <h3 className="text-4xl font-bold text-[#2a1f17]">98%<span className="text-[#c2652a]">*</span></h3>
              <span className="text-sm text-[#8c7e72]">Postal Codes</span>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-center">
               <span className="text-sm text-[#8c7e72] mb-1">Accepted at over</span>
               <h3 className="text-4xl font-bold text-[#2a1f17]">4.4+ Crore<span className="text-[#c2652a]">*</span></h3>
               <span className="text-sm text-[#8c7e72]">Merchants (Stores, Apps & websites)</span>
            </div>

          </div>

          {/* Button */}
          <button className="border border-[#c2652a]/40 text-[#c2652a] hover:bg-[#c2652a]/5 font-bold py-3 px-8 rounded-[8px] transition">
            Explore Cloud income Pulse
          </button>

        </div>
      </div>

    </div>
      {/* Security Banner Section */}
      <div className="bg-[#faf5ee] border-t border-[rgba(216,208,200,0.7)] py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Security Badge */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#c2652a]/10 blur-2xl rounded-full"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(58,48,42,0.06)] border border-[rgba(216,208,200,0.7)]">
                  <Shield className="w-12 h-12 text-[#c2652a]" />
                  <div className="text-center mt-2">
                    <div className="text-3xl font-bold text-[#c2652a]">100%</div>
                    <div className="text-xs font-semibold text-[#c2652a]">SECURE</div>
                  </div>
                </div>
              </div>
              <div className="text-[#4a3d33]">
                <h3 className="text-2xl font-bold mb-2 text-[#2a1f17]">Your money stays safe.</h3>
                <p className="text-sm text-[#8c7e72]">
                  Cloud income protects your money with security systems that help minimize frauds.
                </p>
                <div className="flex gap-4 mt-3">
                  <span className="text-xs text-[#605850]">✓ PCI DSS</span>
                  <span className="text-xs text-[#605850]">✓ ISO 27001</span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="text-[#4a3d33] text-center md:text-right">
              <div className="flex items-center gap-2 mb-4 justify-center md:justify-end">
                <Shield className="w-6 h-6 text-[#c2652a]" />
                <h4 className="text-xl font-bold text-[#2a1f17]">Cloud income Pulse</h4>
              </div>

              <p className="text-sm mb-6 text-[#605850]">
                Get the latest data trends & insights on Cloud income Pulse!
              </p>

              <div className="flex flex-wrap gap-8 justify-center md:justify-end mb-6">

                <div>
                  <div className="text-sm text-[#8c7e72]">Trusted by</div>
                  <div className="text-2xl font-bold text-[#2a1f17]">61+ Crore*</div>
                  <div className="text-xs text-[#8c7e72]">Registered Users</div>
                </div>

                <div>
                  <div className="text-sm text-[#8c7e72]">Accepted in</div>
                  <div className="text-2xl font-bold text-[#2a1f17]">98%*</div>
                  <div className="text-xs text-[#8c7e72]">Postal Orders</div>
                </div>

                <div>
                  <div className="text-sm text-[#8c7e72]">Accepted at over</div>
                  <div className="text-2xl font-bold text-[#2a1f17]">4.4+ Crore*</div>
                  <div className="text-xs text-[#8c7e72]">
                    Merchants (Stores, Apps & websites)
                  </div>
                </div>

              </div>

              <button className="border border-[#c2652a]/40 text-[#c2652a] hover:bg-[#c2652a]/5 px-4 py-2 rounded-[8px] font-semibold transition">
                Explore Cloud income Pulse
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="bg-[#f3ece0] text-[#4a3d33] py-12 px-6 border-t border-[rgba(216,208,200,0.7)]">
        <div className="container mx-auto">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">

            {/* Logo */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-8 h-8 text-[#c2652a]" />
                <span className="text-xl font-bold text-[#2a1f17]">Cloud income</span>
              </div>
            </div>

            {/* Column Generators */}
            {[
              {
                title: "Business Solutions",
                items: [
                  "Payment Gateway", "E-commerce APIs", "POS Devices/ePOS",
                  "Expense Checkout", "Switch Merchant", "Smart Speaker",
                  "POS Machines", "Payment Links", "Vendor & Commerce",
                ],
              },
              {
                title: "Insurance",
                items: [
                  "Mobile Insurance", "Bike Insurance", "Car Insurance",
                  "Health Insurance", "Life Insurance", "Travel Insurance",
                ],
              },
              {
                title: "Investments",
                items: [
                  "24K Gold", "Liquid Funds", "Equity Funds", "Hybrid Funds",
                  "Mutual Funds",
                ],
              },
              {
                title: "General",
                items: [
                  "About Us", "Careers", "Trust & Safety", "Contact Us",
                  "Press", "Merchant Partners", "Blog",
                ],
              },
            ].map((col, index) => (
              <div key={index}>
                <h5 className="font-semibold mb-4 text-[#2a1f17]">{col.title}</h5>
                <ul className="space-y-2 text-sm text-[#605850]">
                  {col.items.map((item) => (
                    <li key={item} className="hover:text-[#c2652a] cursor-pointer transition-colors">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Legal Column */}
            <div>
              <h5 className="font-semibold mb-4 text-[#2a1f17]">Legal</h5>
              <ul className="space-y-2 text-sm text-[#605850]">
                {[
                  "Terms & Conditions",
                  "Privacy Policy",
                  "Grievance Policy",
                  "Fraud Awareness",
                  "Cookie Policy",
                ].map((item) => (
                  <li key={item} className="hover:text-[#c2652a] cursor-pointer transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 text-xl mt-10 text-[#605850]">
            {[Linkedin, Twitter, Facebook, Youtube].map((Icon, i) => (
              <Icon key={i} className="cursor-pointer hover:text-[#c2652a] transition-colors" />
            ))}
          </div>

          {/* Bottom Text */}
          <div className="text-center mt-8 text-sm text-[#8c7e72]">
            <p>*These are company numbers as of March, 2025</p>
            <p className="mt-2">© 2025. All rights reserved.</p>
          </div>

        </div>
      </div>
      <img
  src={footerAnimation}
  alt="footer"
  className="w-full h-auto"
/>
    </footer>
  );
};

export default Footer;
