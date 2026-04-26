import { memo } from "react";

const FeatureHighlight = memo(({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <div 
      className="group relative bg-[#ffffff] rounded-[24px] p-8 shadow-[0_2px_16px_rgba(58,48,42,0.06)] hover:shadow-[0_8px_30px_rgba(58,48,42,0.12)] transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-[rgba(216,208,200,0.7)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background on Hover */}
      <div className="absolute inset-0 bg-[#c2652a]/0 group-hover:bg-[#c2652a]/5 transition-all duration-300"></div>
      
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-[#f3ece0] border border-[rgba(216,208,200,0.7)] rounded-[16px] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
          <Icon className="w-10 h-10 text-[#c2652a]" />
        </div>
        {/* Decorative Circle */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#c2652a] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
      </div>
      
      {/* Content */}
      <h3 className="text-2xl font-bold text-[#2a1f17] mb-3 group-hover:text-[#c2652a] transition-colors">
        {title}
      </h3>
      <p className="text-[#605850] leading-relaxed">
        {description}
      </p>
      
      {/* Bottom Border Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c2652a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
});

FeatureHighlight.displayName = 'FeatureHighlight';

export default FeatureHighlight;
