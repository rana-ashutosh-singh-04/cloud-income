import { memo } from "react";
import { Star, Quote } from "lucide-react";

const TestimonialCard = memo(({ name, role, content, rating = 5, delay = 0 }) => {
  return (
    <div 
      className="bg-[#ffffff] rounded-[24px] p-8 shadow-[0_2px_16px_rgba(58,48,42,0.06)] hover:shadow-[0_8px_30px_rgba(58,48,42,0.12)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border border-[rgba(216,208,200,0.7)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Quote Icon Background */}
      <div className="absolute top-4 right-4 w-24 h-24 text-[#c2652a]/10">
        <Quote className="w-full h-full" />
      </div>
      
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4 relative z-10">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-[#c2652a] text-[#c2652a]" />
        ))}
      </div>
      
      {/* Content */}
      <p className="text-[#605850] leading-relaxed mb-6 relative z-10 italic">
        "{content}"
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 bg-[#f3ece0] border border-[rgba(216,208,200,0.7)] rounded-full flex items-center justify-center text-[#c2652a] font-bold text-lg">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-[#2a1f17]">{name}</div>
          <div className="text-sm text-[#8c7e72]">{role}</div>
        </div>
      </div>
      
      {/* Hover Background Effect */}
      <div className="absolute inset-0 rounded-[24px] bg-[#c2652a] opacity-0 hover:opacity-[0.02] transition-opacity duration-300 -z-10"></div>
    </div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

export default TestimonialCard;
