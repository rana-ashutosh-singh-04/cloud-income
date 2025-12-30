const AnimatedStats = ({ value, label, suffix = "", delay = 0 }) => {
  return (
    <div 
      className="text-center group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-purple-400/20 blur-2xl rounded-full group-hover:bg-purple-400/30 transition-all duration-300"></div>
        <p className="relative text-6xl md:text-7xl font-bold mb-3 text-white group-hover:scale-110 transition-transform duration-300">
          {value}
          {suffix && <span className="text-yellow-300 text-4xl">{suffix}</span>}
        </p>
      </div>
      <p className="text-xl md:text-2xl opacity-90 font-medium">{label}</p>
    </div>
  );
};

export default AnimatedStats;

