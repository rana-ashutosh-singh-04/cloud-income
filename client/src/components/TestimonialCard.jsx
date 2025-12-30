import { memo } from "react";
import { Star, Quote } from "lucide-react";

const TestimonialCard = memo(({ name, role, content, rating = 5, delay = 0 }) => {
  return (
    <div 
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Quote Icon Background */}
      <div className="absolute top-4 right-4 w-24 h-24 text-purple-100 opacity-50">
        <Quote className="w-full h-full" />
      </div>
      
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4 relative z-10">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      
      {/* Content */}
      <p className="text-gray-700 leading-relaxed mb-6 relative z-10 italic">
        "{content}"
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
      
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 opacity-0 hover:opacity-5 transition-opacity duration-300 -z-10"></div>
    </div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

export default TestimonialCard;

