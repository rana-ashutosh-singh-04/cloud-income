
const images = [
  "/hero/hero1.png",
  "/hero/hero2.png",
  "/hero/hero3.png",
  "/hero/hero4.png",
  "/hero/hero5.png",
];

export default function HeroBackgroundSlider({ activeIndex }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-[2000ms] ease-out
            ${i === activeIndex
              ? "opacity-100 scale-105"
              : "opacity-0 scale-100 blur-sm"
            }`}
        >
          <img
            src={img}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-[#faf5ee]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#c2652a]/20 via-transparent to-[#8c3c3c]/20" />
    </div>
  );
}
