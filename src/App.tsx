import React, { useState } from "react";
import { AppStateProvider, useAppState } from "./store";
import { Navbar } from "./components/Navbar";
import { SEOHeadManager, Breadcrumbs, SEODashboard } from "./seo/SEOManager";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { FolderTreeVisualizer } from "./components/FolderTreeVisualizer";
import { BookingForm } from "./features/counseling/BookingForm";
import { ArticleList } from "./features/articles/ArticleList";
import { ForumBoard } from "./features/forum/ForumBoard";
import { UserDashboard } from "./dashboard/UserDashboard";
import { AdminPanel } from "./admin/AdminPanel";
import { formatRupiah } from "./utils/formatter";
import { COUNSELING_CATEGORIES } from "./constants";
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
  Smartphone,
  CheckCircle,
  Eye,
  RefreshCw,
  Wind,
  ShieldCheck,
  Award,
  Zap,
  Lock,
  X,
  Loader2,
  CreditCard
} from "lucide-react";

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const { 
    videos, 
    buyVideo, 
    ebooks, 
    buyEbook, 
    currentUser,
    purchases,
    addPurchaseRecord,
    addWebhook
  } = useAppState();

  const [breathState, setBreathState] = useState<"Inhale" | "Hold" | "Exhale" | "Rest">("Rest");
  const [inputText, setInputText] = useState("");

  // Checkout Simulator States
  const [checkoutItem, setCheckoutItem] = useState<{ id: string; name: string; price: number; type: "video" | "ebook" } | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"options" | "midtrans" | "success">("options");
  const [payMethod, setPayMethod] = useState<"qris" | "va">("qris");
  const [isPaying, setIsPaying] = useState(false);

  const isUnlockedVideo = (vId: string) => {
    if (currentUser?.membershipTier === "gold" || currentUser?.membershipTier === "lifetime") return true;
    if (currentUser?.membershipTier === "silver" && vId === "v1") return true;
    const isBought = purchases.some(p => p.itemType === "video" && p.itemId === vId && p.status === "success");
    return isBought;
  };

  const isUnlockedEbook = (ebId: string) => {
    if (currentUser?.membershipTier === "gold" || currentUser?.membershipTier === "lifetime") return true;
    if (currentUser?.membershipTier === "silver" && ebId === "eb1") return true;
    const isBought = purchases.some(p => p.itemType === "ebook" && p.itemId === ebId && p.status === "success");
    return isBought;
  };

  const triggerBreathingCycle = () => {
    setBreathState("Inhale");
    setTimeout(() => {
      setBreathState("Hold");
      setTimeout(() => {
        setBreathState("Exhale");
        setTimeout(() => {
          setBreathState("Rest");
        }, 2000);
      }, 2000);
    }, 2000);
  };

  const colors = {
    sage: [
      { name: "Sage 50", hex: "#f4f7f5", tailwind: "bg-sage-50 text-sage-800" },
      { name: "Sage 100", hex: "#e5ede8", tailwind: "bg-sage-100 text-sage-800" },
      { name: "Sage 200", hex: "#cbdbd1", tailwind: "bg-sage-200 text-sage-900" },
      { name: "Sage 300", hex: "#a7c1b1", tailwind: "bg-sage-300 text-sage-900" },
      { name: "Sage 400", hex: "#81a48f", tailwind: "bg-sage-400 text-white" },
      { name: "Sage 500 (Core)", hex: "#628772", tailwind: "bg-sage-500 text-white font-medium" },
      { name: "Sage 600", hex: "#4c6c5a", tailwind: "bg-sage-600 text-white" },
      { name: "Sage 700", hex: "#3f574a", tailwind: "bg-sage-700 text-white" },
    ],
    ivory: [
      { name: "Ivory 50", hex: "#fdfdfb", tailwind: "bg-ivory-50 text-sage-900 border border-neutral-warm-200" },
      { name: "Ivory 100 (Core)", hex: "#f9f8f3", tailwind: "bg-ivory-100 text-sage-900" },
      { name: "Ivory 200", hex: "#f3f0e6", tailwind: "bg-ivory-200 text-sage-900" },
      { name: "Ivory 300", hex: "#e7dec6", tailwind: "bg-ivory-800/80 text-sage-950" },
    ],
    terracotta: [
      { name: "Terracotta 50", hex: "#fbf5f3", tailwind: "bg-terracotta-50 text-terracotta-900" },
      { name: "Terracotta 100", hex: "#f6e8e4", tailwind: "bg-terracotta-100 text-terracotta-800" },
      { name: "Terracotta 200", hex: "#ecd2ca", tailwind: "bg-terracotta-200 text-terracotta-900" },
      { name: "Terracotta 500 (Core)", hex: "#b55d47", tailwind: "bg-terracotta-500 text-white font-medium" },
    ]
  };

  return (
    <div className="min-h-screen bg-ivory-100 text-neutral-warm-800 selection:bg-sage-200 selection:text-sage-950 flex flex-col">
      <SEOHeadManager activeTab={activeTab} />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Breadcrumbs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "landing" && (
        <LandingPage setActiveTab={setActiveTab} />
      )}

      {activeTab === "articles" && (
        <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="text-xs font-mono text-sage-600 tracking-widest uppercase font-bold">PSIKOLOGI LITERASI</span>
            <h1 className="h2-serif text-neutral-warm-900 mt-1">Artikel & Esai Dinamika Cinta</h1>
            <p className="body-comfort-sm mt-2">Kumpulan buah pikiran, telaah kasus bimbingan, dan tips hubungan romantis berbasis pendekatan psikologi keluarga.</p>
          </div>
          <ArticleList />
        </div>
      )}

      {activeTab === "videos" && (
        <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow space-y-12">
          
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="text-xs font-mono text-sage-600 tracking-widest uppercase font-bold">PREMIUM EDUCATIONAL ASSETS</span>
            <h1 className="h2-serif text-neutral-warm-900 mt-1">Video & Ebook Premium</h1>
            <p className="body-comfort-sm mt-2">Modul edukasi mandiri berlisensi eksklusif untuk mendalami relasi pernikahan secara privat.</p>
          </div>

          {/* Videos Grid */}
          <div className="space-y-6">
            <h3 className="font-serif text-xl text-neutral-warm-900 border-b border-sage-100 pb-2">1. Video Pembelajaran Terbimbing</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((vid) => {
                const unlocked = isUnlockedVideo(vid.id);
                return (
                  <div key={vid.id} className="card-therapy flex flex-col md:flex-row gap-4 items-stretch h-full">
                    <div className="w-full md:w-44 h-36 rounded-xl overflow-hidden shrink-0 relative">
                      <img src={vid.thumbnailUrl} alt={vid.title} className="object-cover w-full h-full" />
                      {!unlocked && (
                        <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="bg-amber-500 text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                            <Lock className="w-3 h-3" /> Premium
                          </span>
                        </div>
                      )}
                      <span className="absolute bottom-2 right-2 bg-neutral-warm-900/90 text-[10px] text-white font-mono px-2 py-0.5 rounded">
                        {vid.duration}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-grow">
                      <div>
                        <h4 className="font-sans font-bold text-sm text-neutral-warm-900 leading-snug">{vid.title}</h4>
                        <p className="text-xs text-neutral-warm-500 line-clamp-2 mt-1.5">{vid.description}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        {unlocked ? (
                          <span className="text-xs text-sage-600 font-bold flex items-center gap-1 bg-sage-50 px-2.5 py-1 rounded border border-sage-100">
                            <Check className="w-3.5 h-3.5" /> Terbuka
                          </span>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-neutral-warm-800">{formatRupiah(vid.price)}</span>
                            <button 
                              onClick={() => {
                                setCheckoutItem({ id: vid.id, name: vid.title, price: vid.price, type: "video" });
                                setCheckoutStep("options");
                              }}
                              className="btn-accent text-xs py-1.5 px-3 cursor-pointer flex items-center gap-1"
                            >
                              <Lock className="w-3.5 h-3.5" /> Buka Akses
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ebooks Grid */}
          <div className="space-y-6">
            <h3 className="font-serif text-xl text-neutral-warm-900 border-b border-sage-100 pb-2">2. Ebook Panduan Hubungan</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {ebooks.map((eb) => {
                const unlocked = isUnlockedEbook(eb.id);
                return (
                  <div key={eb.id} className="card-therapy flex flex-col md:flex-row gap-4 items-stretch h-full">
                    <div className="w-full md:w-32 h-40 rounded-xl overflow-hidden shrink-0 relative border border-sage-100">
                      <img src={eb.coverUrl} alt={eb.title} className="object-cover w-full h-full" />
                      {!unlocked && (
                        <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="bg-amber-500 text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                            <Lock className="w-3 h-3" /> Premium
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-grow">
                      <div>
                        <span className="text-[10px] font-mono text-sage-600 uppercase font-semibold">Ebook Spesialis</span>
                        <h4 className="font-sans font-bold text-sm text-neutral-warm-900 leading-snug mt-1">{eb.title}</h4>
                        <p className="text-xs text-neutral-warm-500 line-clamp-2 mt-1.5">{eb.description}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        {unlocked ? (
                          <span className="text-xs text-sage-600 font-bold flex items-center gap-1 bg-sage-50 px-2.5 py-1 rounded border border-sage-100">
                            <Check className="w-3.5 h-3.5" /> Terbuka
                          </span>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-neutral-warm-800">{formatRupiah(eb.price)}</span>
                            <button 
                              onClick={() => {
                                setCheckoutItem({ id: eb.id, name: eb.title, price: eb.price, type: "ebook" });
                                setCheckoutStep("options");
                              }}
                              className="btn-accent text-xs py-1.5 px-3 cursor-pointer flex items-center gap-1"
                            >
                              <Lock className="w-3.5 h-3.5" /> Beli Ebook
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Checkout Item Paywall/Midtrans Simulator Modal */}
      {checkoutItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-warm-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-sage-100 animate-scale-up flex flex-col h-[520px]">
            {/* Header */}
            <div className="bg-neutral-900 text-white p-4 flex justify-between items-center shrink-0 font-sans">
              <span className="text-xs font-mono font-bold tracking-widest text-neutral-300">CHECKOUT ASSET PREMIUM</span>
              <button onClick={() => setCheckoutItem(null)} className="text-neutral-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            {checkoutStep === "options" ? (
              <div className="p-6 flex-grow flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div className="text-center space-y-1.5">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">PILIHAN AKSES</span>
                    <h3 className="font-serif text-lg font-bold text-neutral-warm-900 mt-1">{checkoutItem.name}</h3>
                    <p className="text-xs text-neutral-warm-500">Materi edukatif berlisensi penuh untuk pendampingan pasutri mandiri.</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Option 1: Buy Single via Midtrans */}
                    <div 
                      onClick={() => setCheckoutStep("midtrans")}
                      className="p-4 rounded-2xl border-2 border-neutral-100 hover:border-sage-300 bg-ivory-50/20 cursor-pointer transition-all flex items-center gap-3"
                    >
                      <div className="bg-sage-100 p-2.5 rounded-xl text-sage-700">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs font-bold text-neutral-warm-900">Beli Eceran (Simulasi Midtrans)</p>
                        <p className="text-[10px] text-neutral-warm-500">Sekali beli akses langsung terbuka permanen.</p>
                      </div>
                      <span className="text-xs font-bold text-neutral-warm-900">{formatRupiah(checkoutItem.price)}</span>
                    </div>

                    {/* Option 2: Upgrade Tier (Better Value) */}
                    <div 
                      onClick={() => {
                        setCheckoutItem(null);
                        setActiveTab("dashboard");
                      }}
                      className="p-4 rounded-2xl border-2 border-amber-200 hover:border-amber-300 bg-amber-50/20 cursor-pointer transition-all flex items-center gap-3 relative"
                    >
                      <div className="absolute -top-2.5 right-4 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">REKOMENDASI</div>
                      <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700">
                        <Sparkles className="w-5 h-5 fill-amber-500/20" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-900">Upgrade ke Gold / Lifetime Member</p>
                        <p className="text-[10px] text-amber-700">Bebas akses SELURUH video, ebook, artikel, & forum premium!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-sage-50">
                  <p className="text-[10px] text-neutral-warm-400 text-center">Data & koneksi dilindungi enkripsi standard industri.</p>
                </div>
              </div>
            ) : checkoutStep === "midtrans" ? (
              <div className="p-6 flex-grow flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">METODE PEMBAYARAN SECURE:</p>
                  
                  {/* QRIS */}
                  <div 
                    onClick={() => setPayMethod("qris")}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                      ${payMethod === "qris" ? "border-sage-500 bg-sage-50/20" : "border-neutral-100 hover:border-sage-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-slate-700" />
                      <span className="text-xs font-bold text-neutral-warm-900">QRIS (Gopay / ShopeePay)</span>
                    </div>
                    {payMethod === "qris" && <div className="w-3.5 h-3.5 rounded-full bg-sage-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                  </div>

                  {/* Virtual Account */}
                  <div 
                    onClick={() => setPayMethod("va")}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                      ${payMethod === "va" ? "border-sage-500 bg-sage-50/20" : "border-neutral-100 hover:border-sage-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-slate-700" />
                      <span className="text-xs font-bold text-neutral-warm-900">BCA Virtual Account</span>
                    </div>
                    {payMethod === "va" && <div className="w-3.5 h-3.5 rounded-full bg-sage-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                  </div>

                  <p className="text-[11px] text-neutral-500 text-center leading-relaxed">
                    Menekan tombol di bawah akan mensimulasikan gerbang pembayaran digital Midtrans dan asinkron webhook server.
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-sage-50">
                  <button 
                    onClick={() => {
                      setIsPaying(true);
                      setTimeout(() => {
                        setIsPaying(false);
                        setCheckoutStep("success");
                        const orderId = `INV-${checkoutItem.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
                        
                        // Register purchase
                        addPurchaseRecord({
                          userId: currentUser?.id || "user-client-1",
                          itemType: checkoutItem.type,
                          itemId: checkoutItem.id,
                          itemName: checkoutItem.name,
                          amount: checkoutItem.price,
                          paymentMethod: payMethod.toUpperCase(),
                          status: "success",
                          orderId: orderId
                        });

                        // Call direct unlock
                        if (checkoutItem.type === "video") {
                          buyVideo(checkoutItem.id);
                        } else {
                          buyEbook(checkoutItem.id);
                        }

                        // Webhook
                        addWebhook({
                          transaction_time: new Date().toISOString().replace("T", " ").substring(0, 19),
                          transaction_status: "settlement",
                          status_message: "midtrans purchase complete",
                          status_code: "200",
                          signature_key: Math.random().toString(36).substring(2),
                          payment_type: payMethod === "qris" ? "qris" : "bank_transfer",
                          order_id: orderId,
                          gross_amount: checkoutItem.price.toString() + ".00",
                          item_details: {
                            id: checkoutItem.id,
                            name: checkoutItem.name,
                            category: checkoutItem.type
                          }
                        });
                      }, 1200);
                    }}
                    disabled={isPaying}
                    className="w-full btn-primary py-3 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Menghubungkan ke Midtrans...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Bayar {formatRupiah(checkoutItem.price)}</span>
                      </>
                    )}
                  </button>
                  <button 
                    disabled={isPaying}
                    onClick={() => setCheckoutStep("options")}
                    className="w-full btn-text py-1 text-xs text-neutral-500 cursor-pointer"
                  >
                    Kembali
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 flex-grow flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg text-neutral-warm-900 font-bold">Pembelian Sukses!</h3>
                <p className="text-xs text-neutral-warm-600 max-w-xs mx-auto leading-relaxed">
                  Akses modul bimbingan **{checkoutItem.name}** telah terbuka sepenuhnya. Anda dapat memutarnya di tab ini atau mengunduhnya di workspace dashboard kapan saja!
                </p>
                <button 
                  onClick={() => setCheckoutItem(null)}
                  className="w-full btn-primary py-2.5 text-xs font-bold cursor-pointer"
                >
                  Mulai Akses Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "forum" && (
        <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="text-xs font-mono text-sage-600 tracking-widest uppercase font-bold">FORUM DISKUSI</span>
            <h1 className="h2-serif text-neutral-warm-900 mt-1">Dengar Rasa: Komunitas Harmoni</h1>
            <p className="body-comfort-sm mt-2">Wadah diskusi bimbingan interaktif, bertanya kasus, serta berinteraksi hangat secara anonim dengan pendampingan psikolog.</p>
          </div>
          <ForumBoard />
        </div>
      )}

      {activeTab === "dashboard" && (
        <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
          <UserDashboard />
        </div>
      )}

      {activeTab === "admin" && (
        <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
          <AdminPanel />
        </div>
      )}

      {activeTab === "seo" && (
        <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
          <SEODashboard setActiveTab={setActiveTab} />
        </div>
      )}

      {activeTab === "design-system" && (
        <div className="w-full flex-grow">
          {/* HEADER HERO */}
          <header id="main-header" className="w-full max-w-7xl mx-auto px-6 py-16 text-center border-b border-sage-200/40">
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-sage-100 text-sage-800 text-xs font-mono font-medium rounded-full tracking-widest uppercase">
                DESIGN SYSTEM SPECIFICATION
              </span>
            </div>
            <h1 id="brand-title" className="h1-serif mb-4 font-serif font-bold text-neutral-warm-900">
              Solusi Mr Bi
            </h1>
            <p id="brand-tagline" className="body-comfort max-w-2xl mx-auto italic text-sage-700">
              "Memahami makna terdalam dari pernikahan dan dinamika cinta melalui lensa psikologi."
            </p>
          </header>

          {/* CORE INFO */}
          <section id="system-principles" className="w-full max-w-7xl mx-auto px-6 py-8">
            <div className="bg-sage-800 text-ivory-100 rounded-3xl p-8 md:p-10 shadow-soft-lg grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h3 className="font-serif text-2xl text-ivory-50 mb-3">Filosofi Desain Menenangkan</h3>
                <p className="font-sans text-sage-200 leading-relaxed text-sm">
                  Sistem visual ini dirancang dengan pendekatan psikoterapi yang berfokus pada ketenangan, kehangatan, dan penerimaan emosional. Kombinasi warna alam membantu mengurangi kecemasan bagi pasangan atau individu yang sedang mencari bimbingan pernikahan dan dinamika relasi.
                </p>
              </div>
              <div className="flex flex-col gap-3 border-t md:border-t-0 md:border-l border-sage-700 pt-6 md:pt-0 md:pl-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-ivory-400 shrink-0" />
                  <span className="text-xs font-mono tracking-wider uppercase">VIBE: Therapeutic & Trusted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-ivory-400 shrink-0" />
                  <span className="text-xs font-mono tracking-wider uppercase">SCALE: Balanced & Symmetrical</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-ivory-400 shrink-0" />
                  <span className="text-xs font-mono tracking-wider uppercase">CONTRAST: Eye-Safe Warm Warmth</span>
                </div>
              </div>
            </div>
          </section>

          {/* DETAILED SPECIFICATIONS GRID */}
          <main id="design-system-main" className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-16">
            
            {/* SECTION 1: COLOR PALETTE */}
            <section id="section-colors" className="scroll-mt-8">
              <div className="border-b border-sage-200/40 pb-4 mb-8">
                <h2 className="h2-serif text-neutral-warm-900">1. Color Palette</h2>
                <p className="body-comfort-sm">Spektrum warna psikologis yang meredakan emosi negatif dan menumbuhkan rasa aman.</p>
              </div>

              <div className="flex flex-col gap-10">
                {/* Sage Green */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-sage-500" />
                    <h3 className="h4-sans text-neutral-warm-900">Sage Green (Primary — Kedamaian & Pemulihan)</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                    {colors.sage.map((c) => (
                      <div key={c.name} className="flex flex-col gap-1">
                        <div className={`h-16 rounded-xl ${c.tailwind} flex items-end p-2 shadow-soft-sm`}>
                          <span className="text-[10px] font-mono leading-none font-bold">Hex</span>
                        </div>
                        <div className="px-1">
                          <p className="text-xs font-sans font-semibold text-neutral-warm-900 truncate">{c.name}</p>
                          <p className="text-[10px] font-mono text-neutral-warm-500">{c.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warm Ivory */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-ivory-300" />
                    <h3 className="h4-sans text-neutral-warm-900">Warm Ivory (Secondary — Kehangatan, Kenyamanan Rumah)</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {colors.ivory.map((c) => (
                      <div key={c.name} className="flex flex-col gap-1">
                        <div className={`h-16 rounded-xl ${c.tailwind} flex items-end p-2 shadow-soft-sm`}>
                          <span className="text-[10px] font-mono leading-none font-bold">Hex</span>
                        </div>
                        <div className="px-1">
                          <p className="text-xs font-sans font-semibold text-neutral-warm-900 truncate">{c.name}</p>
                          <p className="text-[10px] font-mono text-neutral-warm-500">{c.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terracotta */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-terracotta-500" />
                    <h3 className="h4-sans text-neutral-warm-900">Terracotta (Accent — Cinta, Hubungan, Koneksi Emosional)</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {colors.terracotta.map((c) => (
                      <div key={c.name} className="flex flex-col gap-1">
                        <div className={`h-16 rounded-xl ${c.tailwind} flex items-end p-2 shadow-soft-sm`}>
                          <span className="text-[10px] font-mono leading-none font-bold">Hex</span>
                        </div>
                        <div className="px-1">
                          <p className="text-xs font-sans font-semibold text-neutral-warm-900 truncate">{c.name}</p>
                          <p className="text-[10px] font-mono text-neutral-warm-500">{c.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: TYPOGRAPHY */}
            <section id="section-typography" className="scroll-mt-8">
              <div className="border-b border-sage-200/40 pb-4 mb-8">
                <h2 className="h2-serif text-neutral-warm-900">2. Typography</h2>
                <p className="body-comfort-sm">Kombinasi Serif klasik yang elegan untuk tajuk utama dan Sans modern yang sangat terbaca untuk antarmuka pengguna.</p>
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4 flex flex-col gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-sage-100/50 shadow-soft-sm">
                    <h3 className="h4-sans text-neutral-warm-900 mb-2">Display Family</h3>
                    <p className="font-serif text-3xl font-semibold italic text-sage-800">Playfair Display</p>
                    <p className="body-comfort-sm mt-3">Membangkitkan rasa profesionalitas, kearifan batin, dan keindahan sastra dalam pernikahan.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-sage-100/50 shadow-soft-sm">
                    <h3 className="h4-sans text-neutral-warm-900 mb-2">Interface Family</h3>
                    <p className="font-sans text-2xl font-semibold text-sage-800">Inter</p>
                    <p className="body-comfort-sm mt-3">Modern, proporsional, dan sangat terbaca pada berbagai ukuran layar digital.</p>
                  </div>
                </div>

                <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-sage-100/50 shadow-soft-md flex flex-col gap-6">
                  <div>
                    <p className="text-[10px] font-mono text-sage-500 mb-1">H1 Serif (.h1-serif)</p>
                    <h1 className="h1-serif">Pernikahan yang Bertumbuh</h1>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-sage-500 mb-1">H2 Serif (.h2-serif)</p>
                    <h2 className="h2-serif">Bimbingan Konseling Pasangan</h2>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-sage-500 mb-1">Body Comfort (.body-comfort)</p>
                    <p className="body-comfort">
                      Perjalanan cinta bukanlah tentang ketiadaan konflik, melainkan tentang bagaimana kita membangun jembatan di atas jurang ketidakpahaman. Melalui pendekatan psikologi, mari temukan harmoni sejati.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: BUTTON STYLES */}
            <section id="section-buttons" className="scroll-mt-8">
              <div className="border-b border-sage-200/40 pb-4 mb-8">
                <h2 className="h2-serif text-neutral-warm-900">5. Button Styles</h2>
                <p className="body-comfort-sm">Gaya tombol taktil premium untuk mengarahkan pengguna mengambil langkah keputusan dengan mantap.</p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-sage-100/50 shadow-soft-md">
                <div className="grid md:grid-cols-5 gap-6 items-end">
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-sage-500">Primary (Sage)</span>
                    <button className="btn-primary w-full">
                      <span>Konseling</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <code className="text-[10px] font-mono bg-sage-50 p-1 text-center text-sage-700 rounded mt-1">.btn-primary</code>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-sage-500">Secondary (Ivory)</span>
                    <button className="btn-secondary w-full">
                      <BookOpen className="w-4 h-4 text-sage-600" />
                      <span>Baca Artikel</span>
                    </button>
                    <code className="text-[10px] font-mono bg-sage-50 p-1 text-center text-sage-700 rounded mt-1">.btn-secondary</code>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-sage-500">Accent (Terracotta)</span>
                    <button className="btn-accent w-full">
                      <Heart className="w-4 h-4 text-ivory-100 fill-white/20" />
                      <span>Solusi Cinta</span>
                    </button>
                    <code className="text-[10px] font-mono bg-sage-50 p-1 text-center text-sage-700 rounded mt-1">.btn-accent</code>
                  </div>

                </div>
              </div>
            </section>

            {/* SECTION 8: ANIMATION STYLE */}
            <section id="section-animations" className="scroll-mt-8">
              <div className="border-b border-sage-200/40 pb-4 mb-8">
                <h2 className="h2-serif text-neutral-warm-900">8. Animation & Micro-Interactions</h2>
                <p className="body-comfort-sm">Transisi terapeutik lembut yang dirancang khusus untuk memandu fokus batin serta meredakan laju detak jantung pengguna.</p>
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-stretch">
                
                {/* Breath Assistant */}
                <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-sage-100/50 shadow-soft-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Wind className="w-5 h-5 text-sage-600 animate-breath" />
                      <h3 className="h4-sans text-neutral-warm-900">Asisten Pernapasan 4-7-8 (Simulasi Animasi)</h3>
                    </div>
                    <p className="body-comfort-sm mb-6">
                      Fitur pernapasan interaktif bawaan untuk membantu menenangkan pikiran klien sebelum memulai sesi konsultasi pernikahan yang mendalam.
                    </p>
                    
                    <div className="flex flex-col items-center justify-center py-6">
                      {/* Breath Circle */}
                      <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-1000 border-4 border-sage-100 shadow-soft-lg
                        ${breathState === "Inhale" ? "scale-110 bg-sage-100/80 border-sage-400" : ""}
                        ${breathState === "Hold" ? "scale-115 bg-terracotta-100/80 border-terracotta-300" : ""}
                        ${breathState === "Exhale" ? "scale-100 bg-ivory-100 border-sage-300" : ""}
                        ${breathState === "Rest" ? "scale-100 bg-white" : ""}
                      `}>
                        <span className="text-[10px] font-mono tracking-widest text-neutral-warm-400 uppercase">Fase</span>
                        <span className={`text-base font-semibold font-serif transition-colors duration-500
                          ${breathState === "Inhale" ? "text-sage-700" : ""}
                          ${breathState === "Hold" ? "text-terracotta-700" : ""}
                          ${breathState === "Exhale" ? "text-sage-600" : ""}
                          ${breathState === "Rest" ? "text-neutral-warm-500" : ""}
                        `}>
                          {breathState}
                        </span>
                      </div>
                      
                      <button 
                        onClick={triggerBreathingCycle}
                        disabled={breathState !== "Rest"}
                        className="mt-6 btn-secondary text-xs px-4 py-2 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Mulai Helaan Napas</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Micro Interaction Triggers */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-sage-100/50 shadow-soft-sm flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-sage-500">MICRO-TRANSITION 1</span>
                      <h4 className="font-serif text-lg text-neutral-warm-900 mt-1 mb-2">Entri Lembut Ke Atas</h4>
                    </div>
                    <div className="p-4 bg-sage-50/50 rounded-xl border border-sage-100/40 text-xs italic text-sage-800 animate-fade-in-up">
                      Sempurna untuk memunculkan teks kutipan psikologi secara elegan dari ketiadaan. (.animate-fade-in-up)
                    </div>
                  </div>
                </div>

              </div>
            </section>

          </main>
        </div>
      )}

      {activeTab !== "landing" && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <MainAppContent />
    </AppStateProvider>
  );
}
