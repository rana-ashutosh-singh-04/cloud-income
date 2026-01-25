import { useEffect, useState } from "react";
import HeroBackgroundSlider from "./HeroBackgroundSlider";
import ParticlesBackground from "./particlesBackground";
const imagesCount = 5;
const NAVBAR_HEIGHT = 64; // px

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % imagesCount);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-screen bg-[#0b0b14] overflow-hidden"
      style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      {/* BACKGROUND */}
      <HeroBackgroundSlider activeIndex={activeIndex} />
      <ParticlesBackground />
      {/* CONTENT */}
      <div
        className="relative z-20 flex items-center justify-center px-6"
        style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
      >
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold text-white">
            India’s Most Trusted <br />
            <span className="text-yellow-300">Payments App</span>
          </h1>

          <p className="mt-6 text-white/80">
            Pay, send money, recharge, invest & manage finances securely.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button className="px-8 py-3 rounded-full bg-white text-purple-700 font-semibold">
              Get Started Free
            </button>
            <button className="px-8 py-3 rounded-full border border-white/30 text-white">
              Login
            </button>
          </div>
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {[...Array(imagesCount)].map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`transition-all duration-300 rounded-full
              ${
                i === activeIndex
                  ? "w-10 h-3 bg-purple-600"
                  : "w-3 h-3 bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
