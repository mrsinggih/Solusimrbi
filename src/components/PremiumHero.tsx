import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Video, 
  ArrowRight, 
  Check, 
  MessageSquare, 
  Star, 
  Award, 
  ShieldCheck, 
  Brain, 
  Users, 
  Activity, 
  Compass, 
  Sparkle,
  PhoneCall
} from "lucide-react";

interface PremiumHeroProps {
  onStartCounseling: () => void;
  onScheduleConsultation: () => void;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ 
  onStartCounseling, 
  onScheduleConsultation 
}) => {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  // States for mouse coordinate tracking (for mouse parallax/glow effect)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) {
      // Calculate normalized coordinates (-0.5 to 0.5)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    }
  };

  // Generate slow drifting dust particles for the background
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * -20,
  }));

  // Dynamic changing keywords for marriage counseling sub-theme
  const [wordIndex, setWordIndex] = useState(0);
  const coreValues = ["Kedamaian", "Saling Mengerti", "Keharmonisan", "Pemulihan Luka"];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % coreValues.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 18,
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const floatTransition = (duration: number, delay: number = 0) => {
    if (shouldReduceMotion) return {};
    return {
      y: [-8, 8, -8],
      rotate: [-1, 1, -1],
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      },
    };
  };

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePos({ x: 0, y: 0 });
      }}
      id="premium-hero"
      className="relative min-h-[100vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden py-16 lg:py-24 px-4 sm:px-6 md:px-8 bg-[#fbf9f4] select-none cursor-default"
    >
      
      {/* ================= BACKGROUND EFFECTS ================= */}
      
      {/* 1. Animated Mesh Gradient (Slow overlapping blobs) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Blob 1: Sage Green */}
        <motion.div
          animate={shouldReduceMotion ? {} : {
            x: [0, 40, -30, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] min-w-[350px] rounded-full bg-emerald-100/35 mix-blend-multiply filter blur-[80px]"
        />

        {/* Blob 2: Terracotta / Peach */}
        <motion.div
          animate={shouldReduceMotion ? {} : {
            x: [0, -60, 40, 0],
            y: [0, 60, -30, 0],
            scale: [1, 0.85, 1.1, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] min-w-[380px] rounded-full bg-orange-100/30 mix-blend-multiply filter blur-[90px]"
        />

        {/* Blob 3: Lavender / Soft Blue */}
        <motion.div
          animate={shouldReduceMotion ? {} : {
            x: [0, 30, -50, 0],
            y: [0, 50, -40, 0],
            scale: [1, 1.1, 0.85, 1],
          }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[-5%] w-[45vw] h-[45vw] min-w-[300px] rounded-full bg-indigo-50/40 mix-blend-multiply filter blur-[80px]"
        />

        {/* Blob 4: Soft Yellow / Peach */}
        <motion.div
          animate={shouldReduceMotion ? {} : {
            x: [0, -40, 30, 0],
            y: [0, -30, 50, 0],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-[5%] w-[40vw] h-[40vw] min-w-[280px] rounded-full bg-yellow-50/50 mix-blend-multiply filter blur-[70px]"
        />
        
        {/* Blob 5: Soft Coral */}
        <motion.div
          animate={shouldReduceMotion ? {} : {
            scale: [1, 1.25, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[30%] w-[35vw] h-[35vw] min-w-[250px] rounded-full bg-rose-50/20 mix-blend-screen filter blur-[100px]"
        />
      </div>

      {/* 2. Slow Drifting Bokeh Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {!shouldReduceMotion && particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.1, x: `${p.x}%`, y: `${p.y}%` }}
            animate={{
              y: ["0%", "-100%", "0%"],
              x: ["0%", "20%", "-20%", "0%"],
              opacity: [0.1, 0.45, 0.1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: p.size,
              height: p.size,
            }}
            className="absolute rounded-full bg-orange-200/40 blur-[1px] shadow-[0_0_10px_rgba(251,191,36,0.3)]"
          />
        ))}
      </div>

      {/* 3. Mouse Parallax Light Glow Base */}
      {isHovering && !shouldReduceMotion && (
        <motion.div
          style={{
            x: mousePos.x * 200,
            y: mousePos.y * 200,
          }}
          transition={{ type: "spring", stiffness: 40, damping: 25 }}
          className="absolute inset-0 m-auto w-[400px] h-[400px] rounded-full bg-gradient-to-r from-emerald-100/15 to-orange-100/15 filter blur-[120px] pointer-events-none z-0"
        />
      )}

      {/* 4. Elegant SVG Top/Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 select-none pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] text-white fill-current">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
        </svg>
      </div>

      {/* ================= MAIN CONTENT LAYOUT ================= */}
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-20">
        
        {/* ================= LEFT SIDE: HEADLINE & TRUST BADGES ================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col justify-center text-left space-y-6 sm:space-y-8"
        >
          {/* A. HIMPSI / TRUST BADGE CAROUSEL */}
          <motion.div variants={badgeVariants} className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-sans font-semibold tracking-wide shadow-soft-xs hover:bg-emerald-100/50 transition-colors">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>HIMPSI Certified Clinician</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-800 text-[11px] font-sans font-semibold tracking-wide shadow-soft-xs hover:bg-orange-100/50 transition-colors">
              <Sparkle className="w-3.5 h-3.5 text-orange-600 animate-spin" style={{ animationDuration: "6s" }} />
              <span>Sains Hubungan Modern</span>
            </span>
          </motion.div>

          {/* B. LARGE HEADLINE WITH INNER WORDS CAROUSEL REVEAL */}
          <div className="space-y-3.5">
            <motion.h1 
              variants={itemVariants}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-[#23352c] leading-[1.1] tracking-tight"
            >
              Menemukan Kembali <br className="hidden sm:inline" />
              <div className="relative inline-flex items-center overflow-hidden h-[1.25em] align-middle mt-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-orange-600 to-[#b55d47] font-bold py-0.5"
                  >
                    {coreValues[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>{" "}
              <br />
              Dalam Rumah Tangga.
            </motion.h1>

            {/* C. SUBHEADLINE / SUPPORTING PITCH */}
            <motion.p 
              variants={itemVariants}
              className="font-sans text-[#4a5850] text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl"
            >
              "Memahami makna terdalam dari pernikahan dan dinamika cinta melalui lensa psikologi." Kami membimbing pasangan pranikah maupun pasutri merajut kembali rasa aman, meretas konflik berulang, dan memulihkan keintiman emosional secara solutif.
            </motion.p>
          </div>

          {/* D. ACTION BUTTONS (Mulai Konseling & Jadwalkan Konsultasi) */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3.5 pt-2"
          >
            {/* Primary CTA: Mulai Konseling */}
            <button
              onClick={onStartCounseling}
              className="group relative px-7 py-4 rounded-2xl bg-[#628772] hover:bg-[#527260] text-white font-sans text-xs sm:text-sm font-bold tracking-wide shadow-soft-lg hover:shadow-soft-xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span>Mulai Konseling Privat</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary CTA: Jadwalkan Konsultasi */}
            <button
              onClick={onScheduleConsultation}
              className="group px-7 py-4 rounded-2xl bg-white/70 hover:bg-white border border-[#628772]/20 hover:border-[#628772]/50 text-[#30453c] font-sans text-xs sm:text-sm font-bold tracking-wide backdrop-blur-md shadow-soft-sm hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Jadwalkan Konsultasi</span>
            </button>
          </motion.div>

          {/* E. BULLET TRUST BADGES SECTION */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#628772]/10"
          >
            <div className="flex items-center gap-2 text-[#35473f] font-sans text-xs font-semibold">
              <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-soft-xs">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>100% Rahasia</span>
            </div>
            <div className="flex items-center gap-2 text-[#35473f] font-sans text-xs font-semibold">
              <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-soft-xs">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Pendekatan Psikologi</span>
            </div>
            <div className="flex items-center gap-2 text-[#35473f] font-sans text-xs font-semibold">
              <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-soft-xs">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Konseling Online & Offline</span>
            </div>
          </motion.div>

          {/* F. TESTIMONIAL MINI CARD */}
          <motion.div 
            variants={itemVariants}
            className="relative p-5 rounded-2xl border border-white/80 bg-white/55 backdrop-blur-md shadow-soft-md max-w-xl flex gap-4 items-start hover:bg-white transition-colors duration-300"
          >
            <div className="flex flex-col gap-0.5 shrink-0">
              <div className="flex text-[#b55d47] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#b55d47]" />
                ))}
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-400 mt-1 uppercase tracking-wider">Trusted Method</span>
            </div>
            <div className="text-left text-xs text-[#425047] leading-relaxed">
              <p className="font-serif italic text-neutral-warm-700">
                "Dipercaya membantu pasangan membangun komunikasi yang lebih sehat."
              </p>
              <div className="mt-1 flex items-center gap-1">
                <span className="font-sans font-semibold text-[11px] text-[#2c3d35]">— Gottman & EFT Certified Counsel</span>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* ================= RIGHT SIDE: ILLUSTRATIVE COLLAGE & STATS ================= */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] lg:min-h-[500px]">
          
          {/* Backdrop Glow behind visual */}
          <div className="absolute inset-0 m-auto w-72 h-72 rounded-full bg-gradient-to-tr from-emerald-200/20 to-orange-200/20 filter blur-3xl" />

          {/* Parallax Container */}
          <motion.div 
            style={shouldReduceMotion ? {} : {
              x: mousePos.x * 35,
              y: mousePos.y * 35,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative w-full max-w-[360px] sm:max-w-[430px]"
          >
            
            {/* Glassmorphic Base Board Card */}
            <div className="relative rounded-[32px] p-6 backdrop-blur-xl bg-white/45 border border-white/50 shadow-soft-2xl flex flex-col items-center justify-center overflow-hidden">
              
              {/* Dynamic Interactive Relational Communication SVG Graph */}
              <div className="w-full aspect-square max-w-[280px] sm:max-w-[320px] flex items-center justify-center relative">
                
                {/* Glowing Core Pulsing Node */}
                <div className="absolute inset-0 m-auto w-36 h-36 rounded-full bg-gradient-to-r from-emerald-100/20 to-[#b55d47]/20 filter blur-xl animate-pulse" />
                
                <svg viewBox="0 0 400 400" className="w-full h-full filter drop-shadow-md">
                  
                  {/* Subtle Grid System */}
                  <g opacity="0.12" className="text-emerald-950">
                    <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="200" cy="200" r="110" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="200" cy="200" r="55" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="30" y1="200" x2="370" y2="200" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="200" y1="30" x2="200" y2="370" stroke="currentColor" strokeWidth="0.5" />
                  </g>

                  {/* Relationship Pulse Wave 1 */}
                  <motion.path
                    d="M 40,200 Q 120,80 200,200 T 360,200"
                    fill="none"
                    stroke="url(#relationalWave)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    animate={shouldReduceMotion ? {} : {
                      d: [
                        "M 40,200 Q 120,80 200,200 T 360,200",
                        "M 40,200 Q 120,320 200,200 T 360,200",
                        "M 40,200 Q 120,80 200,200 T 360,200"
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 7,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Relationship Pulse Wave 2 (Empathy alignment) */}
                  <motion.path
                    d="M 40,200 Q 120,260 200,200 T 360,200"
                    fill="none"
                    stroke="url(#empathyWave)"
                    strokeWidth="2"
                    opacity="0.65"
                    strokeDasharray="4 4"
                    animate={shouldReduceMotion ? {} : {
                      d: [
                        "M 40,200 Q 120,260 200,200 T 360,200",
                        "M 40,200 Q 120,140 200,200 T 360,200",
                        "M 40,200 Q 120,260 200,200 T 360,200"
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Heart Core connecting Venn-relationship */}
                  <g transform="translate(162, 162)">
                    <defs>
                      <radialGradient id="heartPulseGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#b55d47" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#b55d47" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Glowing pulse ring */}
                    <motion.circle
                      cx="38"
                      cy="38"
                      r="48"
                      fill="url(#heartPulseGlow)"
                      animate={shouldReduceMotion ? {} : {
                        scale: [0.8, 1.4, 0.8],
                        opacity: [0.7, 0, 0.7],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.8,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Central SVG Love Heart */}
                    <motion.path
                      d="M38,18 C38,18 18,2 2,18 C-14,34 18,65 38,75 C58,65 90,34 74,18 C58,2 38,18 38,18 Z"
                      fill="url(#heartFill)"
                      stroke="url(#heartStroke)"
                      strokeWidth="2.5"
                      className="filter drop-shadow-[0_4px_12px_rgba(181,93,71,0.3)] cursor-pointer"
                      whileHover={{ scale: 1.15 }}
                      animate={shouldReduceMotion ? {} : {
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: "easeInOut"
                      }}
                    />
                  </g>

                  {/* Floating Orbit Node 1: Heart Connections */}
                  <motion.g
                    animate={shouldReduceMotion ? {} : { rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                    style={{ transformOrigin: "200px 200px" }}
                  >
                    <circle cx="330" cy="200" r="14" fill="url(#orbitGlow1)" className="filter drop-shadow-[0_2px_8px_rgba(98,135,114,0.3)]" />
                    {/* SVG mini heart icon inside */}
                    <path d="M330,196 C330,196 325,191.5 320.5,196 C316.5,200 325,207.75 330,210.25 C335,207.75 343.5,200 339.5,196 C335,191.5 330,196 330,196 Z" fill="#ffffff" />
                  </motion.g>

                  {/* Floating Orbit Node 2: Brain Intelligence */}
                  <motion.g
                    animate={shouldReduceMotion ? {} : { rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    style={{ transformOrigin: "200px 200px" }}
                  >
                    <circle cx="70" cy="200" r="14" fill="url(#orbitGlow2)" className="filter drop-shadow-[0_2px_8px_rgba(181,93,71,0.3)]" />
                    {/* SVG mini brain/wave icon inside */}
                    <path d="M66,195 Q70,191 74,195 Q78,199 74,203 Q70,207 66,203 Z" fill="#ffffff" />
                  </motion.g>

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="relationalWave" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#628772" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#b55d47" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#e2bc8a" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="empathyWave" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#e2bc8a" />
                      <stop offset="100%" stopColor="#628772" />
                    </linearGradient>
                    <radialGradient id="orbitGlow1" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#bceae3" />
                      <stop offset="100%" stopColor="#628772" />
                    </radialGradient>
                    <radialGradient id="orbitGlow2" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#fcd3ca" />
                      <stop offset="100%" stopColor="#b55d47" />
                    </radialGradient>
                    <linearGradient id="heartFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#dc7f69" />
                      <stop offset="100%" stopColor="#b55d47" />
                    </linearGradient>
                    <linearGradient id="heartStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#b55d47" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>

                </svg>

              </div>

              {/* Connected Active Couple Indicator */}
              <div className="w-full mt-2 p-3.5 rounded-2xl bg-[#203229]/95 text-white border border-white/10 flex items-center justify-between text-left shadow-soft-sm">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=100" 
                      alt="Couple"
                      className="w-9 h-9 rounded-xl object-cover border border-white/10"
                    />
                    <span className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#203229] animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono uppercase text-[#8fae9b] tracking-wider block font-bold">Materi Terpilih</span>
                    <span className="text-[11px] font-serif font-semibold text-white block truncate max-w-[150px]">Dinamika Cinta & Psikologi</span>
                  </div>
                </div>
                <div className="bg-white/10 px-2.5 py-1 rounded-lg text-[9px] font-mono text-emerald-300 font-bold tracking-wider shrink-0 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>EFCT-Vibe</span>
                </div>
              </div>

            </div>

            {/* ================= FLOATING GLASSMORPHISM CARDS ================= */}
            
            {/* 1. Floating Stat Card: 500+ Pasangan */}
            <motion.div
              style={shouldReduceMotion ? {} : {
                x: mousePos.x * -50,
                y: mousePos.y * -50,
              }}
              animate={floatTransition(4.5, 0.2)}
              className="absolute top-[-10px] left-[-30px] px-5 py-3 rounded-2xl bg-white/95 border border-white/80 shadow-soft-xl backdrop-blur-md flex items-center gap-3.5 hover:scale-105 transition-all duration-300 select-none cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-[#628772] border border-emerald-100 shadow-soft-xs">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[14px] font-serif font-black text-[#22332a] block">500+</span>
                <span className="text-[10px] font-sans font-semibold text-[#54645c] block mt-0.5">Pasangan Telah Dibantu</span>
              </div>
            </motion.div>

            {/* 2. Floating Stat Card: 98% Tingkat Kepuasan */}
            <motion.div
              style={shouldReduceMotion ? {} : {
                x: mousePos.x * 60,
                y: mousePos.y * -60,
              }}
              animate={floatTransition(5, 0.8)}
              className="absolute bottom-[-15px] left-[-20px] px-5 py-3 rounded-2xl bg-white/95 border border-white/80 shadow-soft-xl backdrop-blur-md flex items-center gap-3.5 hover:scale-105 transition-all duration-300 select-none cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#b55d47] border border-orange-100 shadow-soft-xs">
                <Heart className="w-4 h-4 fill-[#b55d47]/10" />
              </div>
              <div className="text-left">
                <span className="text-[14px] font-serif font-black text-[#22332a] block">98%</span>
                <span className="text-[10px] font-sans font-semibold text-[#54645c] block mt-0.5">Tingkat Kepuasan</span>
              </div>
            </motion.div>

            {/* 3. Floating Stat Card: 15+ Tahun Pengalaman */}
            <motion.div
              style={shouldReduceMotion ? {} : {
                x: mousePos.x * -40,
                y: mousePos.y * 50,
              }}
              animate={floatTransition(4.8, 1.4)}
              className="absolute top-[35%] right-[-25px] px-5 py-3 rounded-2xl bg-white/95 border border-white/80 shadow-soft-xl backdrop-blur-md flex items-center gap-3.5 hover:scale-105 transition-all duration-300 select-none cursor-pointer animate-fade-in"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-soft-xs">
                <Compass className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[14px] font-serif font-black text-[#22332a] block">15+</span>
                <span className="text-[10px] font-sans font-semibold text-[#54645c] block mt-0.5">Tahun Pengalaman</span>
              </div>
            </motion.div>

            {/* 4. Mini Floating Psychology Icons */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[25%] left-[-45px] w-8 h-8 rounded-full bg-white border border-white/80 flex items-center justify-center shadow-soft-md text-emerald-600"
            >
              <Brain className="w-4 h-4" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[10%] right-[-10px] w-8 h-8 rounded-full bg-white border border-white/80 flex items-center justify-center shadow-soft-md text-orange-500"
            >
              <MessageSquare className="w-4 h-4" />
            </motion.div>

          </motion.div>

        </div>

      </div>

    </section>
  );
};
