import React, { useState, useEffect } from "react";
import { useAppState } from "../store";
import { formatDateIndo, formatRupiah } from "../utils/formatter";
import { 
  Calendar, 
  Video, 
  BookOpen, 
  ShieldCheck, 
  Heart, 
  ExternalLink, 
  Download, 
  Award, 
  Zap, 
  CreditCard, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  History, 
  X, 
  Sparkles, 
  Check, 
  Loader2, 
  Smartphone,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { MembershipTier } from "../types";

export const UserDashboard: React.FC = () => {
  const { 
    bookings, 
    videos, 
    ebooks, 
    currentUser, 
    upgradeMembership, 
    purchases, 
    addPurchaseRecord,
    webhooks,
    addWebhook,
    clearWebhooks
  } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState<"profile" | "downloads" | "history" | "webhooks">("profile");
  
  // Midtrans Simulation States
  const [showMidtrans, setShowMidtrans] = useState(false);
  const [midtransItem, setMidtransItem] = useState<{ id: string; name: string; price: number; type: "membership" | "video" | "ebook" } | null>(null);
  const [midtransPaymentMethod, setMidtransPaymentMethod] = useState<"qris" | "va" | "cc">("qris");
  const [midtransStep, setMidtransStep] = useState<"select" | "pay" | "success">("select");
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Download simulation states
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
  const [downloadingItem, setDownloadingItem] = useState<string | null>(null);

  // Auto-calculated unlocked items based on active tier
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

  const unlockedVideos = videos.filter((v) => isUnlockedVideo(v.id));
  const unlockedEbooks = ebooks.filter((eb) => isUnlockedEbook(eb.id));

  // Handle single buy/upgrade
  const initiatePayment = (id: string, name: string, price: number, type: "membership" | "video" | "ebook") => {
    setMidtransItem({ id, name, price, type });
    setMidtransPaymentMethod("qris");
    setMidtransStep("select");
    setShowMidtrans(true);
  };

  // Copy virtual account simulation
  const handleCopyVA = () => {
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Simulate payment processing & webhook generation
  const handleSimulatePayment = () => {
    if (!midtransItem) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setMidtransStep("success");

      const orderId = `INV-${midtransItem.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // 1. Create Purchase record as success
      addPurchaseRecord({
        userId: currentUser?.id || "user-client-1",
        itemType: midtransItem.type,
        itemId: midtransItem.id,
        itemName: midtransItem.name,
        amount: midtransItem.price,
        paymentMethod: midtransPaymentMethod.toUpperCase(),
        status: "success",
        orderId: orderId
      });

      // 2. Perform direct state upgrade / unlock
      if (midtransItem.type === "membership") {
        upgradeMembership(midtransItem.id as MembershipTier);
      } else if (midtransItem.type === "video") {
        // Unlock video in store
        const buyV = useAppState().buyVideo;
        if (buyV) buyV(midtransItem.id);
      } else if (midtransItem.type === "ebook") {
        // Unlock ebook in store
        const buyEb = useAppState().buyEbook;
        if (buyEb) buyEb(midtransItem.id);
      }

      // 3. Generate Simulated Midtrans Webhook Notification
      const simulatedWebhook = {
        transaction_time: new Date().toISOString().replace("T", " ").substring(0, 19),
        transaction_status: "settlement",
        status_message: "midtrans payment successful",
        status_code: "200",
        signature_key: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
        payment_type: midtransPaymentMethod === "qris" ? "qris" : midtransPaymentMethod === "va" ? "bank_transfer" : "credit_card",
        order_id: orderId,
        merchant_id: "G7012983",
        gross_amount: midtransItem.price.toString() + ".00",
        currency: "IDR",
        approval_code: Math.floor(100000 + Math.random() * 900000).toString(),
        fraud_status: "accept",
        item_details: {
          id: midtransItem.id,
          name: midtransItem.name,
          category: midtransItem.type
        }
      };

      addWebhook(simulatedWebhook);
    }, 1500);
  };

  // Simulate file download with progress
  const startSimulatedDownload = (title: string, fileId: string) => {
    if (downloadingItem) return;
    setDownloadingItem(fileId);
    setDownloadProgress((prev) => ({ ...prev, [fileId]: 0 }));

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setDownloadProgress((prev) => ({ ...prev, [fileId]: current }));
      
      if (current >= 100) {
        clearInterval(interval);
        setDownloadingItem(null);
        
        // Trigger actual download of a virtual license text file
        const blob = new Blob([
          `=============================================\n`,
          `SOLUSI MR BI - PREMIUM LICENSE CERTIFICATE\n`,
          `=============================================\n`,
          `Asset Name  : ${title}\n`,
          `Downloaded  : Clara Salsabila (${currentUser?.email})\n`,
          `Tier Level  : ${currentUser?.membershipTier.toUpperCase()}\n`,
          `Signature   : ${Math.random().toString(36).substr(2, 10).toUpperCase()}\n`,
          `Date        : ${new Date().toLocaleDateString("id-ID")}\n`,
          `=============================================\n`,
          `Terima kasih telah mempercayakan bimbingan pernikahan Anda bersama Solusi Mr Bi.\n`,
          `Gunakan modul ini secara bijaksana demi menciptakan relasi yang harmonis.`
        ], { type: "text/plain;charset=utf-8" });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title.replace(/\s+/g, "_")}_SolusiMrBi.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 200);
  };

  // Get active pricing plans
  const MEMBERSHIP_PLANS = [
    {
      id: "silver",
      name: "Silver Tier",
      price: 149000,
      period: "/bulan",
      description: "Ideal untuk pendalaman materi romansa & konflik ringan berpasangan.",
      features: [
        "Akses Seluruh Artikel Premium",
        "Akses Forum Premium \"Dengar Rasa\"",
        "Akses Video 1 (Mengurai Benang Kusut)",
        "Akses Ebook 1 (Seni Mencintai)",
        "Download Ebook & Lisensi PDF"
      ],
      icon: Award,
      color: "border-slate-300 text-slate-800 bg-slate-50/50",
      accent: "bg-slate-400"
    },
    {
      id: "gold",
      name: "Gold Tier",
      price: 299000,
      period: "/bulan",
      description: "Rekomendasi terbaik untuk kesiapan pranikah & pasutri secara komparatif.",
      features: [
        "Akses Seluruh Artikel Premium",
        "Akses Forum Premium \"Dengar Rasa\"",
        "Bebas Akses SELURUH Video Premium",
        "Bebas Akses SELURUH Ebook Premium",
        "Download Unlimited Modul & Video",
        "Diskon 15% Jadwal Konseling Privat"
      ],
      icon: Sparkles,
      color: "border-amber-300 text-amber-800 bg-amber-50/20",
      accent: "bg-amber-500"
    },
    {
      id: "lifetime",
      name: "Lifetime Tier",
      price: 999000,
      period: "Sekali Bayar",
      description: "Investasi relasi seumur hidup tanpa beban biaya langganan bulanan.",
      features: [
        "Semua Fitur Gold Tier Selamanya",
        "Akses Lifetime Tanpa Kadaluarsa",
        "Prioritas Pendampingan Chat WhatsApp",
        "Bebas Download Update Produk Baru",
        "Undangan Eksklusif Webinar Bulanan"
      ],
      icon: Zap,
      color: "border-rose-300 text-rose-800 bg-rose-50/20",
      accent: "bg-rose-500"
    }
  ];

  const getTierDetails = (tier: string) => {
    switch(tier) {
      case "silver":
        return { name: "SILVER", color: "bg-slate-100 text-slate-800 border-slate-300" };
      case "gold":
        return { name: "GOLD VIP", color: "bg-amber-100 text-amber-800 border-amber-300 animate-pulse" };
      case "lifetime":
        return { name: "LIFETIME", color: "bg-rose-100 text-rose-800 border-rose-300 font-bold" };
      default:
        return { name: "FREE MEMBER", color: "bg-neutral-warm-100 text-neutral-warm-500" };
    }
  };

  const currentTierInfo = getTierDetails(currentUser?.membershipTier || "free");

  return (
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* Intro Dashboard */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-sage-100 shadow-soft-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-mono text-sage-600 tracking-wider uppercase font-bold">WORKSPACE KLIEN PRIVATE</span>
          <h2 className="font-serif text-2xl md:text-3xl text-neutral-warm-900 mt-1">Halo, {currentUser?.fullName}</h2>
          <p className="body-comfort-sm mt-1">Pantau status membership Anda, unduh aset premium bimbingan, dan kelola riwayat transaksi secara privat.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 text-xs font-bold font-sans ${currentTierInfo.color}`}>
            <Award className="w-4 h-4 shrink-0" />
            <span>Tier: {currentTierInfo.name}</span>
          </div>
          <div className="bg-sage-50 px-4 py-2 rounded-2xl border border-sage-100 flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0" />
            <span className="text-sage-800 font-medium font-sans">Koneksi Sandboxed</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs navigation */}
      <div className="flex border-b border-sage-100 overflow-x-auto pb-px gap-1.5 scrollbar-thin">
        <button 
          onClick={() => setActiveSubTab("profile")}
          className={`px-4 py-2 text-xs font-bold font-sans rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${activeSubTab === "profile" ? "bg-white border-t border-x border-sage-100 text-sage-800" : "text-neutral-warm-500 hover:text-sage-800"}`}
        >
          Membership & Rencana
        </button>
        <button 
          onClick={() => setActiveSubTab("downloads")}
          className={`px-4 py-2 text-xs font-bold font-sans rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${activeSubTab === "downloads" ? "bg-white border-t border-x border-sage-100 text-sage-800" : "text-neutral-warm-500 hover:text-sage-800"}`}
        >
          Download Center ({unlockedEbooks.length + unlockedVideos.length})
        </button>
        <button 
          onClick={() => setActiveSubTab("history")}
          className={`px-4 py-2 text-xs font-bold font-sans rounded-t-xl transition-all whitespace-nowrap cursor-pointer relative ${activeSubTab === "history" ? "bg-white border-t border-x border-sage-100 text-sage-800" : "text-neutral-warm-500 hover:text-sage-800"}`}
        >
          Riwayat Pembelian
          {purchases.length > 0 && (
            <span className="absolute -top-1.5 -right-1 bg-terracotta-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {purchases.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveSubTab("webhooks")}
          className={`px-4 py-2 text-xs font-bold font-sans rounded-t-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${activeSubTab === "webhooks" ? "bg-white border-t border-x border-sage-100 text-sage-800" : "text-neutral-warm-500 hover:text-sage-800"}`}
        >
          <Terminal className="w-3 h-3 text-sage-500" />
          <span>Midtrans Webhook Log</span>
          {webhooks.length > 0 && (
            <span className="bg-sage-600 text-white font-mono text-[9px] px-1.5 py-0.2 rounded-full">
              {webhooks.length}
            </span>
          )}
        </button>
      </div>

      {/* Profile & Membership Management */}
      {activeSubTab === "profile" && (
        <div className="space-y-8 animate-scale-up">
          {/* Active Membership Status Banner */}
          <div className="bg-white p-6 rounded-3xl border border-sage-100 shadow-soft-sm grid md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-sage-500 uppercase tracking-widest block font-bold">INFO AKUN AKTIF</span>
              <h4 className="font-sans font-bold text-lg text-neutral-warm-900">{currentUser?.fullName}</h4>
              <p className="text-xs text-neutral-warm-500">{currentUser?.email}</p>
              <p className="text-xs text-neutral-warm-500">{currentUser?.phone || "+6281234567890"}</p>
            </div>
            <div className="space-y-1 md:border-l md:border-sage-100 md:pl-6">
              <span className="text-[10px] font-mono text-sage-500 uppercase tracking-widest block font-bold">STATUS PAKET</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${currentTierInfo.color}`}>
                  {currentTierInfo.name}
                </span>
                <span className="text-xs text-sage-700 bg-sage-50 border border-sage-200 px-2 py-0.5 rounded font-medium">Aktif</span>
              </div>
              <p className="text-[11px] text-neutral-warm-500 mt-1">
                Layanan Berakhir: <strong className="text-neutral-warm-800">{currentUser?.membershipTier === "free" ? "Permanen" : currentUser?.membershipTier === "lifetime" ? "Seumur Hidup (Lifetime)" : "30 Hari Kedepan (" + currentUser?.membershipExpiry + ")"}</strong>
              </p>
            </div>
            <div className="bg-sage-50 p-4 rounded-2xl border border-sage-100/60 text-xs text-sage-800 space-y-2">
              <p className="font-bold">Keuntungan Tier Anda:</p>
              {currentUser?.membershipTier === "free" ? (
                <p className="text-[11px] text-neutral-warm-600">Akses terbatas. Anda hanya dapat mengakses Artikel dan Forum biasa. Upgrade ke Silver/Gold untuk membuka seluruh materi premium bimbingan.</p>
              ) : currentUser?.membershipTier === "silver" ? (
                <ul className="list-disc list-inside space-y-1 text-neutral-warm-700 text-[11px]">
                  <li>Semua artikel premium terbuka</li>
                  <li>Bisa berdiskusi di Forum Premium</li>
                  <li>Buka 1 Video & 1 Ebook Premium teratas</li>
                  <li>Unduh file ebook premium</li>
                </ul>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-neutral-warm-700 text-[11px]">
                  <li>Seluruh artikel premium & Video terbuka</li>
                  <li>Bebas posting forum premium</li>
                  <li>Download tanpa batas seluruh ebook & materi</li>
                  <li>Prioritas bimbingan privat</li>
                </ul>
              )}
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <h3 className="font-serif text-xl md:text-2xl text-neutral-warm-900">Tingkatkan Paket Hubungan Anda</h3>
              <p className="text-xs text-neutral-warm-500 mt-1">Investasikan kedamaian rumah tangga dan keintiman emosional bersama materi terstruktur psikologi Mr Bi.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {MEMBERSHIP_PLANS.map((plan) => {
                const isCurrent = currentUser?.membershipTier === plan.id;
                return (
                  <div 
                    key={plan.id}
                    className={`rounded-3xl border p-6 flex flex-col justify-between transition-all relative overflow-hidden bg-white hover:shadow-soft-md
                      ${isCurrent ? "ring-2 ring-sage-500 border-sage-400 bg-sage-50/10" : "border-sage-100"}`}
                  >
                    {isCurrent && (
                      <div className="absolute top-0 right-0 bg-sage-500 text-ivory-50 text-[10px] font-bold px-3 py-1 rounded-bl-xl font-mono">
                        PAKET AKTIF
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-2 rounded-xl text-white ${plan.accent}`}>
                          <plan.icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-sans font-bold text-base text-neutral-warm-900">{plan.name}</h4>
                      </div>
                      <p className="text-xs text-neutral-warm-500 min-h-[32px] leading-relaxed mb-4">
                        {plan.description}
                      </p>
                      
                      <div className="mb-6">
                        <span className="font-serif text-2xl md:text-3xl font-bold text-neutral-warm-900">
                          {formatRupiah(plan.price)}
                        </span>
                        <span className="text-xs text-neutral-warm-500 font-medium"> {plan.period}</span>
                      </div>

                      <div className="border-t border-sage-50 pt-4 space-y-2.5 mb-6">
                        <p className="text-[10px] font-mono text-sage-600 font-bold uppercase tracking-wider">FITUR UTAMA:</p>
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-neutral-warm-700">
                            <Check className="w-3.5 h-3.5 text-sage-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => initiatePayment(plan.id, plan.name, plan.price, "membership")}
                      disabled={isCurrent}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-1.5
                        ${isCurrent 
                          ? "bg-sage-100 text-sage-600 border border-sage-200 cursor-not-allowed" 
                          : "btn-primary"
                        }`}
                    >
                      {isCurrent ? "Paket Anda Saat Ini" : `Upgrade ke ${plan.name.split(" ")[0]}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Download Center */}
      {activeSubTab === "downloads" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-sage-100 shadow-soft-sm space-y-6 animate-scale-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-sage-100 pb-4">
            <div>
              <h3 className="font-serif text-lg text-neutral-warm-900">Pusat Unduhan Materi Premium</h3>
              <p className="text-xs text-neutral-warm-500 mt-1">Dapatkan salinan PDF ebook, panduan, dan instrumen bimbingan berlisensi khusus untuk Anda.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs text-amber-800">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Akses didasarkan pada Tier aktif member Anda.</span>
            </div>
          </div>

          {/* Ebooks Downloads Grid */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-sm text-neutral-warm-800 border-l-2 border-sage-500 pl-2">1. Ebook & Panduan Digital (Mati & Hidup Hubungan)</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {ebooks.map((eb) => {
                const unlocked = isUnlockedEbook(eb.id);
                const isDownloading = downloadingItem === eb.id;
                const progress = downloadProgress[eb.id] || 0;

                return (
                  <div key={eb.id} className="p-4 rounded-2xl border border-sage-100 flex items-center gap-4 bg-ivory-50/40">
                    <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 border border-sage-100 shadow-soft-sm bg-neutral-warm-100">
                      <img src={eb.coverUrl} alt={eb.title} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h5 className="font-sans font-bold text-xs text-neutral-warm-900 truncate">{eb.title}</h5>
                      <p className="text-[10px] text-neutral-warm-500 mt-0.5">Penulis: {eb.author}</p>
                      
                      {isDownloading ? (
                        <div className="w-full space-y-1.5 mt-2">
                          <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                            <div className="bg-sage-600 h-1 transition-all duration-200" style={{ width: `${progress}%` }} />
                          </div>
                          <p className="text-[9px] font-mono text-sage-600">Mengunduh... {progress}%</p>
                        </div>
                      ) : unlocked ? (
                        <button 
                          onClick={() => startSimulatedDownload(eb.title, eb.id)}
                          className="mt-3 inline-flex items-center gap-1 bg-sage-500 hover:bg-sage-600 text-white text-[10px] font-bold font-sans px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                        >
                          <Download className="w-3 h-3" /> Unduh PDF
                        </button>
                      ) : (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-neutral-warm-500 flex items-center gap-1 bg-neutral-warm-100 px-2 py-0.5 rounded">
                            <Lock className="w-2.5 h-2.5 text-neutral-warm-400" /> Terkunci
                          </span>
                          <button 
                            onClick={() => initiatePayment(eb.id, eb.title, eb.price, "ebook")}
                            className="text-sage-600 text-[10px] font-bold hover:underline cursor-pointer"
                          >
                            Beli Seharga {formatRupiah(eb.price)}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video Downloads Grid */}
          <div className="space-y-4 pt-4">
            <h4 className="font-sans font-bold text-sm text-neutral-warm-800 border-l-2 border-sage-500 pl-2">2. Video Pembelajaran Mandiri (Durasi Penuh)</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {videos.map((v) => {
                const unlocked = isUnlockedVideo(v.id);
                const isDownloading = downloadingItem === v.id;
                const progress = downloadProgress[v.id] || 0;

                return (
                  <div key={v.id} className="p-4 rounded-2xl border border-sage-100 flex items-center gap-4 bg-ivory-50/40">
                    <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-sage-100 bg-neutral-warm-100 relative">
                      <img src={v.thumbnailUrl} alt={v.title} className="object-cover w-full h-full" />
                      <span className="absolute bottom-1 right-1 bg-neutral-900/80 text-[8px] text-white font-mono px-1 rounded">
                        {v.duration}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h5 className="font-sans font-bold text-xs text-neutral-warm-900 truncate">{v.title}</h5>
                      <p className="text-[10px] text-neutral-warm-500 mt-0.5">Durasi pembelajaran: {v.duration}</p>
                      
                      {isDownloading ? (
                        <div className="w-full space-y-1.5 mt-2">
                          <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                            <div className="bg-sage-600 h-1 transition-all duration-200" style={{ width: `${progress}%` }} />
                          </div>
                          <p className="text-[9px] font-mono text-sage-600">Mengunduh... {progress}%</p>
                        </div>
                      ) : unlocked ? (
                        <button 
                          onClick={() => startSimulatedDownload(v.title, v.id)}
                          className="mt-3 inline-flex items-center gap-1 bg-sage-500 hover:bg-sage-600 text-white text-[10px] font-bold font-sans px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                        >
                          <Download className="w-3 h-3" /> Unduh Video (MP4)
                        </button>
                      ) : (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-neutral-warm-500 flex items-center gap-1 bg-neutral-warm-100 px-2 py-0.5 rounded">
                            <Lock className="w-2.5 h-2.5 text-neutral-warm-400" /> Terkunci
                          </span>
                          <button 
                            onClick={() => initiatePayment(v.id, v.title, v.price, "video")}
                            className="text-sage-600 text-[10px] font-bold hover:underline cursor-pointer"
                          >
                            Beli Seharga {formatRupiah(v.price)}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Purchase History */}
      {activeSubTab === "history" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-sage-100 shadow-soft-sm space-y-6 animate-scale-up">
          <div>
            <h3 className="font-serif text-lg text-neutral-warm-900 flex items-center gap-2">
              <History className="w-5 h-5 text-sage-600" />
              <span>Riwayat Pembelian & Invoicing</span>
            </h3>
            <p className="text-xs text-neutral-warm-500 mt-1">Daftar transaksi yang terekam pada gateway pembayaran digital virtual Midtrans.</p>
          </div>

          {purchases.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-neutral-warm-200 rounded-2xl text-center">
              <p className="text-xs text-neutral-warm-500">Belum ada riwayat transaksi yang terekam.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-sage-100">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-sage-50 border-b border-sage-100 text-sage-800 font-bold font-sans">
                    <th className="p-3.5">No. Invoice</th>
                    <th className="p-3.5">Tanggal</th>
                    <th className="p-3.5">Item Pembelian</th>
                    <th className="p-3.5 text-right">Harga</th>
                    <th className="p-3.5">Metode Bayar</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {purchases.map((rec) => (
                    <tr key={rec.id} className="hover:bg-ivory-50/30 transition-colors font-sans text-neutral-warm-700">
                      <td className="p-3.5 font-mono text-[11px] font-bold text-neutral-warm-950">{rec.orderId}</td>
                      <td className="p-3.5">{new Date(rec.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB</td>
                      <td className="p-3.5">
                        <span className="font-semibold">{rec.itemName}</span>
                        <span className="ml-1.5 text-[9px] uppercase px-1.5 py-0.2 rounded font-bold tracking-wider bg-sage-50 border border-sage-100 text-sage-700">
                          {rec.itemType}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-bold text-neutral-warm-950">{formatRupiah(rec.amount)}</td>
                      <td className="p-3.5 font-mono text-[10px] text-neutral-warm-500 uppercase">{rec.paymentMethod}</td>
                      <td className="p-3.5 text-center">
                        <span className="inline-flex items-center gap-1 bg-sage-50 text-sage-800 border border-sage-200 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                          <Check className="w-3 h-3 text-sage-600" />
                          Success
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Webhook Logs Terminal */}
      {activeSubTab === "webhooks" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-sage-100 shadow-soft-sm space-y-6 animate-scale-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-sage-100 pb-4">
            <div>
              <h3 className="font-serif text-lg text-neutral-warm-900 flex items-center gap-1.5">
                <Terminal className="w-5 h-5 text-sage-600 animate-pulse" />
                <span>Simulasi Webhook Midtrans (POST /api/webhooks/midtrans)</span>
              </h3>
              <p className="text-xs text-neutral-warm-500 mt-1">Simulasikan pengiriman webhook notifikasi dari Midtrans ke sistem server-side untuk memperbarui paket otomatis.</p>
            </div>
            {webhooks.length > 0 && (
              <button 
                onClick={clearWebhooks}
                className="text-xs text-terracotta-600 hover:underline cursor-pointer"
              >
                Clear Log
              </button>
            )}
          </div>

          {webhooks.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-neutral-warm-200 rounded-2xl text-center space-y-2">
              <p className="text-xs text-neutral-warm-500">Belum ada log webhook masuk.</p>
              <p className="text-[11px] text-neutral-warm-400">Silakan lakukan simulasi transaksi membership di tab <strong>Membership & Rencana</strong> untuk melihat trigger webhook real-time!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-sage-800 bg-sage-50/80 p-3 rounded-xl border border-sage-100 font-sans leading-relaxed">
                👉 <strong>Bagaimana cara kerjanya?</strong> Ketika transaksi berhasil dilakukan di payment gateway, Midtrans mengirimkan notifikasi <strong>POST</strong> asinkron ke server endpoint. Payload JSON ini divalidasi dengan signature-key untuk secara otomatis memproses upgrade akun secara asinkron tanpa intervensi manual!
              </p>
              <div className="space-y-3">
                {webhooks.map((hook, idx) => (
                  <div key={idx} className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900 text-neutral-200">
                    <div className="bg-neutral-950 px-4 py-2 flex justify-between items-center text-[10px] font-mono border-b border-neutral-800">
                      <span className="text-sage-400 font-bold">POST https://solusimrbi.com/api/webhooks/midtrans</span>
                      <span className="text-neutral-500">{hook.transaction_time} WIB</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-[11px] font-mono leading-relaxed text-yellow-100 max-h-56 overflow-y-auto">
                        {JSON.stringify(hook, null, 2)}
                      </pre>
                    </div>
                    <div className="bg-neutral-950/80 px-4 py-2 flex justify-between items-center text-[10px] font-sans border-t border-neutral-800 text-neutral-400">
                      <span>Status Response: <strong className="text-sage-500">200 OK</strong></span>
                      <span className="text-neutral-500">Signature Validated & Account Tier Upgraded Successfully</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Midtrans Snap Modal Simulator */}
      {showMidtrans && midtransItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-warm-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-sage-100 animate-scale-up flex flex-col h-[580px]">
            {/* Header */}
            <div className="bg-neutral-900 text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="font-mono text-xs font-bold tracking-widest text-neutral-300">MIDTRANS SECURE CHECKOUT</span>
              </div>
              <button 
                onClick={() => setShowMidtrans(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Merchant info */}
            <div className="bg-neutral-50 p-4 border-b border-neutral-100 flex justify-between items-center text-xs shrink-0 font-sans">
              <div>
                <p className="text-[10px] text-neutral-500">MERCHANT</p>
                <p className="font-bold text-neutral-800">Solusi Mr Bi Indonesia</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-neutral-500">TOTAL PEMBAYARAN</p>
                <p className="font-bold text-sage-600 text-sm">{formatRupiah(midtransItem.price)}</p>
              </div>
            </div>

            {/* Midtrans steps */}
            {midtransStep === "select" ? (
              <div className="flex-grow p-5 overflow-y-auto space-y-4 font-sans flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs font-bold text-neutral-700">PILIH METODE PEMBAYARAN:</p>
                  
                  {/* QRIS */}
                  <div 
                    onClick={() => setMidtransPaymentMethod("qris")}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                      ${midtransPaymentMethod === "qris" ? "border-sage-500 bg-sage-50/20" : "border-neutral-100 hover:border-sage-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg">
                        <Smartphone className="w-5 h-5 text-slate-700" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-800">QRIS (Gopay, OVO, ShopeePay)</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">Bayar instan menggunakan scan QR Code</p>
                      </div>
                    </div>
                    {midtransPaymentMethod === "qris" && <div className="w-4 h-4 rounded-full bg-sage-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                  </div>

                  {/* Virtual Account */}
                  <div 
                    onClick={() => setMidtransPaymentMethod("va")}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                      ${midtransPaymentMethod === "va" ? "border-sage-500 bg-sage-50/20" : "border-neutral-100 hover:border-sage-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg">
                        <CreditCard className="w-5 h-5 text-slate-700" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-800">Virtual Account (BCA, Mandiri, BNI)</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">Transfer Bank Virtual otomatis terkonfirmasi</p>
                      </div>
                    </div>
                    {midtransPaymentMethod === "va" && <div className="w-4 h-4 rounded-full bg-sage-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                  </div>

                  {/* Credit Card */}
                  <div 
                    onClick={() => setMidtransPaymentMethod("cc")}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                      ${midtransPaymentMethod === "cc" ? "border-sage-500 bg-sage-50/20" : "border-neutral-100 hover:border-sage-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg">
                        <ShieldAlert className="w-5 h-5 text-slate-700" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-800">Kartu Kredit / Debit Online</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">Mendukung Visa, Mastercard, dan JCB</p>
                      </div>
                    </div>
                    {midtransPaymentMethod === "cc" && <div className="w-4 h-4 rounded-full bg-sage-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                  </div>
                </div>

                <button 
                  onClick={() => setMidtransStep("pay")}
                  className="w-full btn-primary py-3 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Lanjutkan Pembayaran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : midtransStep === "pay" ? (
              <div className="flex-grow p-5 overflow-y-auto space-y-5 font-sans flex flex-col justify-between">
                <div>
                  {midtransPaymentMethod === "qris" ? (
                    <div className="text-center space-y-4">
                      <p className="text-xs font-bold text-neutral-700">SCAN KODE QR BERIKUT UNTUK MEMBAYAR:</p>
                      
                      {/* Stylized QR Code box */}
                      <div className="bg-white border border-neutral-200 p-4 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center relative shadow-inner">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
                          alt="QRIS Code" 
                          className="object-cover w-full h-full opacity-10 rounded-lg blur-[2px]" 
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                          {/* Simulated QR Code graphic */}
                          <div className="grid grid-cols-5 gap-1.5 w-32 h-32 bg-slate-900 p-2.5 rounded-xl">
                            {Array.from({ length: 25 }).map((_, i) => (
                              <div key={i} className={`rounded-sm ${(i % 3 === 0 || i % 4 === 1 || i < 5 || i > 20 || i % 5 === 0) ? "bg-white" : "bg-transparent"}`} />
                            ))}
                          </div>
                          <span className="text-[9px] font-mono font-bold tracking-widest text-slate-800 mt-2">QRIS INTERACTIVE</span>
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        Simulasikan pembayaran dengan mengklik tombol bayar di bawah. Transaksi akan langsung diproses asinkron.
                      </p>
                    </div>
                  ) : midtransPaymentMethod === "va" ? (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-neutral-700">TRANSFER BANK VIRTUAL ACCOUNT:</p>
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-none">BANK TRANSFER</p>
                        <p className="text-xs font-bold text-neutral-800 font-serif text-base leading-none mt-1">BCA Virtual Account</p>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-2">
                          <div>
                            <p className="text-[9px] text-neutral-400">NOMOR VIRTUAL ACCOUNT</p>
                            <p className="text-sm font-mono font-bold text-neutral-900">8012 2812 3456 7890</p>
                          </div>
                          <button 
                            onClick={handleCopyVA}
                            className="btn-secondary py-1 px-2.5 text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedText ? "Tersalin!" : "Salin"}</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed text-center">
                        Salin nomor virtual account di atas dan simulasikan transfer dana untuk mengaktifkan membership.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      <p className="text-xs font-bold text-neutral-700">KARTU KREDIT / DEBIT ONLINE:</p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 block mb-1">NOMOR KARTU</label>
                          <input 
                            type="text"
                            placeholder="4111 2222 3333 4444"
                            value={creditCardNumber}
                            onChange={(e) => setCreditCardNumber(e.target.value.replace(/\D/g, "").substring(0,16))}
                            className="input-field font-mono py-2"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 block mb-1">VALID THRU</label>
                            <input 
                              type="text"
                              placeholder="12/29"
                              className="input-field py-2 font-mono text-center"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 block mb-1">CVV</label>
                            <input 
                              type="text"
                              placeholder="123"
                              className="input-field py-2 font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4">
                  <button 
                    onClick={handleSimulatePayment}
                    disabled={isProcessingPayment}
                    className="w-full btn-primary py-3 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Menghubungkan ke Midtrans...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Bayar {formatRupiah(midtransItem.price)}</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setMidtransStep("select")}
                    disabled={isProcessingPayment}
                    className="w-full btn-text py-2 text-xs text-neutral-500 cursor-pointer"
                  >
                    Ganti Metode Pembayaran
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow p-6 text-center flex flex-col justify-center items-center space-y-4 font-sans animate-scale-up">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-lg text-neutral-warm-900 font-bold">Pembayaran Berhasil!</h3>
                <p className="text-xs text-neutral-warm-600 max-w-xs mx-auto leading-relaxed">
                  Dana telah diterima dan **Webhook settlement** telah berhasil diproses oleh virtual server. Akun Anda kini aktif!
                </p>
                <div className="w-full p-4 bg-emerald-50 rounded-2xl text-left border border-emerald-100 text-xs text-emerald-800 space-y-1">
                  <p>• <strong>Invoice ID:</strong> {purchases[0]?.orderId || "INV-GEN-92831"}</p>
                  <p>• <strong>Produk:</strong> {midtransItem.name}</p>
                  <p>• <strong>Nilai:</strong> {formatRupiah(midtransItem.price)}</p>
                  <p>• <strong>Status Akun:</strong> {currentUser?.membershipTier.toUpperCase()} Member</p>
                </div>
                <button 
                  onClick={() => {
                    setShowMidtrans(false);
                    setActiveSubTab("profile");
                  }}
                  className="w-full btn-primary py-2.5 text-xs font-bold cursor-pointer mt-4"
                >
                  Selesai & Tutup Simulator
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
