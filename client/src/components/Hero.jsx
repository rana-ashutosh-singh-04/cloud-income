import { Canvas } from "@react-three/fiber";
import { useGLTF, Float, Environment, ContactShadows } from "@react-three/drei";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Suspense, useState, useEffect, useMemo } from "react";
import ErrorBoundary from "./ErrorBoundary";

const NAVBAR_HEIGHT = 64; // px

// Preload models for better performance
useGLTF.preload("/models/bitcoin_3d_model.glb");
useGLTF.preload("/models/credit_card.glb");

const BitcoinModel = ({ screenSize }) => {
  const { scene } = useGLTF("/models/bitcoin_3d_model.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const scale = screenSize === "mobile" ? 0.35 : screenSize === "tablet" ? 0.55 : 0.75;
  return <primitive object={clonedScene} scale={scale} dispose={null} />;
};

const CreditCardModel = ({ screenSize }) => {
  const { scene } = useGLTF("/models/credit_card.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const scale = screenSize === "mobile" ? 0.55 : screenSize === "tablet" ? 0.8 : 1.1;
  return <primitive object={clonedScene} scale={scale} rotation={[0.5, -0.5, 0]} dispose={null} />;
};

const Hero3DFallback = ({ screenSize }) => {
  const isMobile = screenSize === "mobile";
  const isTablet = screenSize === "tablet";
  
  const bitcoinScale = isMobile ? "90px" : isTablet ? "180px" : "280px";
  const bitcoinLeft = isMobile ? "2%" : isTablet ? "5%" : "10%";
  const bitcoinTop = isMobile ? "12%" : isTablet ? "12%" : "20%";

  const cardScale = isMobile ? "110px" : isTablet ? "220px" : "320px";
  const cardRight = isMobile ? "2%" : isTablet ? "4%" : "8%";
  const cardBottom = isMobile ? "10%" : isTablet ? "15%" : "20%";

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Golden Bitcoin Fallback Image */}
      <div 
        className="absolute transition-all duration-1000"
        style={{
          left: bitcoinLeft,
          top: bitcoinTop,
          width: bitcoinScale,
          height: "auto",
          animation: "floatSlow 6s ease-in-out infinite",
          filter: "drop-shadow(0 20px 40px rgba(194, 101, 42, 0.2))",
        }}
      >
        <img 
          src="/models/bitcoin_fallback.png" 
          alt="Bitcoin model fallback" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Credit Card Fallback Image */}
      <div 
        className="absolute transition-all duration-1000"
        style={{
          right: cardRight,
          bottom: cardBottom,
          width: cardScale,
          height: "auto",
          animation: "floatSlower 8s ease-in-out infinite",
          filter: "drop-shadow(0 30px 60px rgba(58, 48, 42, 0.15))",
          transform: "rotate(-10deg)",
        }}
      >
        <img 
          src="/models/credit_card_fallback.png" 
          alt="Credit card model fallback" 
          className="w-full h-auto object-contain"
        />
      </div>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes floatSlower {
          0%, 100% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(20px) rotate(-7deg); }
        }
      `}</style>
    </div>
  );
};

const Hero = () => {
  const [screenSize, setScreenSize] = useState("desktop"); // 'mobile', 'tablet', 'desktop'

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setScreenSize("mobile");
      } else if (w < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bitcoinPos = screenSize === "mobile" 
    ? [-2.4, 4.0, -3.5] 
    : screenSize === "tablet" 
      ? [-2.8, 3.5, -3] 
      : [-4.5, 2.5, -3];

  const cardPos = screenSize === "mobile" 
    ? [1.0, -2.8, -3.5] 
    : screenSize === "tablet" 
      ? [2.8, -1.2, -3] 
      : [4.5, -0.5, -3];

  const cameraPos = screenSize === "mobile" 
    ? [0, 0, 14] 
    : screenSize === "tablet" 
      ? [0, 0, 10] 
      : [0, 0, 8];

  return (
    <section
      className="relative w-full bg-[#faf5ee] overflow-hidden flex flex-col items-center pt-24 md:pt-32 pb-20"
      style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      {/* 3D CANVAS BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ErrorBoundary fallback={<Hero3DFallback screenSize={screenSize} />}>
          <Canvas
            camera={{ position: cameraPos, fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ powerPreference: "high-performance", antialias: true }}
          >
            <Suspense fallback={null}>
              <Environment preset="city" />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />

              <Float
                speed={1.5}
                rotationIntensity={1.2}
                floatIntensity={1.5}
                position={bitcoinPos}
              >
                <BitcoinModel screenSize={screenSize} />
              </Float>

              <Float
                speed={1.2}
                rotationIntensity={1.5}
                floatIntensity={1.2}
                position={cardPos}
              >
                <CreditCardModel screenSize={screenSize} />
              </Float>

              {screenSize === "desktop" && <ContactShadows position={[0, -5, 0]} opacity={0.3} scale={20} blur={2} far={6} resolution={256} frames={1} />}
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-center">

        {/* HEADING */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-[100px] font-serif font-medium text-[#2a1f17] leading-[1.05] tracking-tight pointer-events-auto"
        >
          India's Most Trusted <br className="hidden md:block" /> Payments & Freelance App.
        </motion.h1>

        {/* MOCKUP SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto mt-16 md:mt-24 mb-20 md:mb-32 pointer-events-auto"
        >
          {/* Background Pill Shape */}
          <div className="absolute top-[10%] -left-[2%] -right-[2%] bottom-[10%] md:top-[20%] md:-left-[8%] md:-right-[8%] md:bottom-[15%] bg-[#9fb093] rounded-[2rem] z-0"></div>

          {/* Dashboard Image Mockup */}
          <div className="relative z-10 w-full rounded-2xl md:rounded-[2.5rem] border-[6px] md:border-[16px] border-[#1c1c1c] bg-[#1c1c1c] shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden aspect-[4/3] md:aspect-[16/10]">

            {/* The actual dashboard image content */}
            <div className="relative w-full h-full bg-[#8fa482] overflow-hidden">

              {/* UI overlay to mimic dashboard */}
              <div className="absolute inset-0 z-10 p-6 md:p-12 flex flex-col justify-between pointer-events-none">

                {/* Top Bar inside mockup */}
                <div className="flex justify-between items-center text-white/90">
                  <div className="flex gap-6 text-xs md:text-sm font-medium tracking-wide">
                    <span>Reports</span>
                    <span className="opacity-50">Overview</span>
                  </div>
                </div>

                {/* Main Metric */}
                <div className="mt-8 flex justify-between items-end">
                  <div className="flex items-baseline gap-4">
                    <h3 className="text-white text-5xl md:text-7xl lg:text-[90px] font-serif font-light leading-none">78<span className="text-3xl md:text-5xl">%</span></h3>
                    <p className="text-white/90 text-sm md:text-xl font-serif">Efficiency Improvements</p>
                  </div>
                  <div className="hidden md:flex bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2">
                    <span className="text-white text-xs md:text-sm">All Regions (32)</span>
                  </div>
                </div>

                {/* Graph Container */}
                <div className="relative w-full h-[40%] md:h-[50%] mt-auto flex items-end justify-between px-2 md:px-6">
                  {/* Fake Graph Data Points */}
                  {[
                    { h: 30, x: 5 }, { h: 50, x: 15 }, { h: 35, x: 25 }, { h: 65, x: 35 },
                    { h: 55, x: 45 }, { h: 80, x: 55 }, { h: 40, x: 65 }, { h: 95, x: 75 },
                    { h: 70, x: 85 }, { h: 100, x: 95 }
                  ].map((point, i) => (
                    <div key={i} className="absolute bottom-0 w-px bg-white/40 flex flex-col items-center justify-end" style={{ left: `${point.x}%`, height: `${point.h}%` }}>
                      <div className="absolute top-0 w-2 md:w-3 h-2 md:h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] transform -translate-y-1/2"></div>
                    </div>
                  ))}

                  {/* X-Axis Labels */}
                  <div className="absolute bottom-6 md:bottom-10 left-0 w-full flex justify-between px-6 text-white/60 text-xs md:text-sm font-medium">
                    <span>2021</span>
                    <span>2022</span>
                    <span>2023</span>
                    <span>2024</span>
                  </div>
                </div>
              </div>

              {/* Background image matching the green mountain vibe from the mockup */}
              <img
                src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=2074"
                alt="Dashboard Landscape"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4f6140]/60 via-[#4f6140]/20 to-transparent mix-blend-multiply"></div>
            </div>
          </div>
        </motion.div>

        {/* TRUSTED BY SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-16 w-full max-w-5xl mx-auto pointer-events-auto"
        >
          <p className="text-[#8c7e72] text-xs md:text-sm font-semibold tracking-wider uppercase mb-8 text-left px-2">
            Trusted by
          </p>
          <div className="flex flex-wrap justify-between items-center gap-8 md:gap-12 opacity-60 grayscale px-2">
            {/* Fake Logos mimicing the ones in the image */}
            <div className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3h7v7h-3V6h-4V3zM10 21H3v-7h3v4h4v3zM14 21v-3h4v-4h3v7h-7zM10 3v3H6v4H3V3h7z" /></svg>
            </div>
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              <span className="font-serif font-bold text-lg">Logoipsum</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg">Logoipsum</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-lg tracking-widest uppercase">Logoipsum</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1 border-2 border-current rounded-full">
              <span className="font-sans font-bold text-sm">Logoipsum</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
