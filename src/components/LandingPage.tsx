import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppState } from "../store";
import { COUNSELING_CATEGORIES } from "../constants";
import { formatRupiah } from "../utils/formatter";
import { BookingForm } from "../features/counseling/BookingForm";
import { PremiumHero } from "./PremiumHero";
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  Users, 
  Calendar, 
  Video, 
  ArrowRight, 
  Check, 
  Info,
  CheckCircle,
  Eye,
  RefreshCw,
  Wind,
  ShieldCheck,
  Award,
  Zap,
  Play,
  Download,
  Clock,
  ChevronDown,
  Lock,
  MessageSquare,
  Bookmark,
  TrendingUp,
  Shield,
  HelpCircle,
  Star,
  Quote
} from "lucide-react";

const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string; decimals?: number }> = ({ value, duration = 2000, suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMs = duration;
    const incrementTime = 30;
    const totalSteps = Math.ceil(totalMs / incrementTime);
    const increment = (end - start) / totalSteps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount((prev) => prev + increment);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
};

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  const { videos, buyVideo, ebooks, buyEbook, articles } = useAppState();
  
  // States for Hero Interactive Parallax & Text
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [wordIndex, setWordIndex] = useState(0);
  const dynamicWords = ["Komitmen", "Komunikasi", "Keintiman", "Keseimbangan"];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  // States for FAQ Accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // States for Testimonial slider
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // States for Teaser Video player modal
  const [teaserVideo, setTeaserVideo] = useState<{ title: string; url: string } | null>(null);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const services = [
    {
      id: "Pernikahan",
      name: "Konseling Pernikahan",
      badge: "Krisis & Rekonsiliasi",
      description: "Pendampingan khusus pasangan suami istri untuk menyelaraskan harapan, memulihkan trauma emosional, dan membangun kembali komitmen pernikahan yang retak.",
      features: [
        "Terapi Rekonsiliasi Pasutri",
        "Penyelesaian Konflik Berulang",
        "Mediasi Krisis Komitmen",
        "Gottman Method Assessment"
      ],
      price: 350000,
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=400",
      color: "border-sage-500 text-sage-600 bg-sage-50/40"
    },
    {
      id: "Pasangan",
      name: "Konseling Pasangan",
      badge: "Resolusi Konflik Asmara",
      description: "Sesi intensif untuk mendeteksi pola komunikasi disfungsional, meretas kecemburuan tak sehat, serta memperkuat keintiman relasi pacaran atau pertunangan.",
      features: [
        "Deteksi Pola Toksik",
        "Manajemen Konflik Pacaran",
        "Mirroring Komunikasi Aktif",
        "Membangun Trust Terarah"
      ],
      price: 250000,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      color: "border-terracotta-400 text-terracotta-600 bg-terracotta-50/40"
    },
    {
      id: "Pranikah",
      name: "Bimbingan Pranikah",
      badge: "Kesiapan Mental Holistik",
      description: "Edukasi kesiapan mental, penyelarasan visi finansial, gaya parenting, serta pembagian peran sebelum melangkah mantap menuju ikatan suci pernikahan.",
      features: [
        "Tes Kesiapan Mental Pengantin",
        "Penyelarasan Visi Finansial",
        "Diskusikan Cetak Biru Keluarga",
        "Pemetaan Harapan Hubungan"
      ],
      price: 300000,
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400",
      color: "border-ivory-500 text-ivory-800 bg-ivory-50"
    }
  ];

  const benefits = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-sage-600" />,
      title: "100% Rahasia & Aman",
      description: "Setiap sesi dilindungi sepenuhnya oleh kode etik psikologi HIMPSI yang sangat ketat. Privasi Anda dan pasangan terjamin aman tanpa kebocoran."
    },
    {
      icon: <Award className="w-6 h-6 text-terracotta-500" />,
      title: "Metode Ilmiah Teruji",
      description: "Mr Bi menggunakan kerangka kerja klinis kelas dunia seperti Gottman Method, Emotionally Focused Couple Therapy (EFT), dan Cognitive Behavioral Couples Therapy."
    },
    {
      icon: <Users className="w-6 h-6 text-ivory-600" />,
      title: "Pendekatan Tanpa Menghakimi",
      description: "Tidak mencari siapa yang benar atau salah. Kami fokus memahami luka emosional masing-masing dan menjembatani jarak komunikasi yang sempat retak."
    },
    {
      icon: <Zap className="w-6 h-6 text-sage-600" />,
      title: "Aset Edukasi Pendamping",
      description: "Setiap booking dilengkapi dengan akses materi tindak lanjut yang dapat diakses mandiri melalui platform video bimbingan dan ebook panduan."
    }
  ];

  const statistics = [
    { number: "1,500+", label: "Pasangan Dibimbing", desc: "Dari pranikah hingga pasutri usia perak" },
    { number: "94.8%", label: "Tingkat Resolusi", desc: "Pasangan berhasil memulihkan komitmen" },
    { number: "10+", label: "Tahun Pengalaman", desc: "Praktik psikologi klinis keluarga" },
    { number: "4.9/5", label: "Rating Kepuasan", desc: "Ulasan tulus dari ribuan klien kami" }
  ];

  const testimonials = [
    {
      name: "Aris & Dina",
      status: "Menikah 7 Tahun • Jakarta",
      quote: "Kami berada di ambang perceraian karena konflik mertua dan masalah komunikasi yang buntu. Sesi konseling privat bersama Mr Bi membuka mata kami tentang Gottman Method. Kami belajar mendengarkan tanpa menyerang. Rumah tangga kami pulih kembali.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "Rian & Sindy",
      status: "Pasangan Pranikah • Bandung",
      quote: "Bimbingan Pranikah bersama Mr Bi meluruskan banyak ekspektasi kami tentang kehidupan setelah resepsi. Kami membahas keuangan, batasan keluarga besar, hingga pembagian peran domestik secara ilmiah. Kami merasa jauh lebih siap mental melangkah ke pelaminan.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "Hendra & Clara",
      status: "Menikah 3 Tahun • Surabaya",
      quote: "Sesi ini sangat berharga bagi keintiman kami. Setelah kehadiran anak pertama, relasi fisik kami mendingin. Melalui konsultasi seksologi yang ilmiah dan bebas tabu, kami berhasil membangun keintiman emosional serta fisik yang lebih membara dan aman.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
    }
  ];

  const faqs = [
    {
      q: "Bagaimana cara kerja konseling di platform Solusi Mr Bi?",
      a: "Konseling dilakukan secara terjadwal. Anda cukup mengisi Formulir Booking di bawah, memilih tanggal dan slot waktu, menyelesaikan pembayaran via Midtrans, lalu Anda akan mendapatkan tautan ruang pertemuan privat virtual. Konseling tatap muka online ini dijamin 100% aman dan rahasia."
    },
    {
      q: "Apakah data dan pembicaraan saya dijamin kerahasiaannya?",
      a: "Sangat dijamin. Seluruh data rekam medis dan isi percakapan konseling dilindungi sepenuhnya oleh undang-undang, sumpah profesi, serta Kode Etik Psikologi Indonesia (HIMPSI). Kami tidak membagikan informasi apa pun kepada pihak luar tanpa persetujuan tertulis Anda."
    },
    {
      q: "Dapatkah kami menjadwalkan ulang (reschedule) jika berhalangan?",
      a: "Tentu saja. Anda dapat melakukan reschedule jadwal bimbingan selambat-lambatnya 24 jam sebelum sesi dimulai dengan menghubungi layanan WhatsApp Support resmi kami yang tercantum di bagian bantuan."
    },
    {
      q: "Apakah bimbingan pranikah hanya untuk yang sudah pasti menikah?",
      a: "Tidak harus. Banyak pasangan pacaran yang sedang merencanakan arah hubungan jangka panjang memanfaatkan bimbingan ini untuk mengevaluasi kecocokan visi-misi, nilai hidup, dan kesiapan mental masing-masing sebelum melangkah lebih jauh."
    },
    {
      q: "Bagaimana cara mengakses Video & Ebook Premium yang dibeli?",
      a: "Setelah transaksi berhasil, sistem otomatis membuka hak akses item tersebut di Dashboard Klien Anda. Anda bisa menonton video panduan langsung dari peramban dan mengunduh ebook digital sebagai bekal pembelajaran seumur hidup."
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      
      {/* 1. PREMIUM HERO SECTION */}
      <PremiumHero 
        onStartCounseling={() => scrollToSection("booking-section")}
        onScheduleConsultation={() => scrollToSection("booking-section")}
      />

      {/* 2. SERVICE SECTION */}
      <section id="services-section" className="py-24 px-6 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono text-sage-600 tracking-widest uppercase font-bold bg-sage-50 px-3 py-1 rounded-full border border-sage-100">Layanan Klinis Kami</span>
            <h2 className="h2-serif text-neutral-warm-900 mt-3 font-bold">Layanan Konseling & Bimbingan Cinta</h2>
            <p className="body-comfort-sm mt-3">Investasikan ruang terbaik untuk mengurai kebuntuan emosional bersama pasangan secara aman, profesional, dan solutif.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {services.map((svc) => (
              <motion.div 
                key={svc.id}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`flex flex-col justify-between p-8 rounded-3xl border border-neutral-warm-200/60 bg-neutral-warm-50/20 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 relative overflow-hidden`}
              >
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-sage-600 font-bold uppercase bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-100">
                    {svc.badge}
                  </span>
                  
                  <h3 className="font-serif text-2xl font-bold text-neutral-warm-900 mt-4">{svc.name}</h3>
                  <p className="text-xs text-neutral-warm-500 italic mt-1">Mulai {formatRupiah(svc.price)} / Sesi Jam</p>
                  
                  <p className="body-comfort-sm mt-4 text-neutral-warm-600 leading-relaxed">
                    {svc.description}
                  </p>

                  <div className="mt-6 space-y-2.5">
                    {svc.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Check className="w-4 h-4 text-sage-500 shrink-0" />
                        <span className="text-neutral-warm-700 font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-warm-200/50 flex items-center justify-between">
                  <button 
                    onClick={() => {
                      scrollToSection("booking-section");
                    }}
                    className="btn-primary text-xs py-2 px-4 rounded-lg bg-sage-500 hover:bg-sage-600 w-full"
                  >
                    <span>Pilih Layanan Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>


      {/* 3. ABOUT SECTION */}
      <section className="py-24 px-6 bg-gradient-to-b from-ivory-100 to-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-terracotta-100/30 rounded-full filter blur-3xl" />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-sage-100/40 rounded-3xl rotate-2 scale-102 border border-sage-200" />
            <div className="relative bg-white rounded-3xl p-4 shadow-soft-lg border border-sage-100">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" 
                alt="Mr Bi Clinical Psychologist" 
                className="rounded-2xl w-full object-cover h-[400px]"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-sage-900/95 text-white p-4 rounded-xl shadow-lg border border-sage-800">
                <span className="font-mono text-[9px] uppercase tracking-widest text-sage-300 block">Kredo Pelayanan</span>
                <p className="font-serif italic text-sm text-sage-100 mt-1">
                  \"Pernikahan yang bahagia bukanlah ketiadaan konflik, melainkan kemampuan meretas jarak emosional dan merajut kembali rasa aman bersama.\"
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-7 space-y-6 text-left"
          >
            <span className="text-xs font-mono text-terracotta-600 tracking-widest uppercase font-bold bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-100">
              Tentang Konselor Utama
            </span>
            <h2 className="h2-serif text-neutral-warm-900 font-bold leading-tight">
              Mr Bi, M.Psi., Psikolog
            </h2>
            <p className="body-comfort text-neutral-warm-600">
              Seorang psikolog klinis yang mendedikasikan karir profesionalnya untuk membantu ribuan pasangan pasutri dan pranikah dalam menyembuhkan luka batin relasional. Berlisensi resmi dari Himpunan Psikologi Indonesia (HIMPSI) dengan fokus pendekatan ilmiah berbasis bukti (Evidence-Based Practice).
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-sage-200/50">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-sage-50 flex items-center justify-center shrink-0 border border-sage-100">
                  <Heart className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-sm text-neutral-warm-900">Gottman Framework</h4>
                  <p className="text-xs text-neutral-warm-500 mt-0.5">Analisis pola pertengkaran dan pembangunan jembatan rasa.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-terracotta-50 flex items-center justify-center shrink-0 border border-terracotta-100">
                  <Wind className="w-5 h-5 text-terracotta-500" />
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-sm text-neutral-warm-900">Emotionally Focused</h4>
                  <p className="text-xs text-neutral-warm-500 mt-0.5">Membantu meretas kecemasan keterikatan (attachment wounds).</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-ivory-100 flex items-center justify-center shrink-0 border border-ivory-200">
                  <CheckCircle className="w-5 h-5 text-ivory-700" />
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-sm text-neutral-warm-900">Seksologi Ilmiah</h4>
                  <p className="text-xs text-neutral-warm-500 mt-0.5">Edukasi keintiman fisik, hasrat seksual, & kecocokan biologis.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-sage-50 flex items-center justify-center shrink-0 border border-sage-100">
                  <ShieldCheck className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-sm text-neutral-warm-900">HIMPSI Certified</h4>
                  <p className="text-xs text-neutral-warm-500 mt-0.5">Praktik berlandaskan hukum dan etika psikologi klinis resmi.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => scrollToSection("booking-section")}
                className="btn-accent text-xs py-2.5 px-6"
              >
                <span>Jadwalkan Konseling Pertama Anda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

        </div>
      </section>


      {/* 4. WHY CHOOSE US SECTION */}
      <section className="py-24 px-6 bg-white border-t border-sage-100/40">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono text-sage-600 tracking-widest uppercase font-bold bg-sage-50 px-3 py-1 rounded-full border border-sage-100">Keunggulan Layanan</span>
            <h2 className="h2-serif text-neutral-warm-900 mt-3 font-bold">Mengapa Memilih Solusi Mr Bi?</h2>
            <p className="body-comfort-sm mt-3">Komitmen kami adalah menghadirkan lingkungan terapeutik yang aman dan metode klinis terbaik untuk kesembuhan relasi Anda.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((bn, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="bg-ivory-50/70 border border-sage-100/50 rounded-2xl p-6 shadow-soft-sm flex flex-col gap-4 text-left hover:bg-white transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-sage-100 flex items-center justify-center shadow-soft-sm">
                  {bn.icon}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-neutral-warm-900">{bn.title}</h3>
                  <p className="text-xs text-neutral-warm-500 leading-relaxed mt-2">{bn.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>


      {/* 5. STATISTICS SECTION */}
      <section className="py-16 bg-sage-900 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sage-800 rounded-full filter blur-3xl opacity-30" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            {statistics.map((stat, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="space-y-2 border-r last:border-r-0 border-sage-800/80 px-4"
              >
                <span className="font-serif text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ivory-300 to-terracotta-200 block">
                  {stat.number}
                </span>
                <span className="text-sm font-sans font-semibold text-ivory-100 block">
                  {stat.label}
                </span>
                <span className="text-xs text-sage-400 font-sans block max-w-[200px] mx-auto">
                  {stat.desc}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* 6. VIDEO PREVIEW SECTION */}
      <section className="py-24 px-6 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono text-sage-600 tracking-widest uppercase font-bold bg-sage-50 px-3 py-1 rounded-full border border-sage-100">Materi Audio Visual</span>
            <h2 className="h2-serif text-neutral-warm-900 mt-3 font-bold">Teaser Modul Video Premium</h2>
            <p className="body-comfort-sm mt-3">Tonton materi dasar secara terstruktur sebagai langkah awal mendalami psikologi relasi secara mandiri.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {videos.map((vid) => (
              <motion.div 
                key={vid.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white border border-sage-100 rounded-3xl p-6 shadow-soft-md hover:shadow-soft-lg flex flex-col justify-between gap-6 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Aspect-video placeholder acting as preview player */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 group">
                    <img 
                      src={vid.thumbnailUrl} 
                      alt={vid.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/40 transition-colors" />
                    
                    {/* Play Button Trigger */}
                    <button 
                      onClick={() => setTeaserVideo({ title: vid.title, url: "https://www.w3schools.com/html/mov_bbb.mp4" })}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all text-terracotta-500 cursor-pointer"
                    >
                      <Play className="w-6 h-6 fill-terracotta-500 translate-x-0.5" />
                    </button>

                    <span className="absolute bottom-3 right-3 bg-neutral-900/90 backdrop-blur-sm text-[10px] text-white font-mono px-2 py-0.5 rounded-lg border border-neutral-800 font-bold">
                      {vid.duration} Teaser
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-terracotta-600 font-bold tracking-widest uppercase">
                      Premium Course Teaser
                    </span>
                    <h3 className="font-sans font-bold text-lg text-neutral-warm-900 mt-1 leading-snug">{vid.title}</h3>
                    <p className="text-xs text-neutral-warm-500 mt-2 leading-relaxed">{vid.description}</p>
                  </div>
                </div>

                <div className="border-t border-sage-100/60 pt-4 flex items-center justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-warm-400">Harga Modul Penuh</span>
                    <span className="font-sans font-bold text-sm text-neutral-warm-900">{formatRupiah(vid.price)}</span>
                  </div>
                  {vid.isUnlocked ? (
                    <span className="text-xs text-sage-600 font-bold flex items-center gap-1 bg-sage-50 px-3 py-1.5 rounded-lg border border-sage-100">
                      <CheckCircle className="w-4 h-4 text-sage-500" /> Terbuka di Portal
                    </span>
                  ) : (
                    <button 
                      onClick={() => buyVideo(vid.id)}
                      className="btn-accent text-xs py-2 px-4 rounded-xl font-semibold"
                    >
                      Buka Akses Video
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* 7. EBOOK PREVIEW SECTION */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-ivory-50 scroll-mt-16 border-t border-sage-100/40">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono text-sage-600 tracking-widest uppercase font-bold bg-sage-50 px-3 py-1 rounded-full border border-sage-100">Modul Edukasi Cetak</span>
            <h2 className="h2-serif text-neutral-warm-900 mt-3 font-bold">Ebook Panduan Menata Hubungan</h2>
            <p className="body-comfort-sm mt-3">Bekali relasi Anda dengan literatur psikologis praktis sebagai peta jalan mengarungi bahtera rumah tangga.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {ebooks.map((eb) => (
              <motion.div 
                key={eb.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-sage-100/60 p-6 shadow-soft-md flex flex-col md:flex-row gap-6 items-stretch"
              >
                {/* 3D-like Book Cover mockup */}
                <div className="w-full md:w-36 h-48 rounded-xl overflow-hidden shrink-0 relative bg-neutral-100 shadow-soft-md border border-neutral-200/50 group relative">
                  <img src={eb.coverUrl} alt={eb.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                  <div className="absolute inset-y-0 left-0 w-2.5 bg-neutral-900/15" /> {/* spine shadow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/10" />
                  <span className="absolute top-2 right-2 bg-sage-900/90 text-[8px] uppercase tracking-wider font-mono text-white px-1.5 py-0.5 rounded font-bold">
                    DIGITAL PDF
                  </span>
                </div>

                <div className="flex flex-col justify-between flex-grow text-left">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-sage-600 font-bold uppercase tracking-widest block">Karya {eb.author}</span>
                    <h3 className="font-sans font-bold text-base text-neutral-warm-900 leading-snug">{eb.title}</h3>
                    <p className="text-xs text-neutral-warm-500 leading-relaxed line-clamp-3">{eb.description}</p>
                  </div>

                  <div className="border-t border-sage-100 pt-4 flex items-center justify-between mt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-neutral-warm-400">Harga Ebook</span>
                      <span className="font-sans font-bold text-sm text-neutral-warm-900">{formatRupiah(eb.price)}</span>
                    </div>

                    {eb.isUnlocked ? (
                      <span className="text-xs text-sage-600 font-bold flex items-center gap-1 bg-sage-50 px-3 py-1.5 rounded-lg border border-sage-100">
                        <Check className="w-3.5 h-3.5" /> Siap Unduh
                      </span>
                    ) : (
                      <button 
                        onClick={() => buyEbook(eb.id)}
                        className="btn-accent text-xs py-2 px-4 rounded-xl font-semibold flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Beli Ebook</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* 8. LATEST ARTICLES SECTION */}
      <section className="py-24 px-6 bg-white scroll-mt-16 border-t border-sage-100/40">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="text-left max-w-xl">
              <span className="text-xs font-mono text-sage-600 tracking-widest uppercase font-bold bg-sage-50 px-3 py-1 rounded-full border border-sage-100">Literasi Psikologi</span>
              <h2 className="h2-serif text-neutral-warm-900 mt-3 font-bold">Kajian Cinta & Pernikahan Terbaru</h2>
              <p className="body-comfort-sm mt-3">Baca tulisan esai dan hasil telaah kasus bimbingan klinis keluarga yang dianalisis secara psikologis dan ilmiah.</p>
            </div>
            <button 
              onClick={() => setActiveTab("articles")}
              className="btn-secondary text-xs px-6 py-3 self-start md:self-auto flex items-center gap-2 font-semibold shrink-0"
            >
              <span>Lihat Semua Artikel</span>
              <ArrowRight className="w-4 h-4 text-sage-600" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((art) => (
              <motion.article 
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="bg-ivory-50/20 rounded-3xl overflow-hidden border border-sage-100/60 shadow-soft-sm hover:shadow-soft-md flex flex-col h-full justify-between transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={art.coverUrl} alt={art.title} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 bg-sage-900/90 text-[10px] text-white font-mono px-2.5 py-1 rounded-md font-bold">
                    {art.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-warm-400 font-mono">
                      <span>{art.publishedAt}</span>
                      <span>•</span>
                      <span>{art.readTime} Baca</span>
                    </div>
                    <h3 className="font-sans font-bold text-base text-neutral-warm-900 hover:text-sage-600 transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-neutral-warm-500 leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-sage-100/60 mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-warm-400">Oleh {art.author}</span>
                    <button 
                      onClick={() => setActiveTab("articles")}
                      className="text-xs font-semibold text-sage-600 hover:text-sage-800 flex items-center gap-1 group/btn cursor-pointer"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </section>


      {/* 9. TESTIMONIALS SECTION */}
      <section className="py-24 px-6 bg-gradient-to-b from-ivory-50 via-white to-white border-t border-sage-100/40 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono text-sage-600 tracking-widest uppercase font-bold bg-sage-50 px-3 py-1 rounded-full border border-sage-100">Kisah Sukses Klien</span>
            <h2 className="h2-serif text-neutral-warm-900 mt-3 font-bold">Ulasan Tulus Dari Relasi yang Dipulihkan</h2>
            <p className="body-comfort-sm mt-3">Mendengar secara jujur testimoni dari pasangan yang berhasil membangun kembali jembatan pengertian.</p>
          </div>

          {/* Testimonial slider layout */}
          <div className="max-w-4xl mx-auto relative px-6 md:px-12">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-soft-md border border-sage-100 relative text-left"
              >
                <div className="absolute top-6 right-8 text-sage-100 hidden sm:block">
                  <Quote className="w-20 h-20 rotate-180" />
                </div>

                <div className="flex items-center gap-1 text-terracotta-400">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="font-serif italic text-neutral-warm-700 text-base md:text-lg leading-relaxed mt-6 relative z-10">
                  \"{testimonials[activeTestimonial].quote}\"
                </p>

                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-sage-100">
                  <img 
                    src={testimonials[activeTestimonial].avatar} 
                    alt={testimonials[activeTestimonial].name} 
                    className="w-12 h-12 rounded-full object-cover border border-sage-100"
                  />
                  <div>
                    <h4 className="font-sans font-bold text-sm text-neutral-warm-900">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-xs text-neutral-warm-400 font-sans mt-0.5">{testimonials[activeTestimonial].status}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Pagination dots */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${activeTestimonial === i ? "bg-sage-600 scale-125" : "bg-sage-200 hover:bg-sage-300"}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* 10. FAQ SECTION */}
      <section className="py-24 px-6 bg-white border-t border-sage-100/40">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono text-sage-600 tracking-widest uppercase font-bold bg-sage-50 px-3 py-1 rounded-full border border-sage-100">Pertanyaan Umum</span>
            <h2 className="h2-serif text-neutral-warm-900 mt-3 font-bold">Frequently Asked Questions</h2>
            <p className="body-comfort-sm mt-3">Temukan jawaban cepat atas pertanyaan mendasar mengenai alur kerja terapi, kerahasiaan, dan kualifikasi kami.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-ivory-50/50 border border-sage-100 rounded-2xl overflow-hidden transition-colors hover:bg-white"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 cursor-pointer"
                  >
                    <span className="font-sans font-bold text-sm md:text-base text-neutral-warm-900">{faq.q}</span>
                    <span className={`w-8 h-8 rounded-lg bg-white border border-sage-100 flex items-center justify-center text-sage-600 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-neutral-warm-600 leading-relaxed border-t border-sage-100/60">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* 11. CTA SECTION */}
      <section className="py-20 px-6 bg-sage-900 text-white relative overflow-hidden text-center">
        {/* Background ambient bubble */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sage-800 rounded-full filter blur-3xl opacity-20" />
        
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <Heart className="w-12 h-12 text-terracotta-300 fill-terracotta-300/20 mx-auto animate-breath" />
          
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Pulihkan Kehangatan Cinta & <br />
            Komitmen Hubungan Anda
          </h2>
          
          <p className="font-sans text-sage-200 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Jangan biarkan jarak emosional merenggangkan apa yang pernah disatukan dengan komitmen suci. Mulai sesi pertolongan bimbingan bersama psikolog klinis hari ini.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <button
              onClick={() => scrollToSection("booking-section")}
              className="btn-accent px-8 py-3.5 text-sm font-semibold rounded-xl"
            >
              Booking Konseling Sekarang
            </button>
            <button
              onClick={() => setActiveTab("forum")}
              className="btn-secondary px-8 py-3.5 text-sm font-semibold rounded-xl text-sage-900 bg-white hover:bg-ivory-100"
            >
              Gabung Komunitas Diskusi
            </button>
          </div>

          <p className="text-[11px] text-sage-400 font-mono italic">
            *Setiap proses transaksi pembayaran dijamin 100% aman melalui Midtrans gateway integration.
          </p>
        </div>
      </section>


      {/* 12. COUNSELING BOOKING SECTION */}
      <section id="booking-section" className="py-24 px-6 bg-gradient-to-b from-white to-ivory-100 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono text-sage-600 tracking-widest uppercase font-bold bg-sage-50 px-3 py-1 rounded-full border border-sage-100">
              Formulir Pendaftaran
            </span>
            <h2 className="h2-serif text-neutral-warm-900 mt-3 font-bold">Atur Jadwal Konseling</h2>
            <p className="body-comfort-sm mt-3">Silakan pilih kategori bimbingan, tentukan tanggal, dan isi catatan pribadi secara privat.</p>
          </div>
          
          <BookingForm onBookingSuccess={() => setActiveTab("dashboard")} />
        </div>
      </section>


      {/* TEASER VIDEO DIALOG MODAL */}
      <AnimatePresence>
        {teaserVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay background */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTeaserVideo(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-sage-100 z-10"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-sage-100 flex items-center justify-between bg-sage-50">
                <span className="font-serif font-bold text-neutral-warm-900 text-sm md:text-base leading-none">
                  {teaserVideo.title} (Teaser)
                </span>
                <button 
                  onClick={() => setTeaserVideo(null)}
                  className="text-neutral-warm-400 hover:text-neutral-warm-600 text-sm font-bold w-8 h-8 rounded-full hover:bg-sage-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Video body */}
              <div className="aspect-video bg-black w-full relative">
                <video 
                  src={teaserVideo.url} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-white border-t border-sage-100 flex justify-between items-center">
                <span className="text-xs text-neutral-warm-500 font-sans">Materi edukasi klinis dipersembahkan oleh Mr Bi, M.Psi.</span>
                <button 
                  onClick={() => setTeaserVideo(null)}
                  className="btn-primary text-xs py-1.5 px-4 rounded-xl"
                >
                  Selesai Menonton
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* 13. FOOTER SECTION */}
      <footer className="w-full bg-sage-900 text-sage-200 py-16 border-t border-sage-950">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 text-left">
          
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sage-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-ivory-50 fill-white/10" />
              </div>
              <span className="font-serif font-bold text-lg text-ivory-100">Solusi Mr Bi</span>
            </div>
            <p className="font-sans text-sm text-sage-300 leading-relaxed max-w-sm">
              Memahami makna terdalam dari pernikahan dan dinamika cinta melalui lensa psikologi keluarga yang ilmiah, berempati, dan solutif.
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-sage-400">
              <Shield className="w-4 h-4 text-ivory-500 shrink-0" />
              <span>Kerahasiaan klien 100% aman berlandaskan kode etika psikologi klinis Indonesia.</span>
            </div>
          </div>

          <div>
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-ivory-100 mb-4">Layanan Utama</h4>
            <ul className="space-y-2 text-xs text-sage-300 font-sans">
              <li>
                <button onClick={() => scrollToSection("services-section")} className="hover:text-ivory-100 transition-colors cursor-pointer text-left">
                  Konseling Pernikahan
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("services-section")} className="hover:text-ivory-100 transition-colors cursor-pointer text-left">
                  Konseling Pasangan
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("services-section")} className="hover:text-ivory-100 transition-colors cursor-pointer text-left">
                  Bimbingan Pranikah
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("videos")} className="hover:text-ivory-100 transition-colors cursor-pointer text-left">
                  Video & Ebook Premium
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-ivory-100 mb-4">Kontak & Alamat</h4>
            <ul className="space-y-2 text-xs text-sage-300 font-sans">
              <li>Menteng, Jakarta Pusat</li>
              <li>support@solusimrbi.id</li>
              <li>+62 812-3456-7890</li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1 bg-sage-800 text-ivory-300 px-2 py-1 rounded text-[10px] font-mono border border-sage-700">
                  <CheckCircle className="w-3 h-3 text-sage-400" />
                  Active Sandbox Mode
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-sage-800 text-center text-xs text-sage-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Solusi Mr Bi. Dipersembahkan untuk keharmonisan relasi cinta Indonesia.</p>
          <p className="font-mono text-[10px] text-sage-500">
            Framer Motion Interactive Landing Page • Sandbox Mode
          </p>
        </div>
      </footer>

    </div>
  );
};
