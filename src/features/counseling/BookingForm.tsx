import React, { useState, useEffect } from "react";
import { useAppState } from "../../store";
import { COUNSELING_CATEGORIES } from "../../constants";
import { formatRupiah, formatDateIndo } from "../../utils/formatter";
import { 
  Heart, 
  Calendar as CalendarIcon, 
  Clock, 
  CreditCard, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Globe, 
  Video, 
  MapPin, 
  Bell, 
  Mail, 
  History, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Info, 
  Check, 
  ShieldCheck,
  Send,
  Lock,
  Phone
} from "lucide-react";

// Timezones list
const TIMEZONES = [
  { code: "WIB", name: "Asia/Jakarta (WIB - UTC+7)", offset: "+07:00" },
  { code: "WITA", name: "Asia/Makassar (WITA - UTC+8)", offset: "+08:00" },
  { code: "WIT", name: "Asia/Jayapura (WIT - UTC+9)", offset: "+09:00" },
  { code: "UTC", name: "Coordinated Universal Time (UTC - GMT)", offset: "+00:00" }
];

// Hour Slots
const AVAILABLE_SLOTS = [
  "09:00 - 10:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "16:00 - 17:00",
  "19:30 - 20:30"
];

export const BookingForm: React.FC<{ onBookingSuccess?: () => void }> = ({ onBookingSuccess }) => {
  const { bookings, addBooking, updateBooking, currentUser } = useAppState();

  // Primary Workspace tab: "book" (New Booking) or "history" (My History)
  const [activeTab, setActiveTab] = useState<"book" | "history">("book");

  // Booking states
  const [selectedCategory, setSelectedCategory] = useState(COUNSELING_CATEGORIES[0].id);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(6); // 6 = July 2026, 7 = August 2026
  const [selectedDay, setSelectedDay] = useState<number>(20); // Default July 20th
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(AVAILABLE_SLOTS[2]);
  const [selectedTimezone, setSelectedTimezone] = useState("WIB");
  const [counselingType, setCounselingType] = useState<"online" | "offline">("online");
  const [meetingPlatform, setMeetingPlatform] = useState<"google-meet" | "zoom">("google-meet");
  const [offlineLocation, setOfflineLocation] = useState("Klinik Utama Harmoni Jiwa, Jakarta Selatan");
  const [notes, setNotes] = useState("");

  // UI Flow & Simulators
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutBookingId, setCheckoutBookingId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"qris" | "va_bca" | "va_mandiri" | "cc">("qris");
  const [isPaying, setIsPaying] = useState(false);
  
  // Notification Previews states
  const [previewBookingId, setPreviewBookingId] = useState<string | null>(null);
  const [notificationTab, setNotificationTab] = useState<"email" | "whatsapp">("email");
  const [simulatedReminderLog, setSimulatedReminderLog] = useState<string | null>(null);

  // Active Category detail
  const activeCategoryDetail = COUNSELING_CATEGORIES.find((c) => c.id === selectedCategory)!;

  // Calendar properties based on month index
  const getMonthData = (idx: number) => {
    if (idx === 6) {
      return { name: "Juli 2026", days: 31, startOffset: 3, year: 2026, monthStr: "07" };
    } else {
      return { name: "Agustus 2026", days: 31, startOffset: 6, year: 2026, monthStr: "08" };
    }
  };

  const monthInfo = getMonthData(currentMonthIndex);

  // Build exact date string (YYYY-MM-DD)
  const getSelectedFormattedDate = () => {
    const dayStr = String(selectedDay).padStart(2, "0");
    return `${monthInfo.year}-${monthInfo.monthStr}-${dayStr}`;
  };

  // Check if a specific slot is already booked in state (avoid double-booking)
  const isSlotBooked = (date: string, slot: string) => {
    return bookings.some(
      (b) => b.date === date && b.timeSlot.includes(slot) && b.status !== "cancelled"
    );
  };

  // Handle month change
  const handleNextMonth = () => {
    if (currentMonthIndex === 6) {
      setCurrentMonthIndex(7);
      setSelectedDay(1); // Reset day
    }
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 7) {
      setCurrentMonthIndex(6);
      setSelectedDay(20); // Reset day
    }
  };

  // Form submission handler
  const handleRegisterBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const dateStr = getSelectedFormattedDate();
    const meetingLink = counselingType === "online" 
      ? (meetingPlatform === "google-meet" 
         ? `https://meet.google.com/mrbi-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`
         : `https://zoom.us/j/987${Math.floor(100000 + Math.random() * 900000)}`)
      : "";

    const newBookingId = `book-${Math.random().toString(36).substr(2, 9)}`;

    addBooking({
      clientId: currentUser.id,
      category: selectedCategory,
      date: dateStr,
      timeSlot: `${selectedTimeSlot} ${selectedTimezone}`,
      notes,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date().toISOString().split("T")[0],
      type: counselingType,
      platform: counselingType === "online" ? meetingPlatform : "offline-location",
      timezone: TIMEZONES.find((t) => t.code === selectedTimezone)?.name || selectedTimezone,
      meetingLink,
      reminderSent: false,
      emailSent: false,
      address: counselingType === "offline" ? offlineLocation : undefined
    });

    // Directly open payment checkout flow for the newly created booking
    const bookingsSaved = JSON.parse(localStorage.getItem("solusi_mr_bi_bookings") || "[]");
    
    setCheckoutBookingId(newBookingId);
    setNotes("");
    setIsSubmitting(false);
  };

  // Simulate payment processing
  const handleProcessPayment = async (bookingId: string) => {
    setIsPaying(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Update state to paid and automatically approve/confirm the booking
    updateBooking(bookingId, { 
      paymentStatus: "paid", 
      status: "confirmed",
      emailSent: true // Autotrip email confirmation receipt
    });

    setCheckoutBookingId(null);
    setIsPaying(false);
    
    // Switch to history tab to view active/confirmed schedule
    setActiveTab("history");
    setPreviewBookingId(bookingId); // Automatically open notification preview tab
  };

  // Send Simulated Reminder notification
  const handleTriggerNotification = async (bookingId: string, type: "email" | "whatsapp") => {
    setSimulatedReminderLog("Sedang menghubungkan ke server pengirim...");
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (type === "email") {
      updateBooking(bookingId, { emailSent: true });
      setSimulatedReminderLog("Email konfirmasi & pengingat bimbingan berhasil dikirim ke " + (currentUser?.email || "klien") + "!");
    } else {
      updateBooking(bookingId, { reminderSent: true });
      setSimulatedReminderLog("Notifikasi pesan WhatsApp pengingat otomatis (Reminder) berhasil dikirim ke nomor handphone Anda!");
    }

    setTimeout(() => {
      setSimulatedReminderLog(null);
    }, 4000);
  };

  // Find booking details for previews
  const activeCheckoutBooking = bookings.find((b) => b.id === checkoutBookingId) || bookings[0];
  const activePreviewBooking = bookings.find((b) => b.id === previewBookingId) || bookings[0];

  return (
    <div className="w-full space-y-6">
      {/* TABS HEADER FOR BOOKING AND HISTORY */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-2.5 rounded-2xl border border-sage-100 shadow-soft-sm">
        <div className="flex p-0.5 bg-sage-50 rounded-xl border border-sage-100/50">
          <button
            onClick={() => {
              setActiveTab("book");
              setCheckoutBookingId(null);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2
              ${activeTab === "book" ? "bg-white text-sage-800 shadow-soft-sm font-bold" : "text-neutral-warm-500 hover:text-neutral-warm-800"}`}
          >
            <CalendarIcon className="w-4 h-4 text-sage-500" />
            <span>Booking Jadwal Baru</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("history");
              setCheckoutBookingId(null);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 relative
              ${activeTab === "history" ? "bg-white text-sage-800 shadow-soft-sm font-bold" : "text-neutral-warm-500 hover:text-neutral-warm-800"}`}
          >
            <History className="w-4 h-4 text-sage-500" />
            <span>Riwayat & Jadwal Saya</span>
            {bookings.filter((b) => b.status === "pending" || b.status === "confirmed").length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-terracotta-500 animate-ping"></span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 px-2 text-[10px] font-mono text-neutral-warm-500">
          <Globe className="w-3.5 h-3.5 text-sage-500 animate-pulse" />
          <span>Sistem sinkronisasi jam otomatis</span>
        </div>
      </div>

      {/* WORKSPACE 1: BOOKING FORM */}
      {activeTab === "book" && !checkoutBookingId && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT FORM FIELDS (8 Cols) */}
          <form onSubmit={handleRegisterBooking} className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-soft-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-sage-50 pb-3">
              <span className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center">
                <Heart className="w-4 h-4 text-sage-600" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-warm-900">Atur Rencana Bimbingan</h3>
                <p className="text-[11px] text-neutral-warm-400 mt-0.5">Lengkapi preferensi metode konseling, timezone, serta detail keluhan Anda.</p>
              </div>
            </div>

            {/* Step 1: Counseling Category */}
            <div>
              <label className="text-xs font-semibold text-neutral-warm-800 block mb-2.5">
                1. Pilih Kategori Layanan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {COUNSELING_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between h-28 cursor-pointer
                      ${selectedCategory === cat.id 
                        ? "border-sage-500 bg-sage-50/30 shadow-soft-sm" 
                        : "border-neutral-warm-200 hover:border-sage-200 bg-white"
                      }`}
                  >
                    <span className="text-[10px] font-mono text-neutral-warm-400">LAYANAN</span>
                    <div>
                      <h4 className="font-sans font-bold text-xs text-neutral-warm-900 leading-tight">{cat.name}</h4>
                      <p className="text-[11px] font-semibold text-sage-600 mt-1">{formatRupiah(cat.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-neutral-warm-500 italic mt-2.5 bg-sage-50/50 p-2.5 rounded-xl border border-sage-100/50">
                {activeCategoryDetail.description}
              </p>
            </div>

            {/* Step 2: Custom Interactive Month Calendar Grid */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-semibold text-neutral-warm-800">
                  2. Pilih Tanggal (Kalender {monthInfo.name})
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    disabled={currentMonthIndex === 6}
                    className="p-1 rounded-lg border border-sage-200 hover:bg-sage-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-neutral-warm-700" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    disabled={currentMonthIndex === 7}
                    className="p-1 rounded-lg border border-sage-200 hover:bg-sage-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-warm-700" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="bg-sage-50/50 rounded-2xl p-3 border border-sage-100">
                <div className="grid grid-cols-7 text-center text-[10px] font-mono text-neutral-warm-400 font-bold mb-2">
                  <span>MIN</span>
                  <span>SEN</span>
                  <span>SEL</span>
                  <span>RAB</span>
                  <span>KAM</span>
                  <span>JUM</span>
                  <span>SAB</span>
                </div>

                {/* Day values grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty offsets */}
                  {Array.from({ length: monthInfo.startOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-9"></div>
                  ))}

                  {/* Day numbers */}
                  {Array.from({ length: monthInfo.days }).map((_, i) => {
                    const dayNum = i + 1;
                    const isSelected = selectedDay === dayNum;
                    
                    // Simple constraint: disabled if in the past (today is July 16, 2026)
                    const isPast = currentMonthIndex === 6 && dayNum < 16;

                    return (
                      <button
                        key={`day-${dayNum}`}
                        type="button"
                        disabled={isPast}
                        onClick={() => setSelectedDay(dayNum)}
                        className={`h-9 w-full rounded-lg text-xs font-semibold transition-all flex items-center justify-center relative cursor-pointer
                          ${isPast 
                            ? "text-neutral-warm-300 bg-transparent cursor-not-allowed" 
                            : isSelected
                              ? "bg-sage-500 text-white shadow-soft-sm font-bold scale-105"
                              : "hover:bg-sage-50 text-neutral-warm-800 bg-white border border-neutral-warm-100"
                          }`}
                      >
                        <span>{dayNum}</span>
                        {!isPast && !isSelected && (
                          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-sage-300"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-[10px] text-neutral-warm-400 mt-2 flex items-center gap-1.5 px-1">
                <Info className="w-3.5 h-3.5 text-sage-500 shrink-0" />
                <span>Tanggal yang Anda pilih saat ini: <strong>{formatDateIndo(getSelectedFormattedDate())}</strong></span>
              </p>
            </div>

            {/* Step 3: Time Slot Grid & Timezone Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-warm-800 block mb-2">
                  3. Pilih Jam Yang Tersedia
                </label>
                <div className="space-y-1.5">
                  {AVAILABLE_SLOTS.map((slot) => {
                    const dateString = getSelectedFormattedDate();
                    const booked = isSlotBooked(dateString, slot);

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={booked}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer
                          ${booked 
                            ? "bg-neutral-warm-50 border-neutral-warm-200 text-neutral-warm-400 cursor-not-allowed line-through" 
                            : selectedTimeSlot === slot
                              ? "border-sage-500 bg-sage-50/50 font-bold text-sage-800"
                              : "border-neutral-warm-200 bg-white hover:border-sage-300 text-neutral-warm-700"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-sage-400" />
                          <span>{slot}</span>
                        </span>
                        <span>
                          {booked ? (
                            <span className="text-[9px] font-mono uppercase bg-neutral-warm-100 px-1.5 py-0.5 rounded text-neutral-warm-500">
                              Terisi
                            </span>
                          ) : selectedTimeSlot === slot ? (
                            <Check className="w-3.5 h-3.5 text-sage-600 font-bold" />
                          ) : (
                            <span className="text-[9px] font-mono text-sage-500">Tersedia</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-warm-800 block mb-2">
                  4. Pilih Zona Waktu (Timezone)
                </label>
                <div className="space-y-2">
                  {TIMEZONES.map((tz) => (
                    <button
                      key={tz.code}
                      type="button"
                      onClick={() => setSelectedTimezone(tz.code)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer
                        ${selectedTimezone === tz.code
                          ? "border-sage-500 bg-sage-50/30 font-bold text-sage-800"
                          : "border-neutral-warm-100 bg-white hover:border-sage-200 text-neutral-warm-700"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-sage-400" />
                        <span>{tz.name}</span>
                      </div>
                      {selectedTimezone === tz.code && (
                        <Check className="w-3.5 h-3.5 text-sage-600 font-bold" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Online vs Offline Selection */}
            <div className="bg-sage-50/30 p-4 rounded-2xl border border-sage-100/70 space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-warm-800 block mb-2">
                  5. Metode Pertemuan
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCounselingType("online")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5
                      ${counselingType === "online" 
                        ? "bg-sage-500 border-sage-500 text-white shadow-soft-sm" 
                        : "bg-white border-neutral-warm-200 text-neutral-warm-600 hover:bg-neutral-warm-50"
                      }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Konseling Online</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCounselingType("offline")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5
                      ${counselingType === "offline" 
                        ? "bg-sage-500 border-sage-500 text-white shadow-soft-sm" 
                        : "bg-white border-neutral-warm-200 text-neutral-warm-600 hover:bg-neutral-warm-50"
                      }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Konseling Offline (Tatap Muka)</span>
                  </button>
                </div>
              </div>

              {counselingType === "online" ? (
                <div className="p-3 bg-white rounded-xl border border-sage-100 space-y-2.5 animate-scale-up">
                  <label className="text-[11px] font-bold text-neutral-warm-700 block">
                    Pilih Platform Video Conference
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-medium text-neutral-warm-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="platform"
                        checked={meetingPlatform === "google-meet"}
                        onChange={() => setMeetingPlatform("google-meet")}
                        className="text-sage-600 focus:ring-sage-500"
                      />
                      <span>Google Meet (Otomatis Sync)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-neutral-warm-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="platform"
                        checked={meetingPlatform === "zoom"}
                        onChange={() => setMeetingPlatform("zoom")}
                        className="text-sage-600 focus:ring-sage-500"
                      />
                      <span>Zoom Conference Link</span>
                    </label>
                  </div>
                  <p className="text-[10px] text-neutral-warm-400 italic">
                    Tautan Google Meet / Zoom unik akan digenerate otomatis di database setelah status bimbingan terkonfirmasi oleh Admin & Lunas.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-sage-100 space-y-2.5 animate-scale-up">
                  <label className="text-[11px] font-bold text-neutral-warm-700 block">
                    Pilih Lokasi Klinik Praktik Mr Bi
                  </label>
                  <select
                    value={offlineLocation}
                    onChange={(e) => setOfflineLocation(e.target.value)}
                    className="input-field text-xs py-1.5"
                  >
                    <option value="Klinik Utama Harmoni Jiwa, Jakarta Selatan">Klinik Utama Harmoni Jiwa, Jakarta Selatan</option>
                    <option value="Ruko Menteng Square, Blok C2, Jakarta Pusat">Ruko Menteng Square, Blok C2, Jakarta Pusat</option>
                    <option value="Executive Counselor Room, Grand Indonesia Tower, Lt 34">Executive Counselor Room, Grand Indonesia Tower, Lt 34</option>
                  </select>
                  <p className="text-[10px] text-neutral-warm-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Mohon hadir 15 menit sebelum bimbingan dimulai di lokasi yang dipilih.</span>
                  </p>
                </div>
              )}
            </div>

            {/* Step 5: Confidential Notes */}
            <div>
              <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">
                6. Catatan Deskripsi Masalah (Rahasia / Confidential)
              </label>
              <textarea
                placeholder="Ceritakan gambaran singkat dinamika konflik, masalah emosi, atau harapan Anda mengikuti konseling psikologi ini agar Mr Bi dapat memetakan fokus penanganan lebih awal."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field min-h-[90px] text-xs resize-none leading-relaxed"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="border-t border-sage-100 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-sage-50/20 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] font-mono text-neutral-warm-400 uppercase tracking-wider block">Total Biaya Konseling</span>
                <p className="font-serif text-xl font-bold text-neutral-warm-900">{formatRupiah(activeCategoryDetail.price)}</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-accent w-full sm:w-auto px-8 py-2.5 text-xs font-bold cursor-pointer"
              >
                <span>{isSubmitting ? "Mendaftarkan Jadwal..." : "Daftarkan Jadwal & Bayar"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* RIGHT ADVISORY PANEL (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Advisory Info card */}
            <div className="bg-white p-6 rounded-3xl border border-sage-100 shadow-soft-sm text-center">
              <div className="w-12 h-12 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6 text-sage-600" />
              </div>
              <h4 className="font-serif text-sm font-bold text-neutral-warm-900">Privasi Klien Dijamin 100%</h4>
              <p className="text-xs text-neutral-warm-500 mt-2 leading-relaxed">
                Seluruh catatan emosi, identitas, percakapan selama sesi bimbingan psikologi bersama Mr Bi, M.Psi. dilindungi oleh sumpah Kode Etik Psikologi Indonesia.
              </p>
            </div>

            {/* Quick guide card */}
            <div className="bg-sage-900 text-ivory-100 p-6 rounded-3xl space-y-4">
              <span className="bg-white/10 text-ivory-100 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Alur Proses Booking
              </span>
              <div className="space-y-3">
                <div className="flex gap-3 text-xs">
                  <span className="font-mono font-bold text-sage-300">01</span>
                  <div>
                    <p className="font-bold">Pilih Jadwal & Metode</p>
                    <p className="text-ivory-300/80 text-[11px] mt-0.5">Tentukan tanggal, jam slot, timezone, serta Google Meet atau offline.</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="font-mono font-bold text-sage-300">02</span>
                  <div>
                    <p className="font-bold">Selesaikan Pembayaran</p>
                    <p className="text-ivory-300/80 text-[11px] mt-0.5">Lakukan simulasi pembayaran Midtrans aman dengan QRIS atau Virtual Account.</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="font-mono font-bold text-sage-300">03</span>
                  <div>
                    <p className="font-bold">Konfirmasi Admin & Notifikasi</p>
                    <p className="text-ivory-300/80 text-[11px] mt-0.5">Status jadwal berubah terkonfirmasi, link Google Meet aktif, dan email/WhatsApp pengingat dikirim.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE 2: INTERACTIVE CHECKOUT & MIDTRANS SIMULATOR STEP */}
      {checkoutBookingId && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-sage-100 shadow-soft-lg overflow-hidden animate-scale-up">
          <div className="bg-sage-900 text-white p-6 text-center space-y-1 relative">
            <h3 className="font-serif text-lg font-bold">Checkout Pembayaran Solusi Mr Bi</h3>
            <p className="text-xs text-sage-300">Selesaikan tagihan Anda untuk mengonfirmasi jadwal bimbingan secara otomatis</p>
            <span className="absolute top-4 right-4 bg-terracotta-500 text-[8px] font-bold font-mono px-2 py-0.5 rounded">
              SANDBOX MODE
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Booking Bill Details Summary */}
            <div className="bg-sage-50/50 p-4 rounded-2xl border border-sage-100 space-y-3">
              <h4 className="text-xs font-bold text-neutral-warm-800 uppercase tracking-wider">Detail Tagihan Layanan</h4>
              <div className="grid grid-cols-2 gap-y-2 text-xs text-neutral-warm-600">
                <span>Layanan Bimbingan:</span>
                <span className="font-bold text-right text-neutral-warm-900">
                  {COUNSELING_CATEGORIES.find((c) => c.id === activeCheckoutBooking.category)?.name}
                </span>

                <span>Tanggal & Waktu:</span>
                <span className="font-bold text-right text-neutral-warm-900">
                  {formatDateIndo(activeCheckoutBooking.date)} / {activeCheckoutBooking.timeSlot}
                </span>

                <span>Metode / Platform:</span>
                <span className="font-bold text-right text-neutral-warm-900 capitalize">
                  {activeCheckoutBooking.type} - {activeCheckoutBooking.platform?.replace("-", " ")}
                </span>

                <div className="col-span-2 border-t border-sage-200/50 my-2"></div>

                <span className="text-sm font-bold text-neutral-warm-800">Total Pembayaran:</span>
                <span className="text-base font-serif font-bold text-right text-sage-700">
                  {formatRupiah(COUNSELING_CATEGORIES.find((c) => c.id === activeCheckoutBooking.category)?.price || 0)}
                </span>
              </div>
            </div>

            {/* Select Simulated Payment Method */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-warm-800 block">Pilih Simulasi Metode Pembayaran</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("qris")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all
                    ${selectedPaymentMethod === "qris" ? "border-sage-500 bg-sage-50/20 shadow-soft-sm font-semibold text-sage-800" : "border-neutral-warm-200 hover:bg-neutral-warm-50"}`}
                >
                  <span className="text-xs">QRIS (GoPay / ShopeePay)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("va_bca")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all
                    ${selectedPaymentMethod === "va_bca" ? "border-sage-500 bg-sage-50/20 shadow-soft-sm font-semibold text-sage-800" : "border-neutral-warm-200 hover:bg-neutral-warm-50"}`}
                >
                  <span className="text-xs">BCA Virtual Account</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("va_mandiri")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all
                    ${selectedPaymentMethod === "va_mandiri" ? "border-sage-500 bg-sage-50/20 shadow-soft-sm font-semibold text-sage-800" : "border-neutral-warm-200 hover:bg-neutral-warm-50"}`}
                >
                  <span className="text-xs">Mandiri Bill Payment</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("cc")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all
                    ${selectedPaymentMethod === "cc" ? "border-sage-500 bg-sage-50/20 shadow-soft-sm font-semibold text-sage-800" : "border-neutral-warm-200 hover:bg-neutral-warm-50"}`}
                >
                  <span className="text-xs">Kartu Kredit / Debit</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-sage-100">
              <button
                type="button"
                onClick={() => setCheckoutBookingId(null)}
                className="btn-secondary text-xs flex-1 py-3"
              >
                Kembali & Reschedule
              </button>
              <button
                type="button"
                onClick={() => handleProcessPayment(activeCheckoutBooking.id)}
                disabled={isPaying}
                className="btn-primary text-xs flex-1 py-3 flex items-center justify-center gap-2 cursor-pointer bg-sage-600 hover:bg-sage-700"
              >
                {isPaying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Memproses Transaksi...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Konfirmasi Bayar Lunas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE 3: HISTORY LIST AND REMINDER / EMAIL SIMULATION */}
      {activeTab === "history" && (
        <div className="space-y-6">
          {/* Main layout: Split screen if previewing a booking's reminder, else full table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* BOOKINGS HISTORY TABLE / CARDS (7 Cols if preview open, 12 if none) */}
            <div className={`${previewBookingId ? "lg:col-span-6" : "lg:col-span-12"} space-y-4`}>
              <h3 className="font-serif text-lg font-bold text-neutral-warm-900 flex items-center gap-2">
                <History className="w-5 h-5 text-sage-600" />
                <span>Daftar Riwayat Bimbingan Anda</span>
              </h3>

              {bookings.filter((b) => b.clientId === currentUser?.id).length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-sage-100 text-center space-y-3">
                  <p className="text-xs text-neutral-warm-400 italic">Anda belum memiliki riwayat bimbingan terdaftar.</p>
                  <button 
                    onClick={() => setActiveTab("book")}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    Mulai Booking Sesi
                  </button>
                </div>
              ) : (
                bookings
                  .filter((b) => b.clientId === currentUser?.id)
                  .map((b) => {
                    const isDraft = b.status === "pending";
                    const isConfirmed = b.status === "confirmed";
                    const isCompleted = b.status === "completed";
                    const isCancelled = b.status === "cancelled";
                    const isPaid = b.paymentStatus === "paid";

                    const categoryDetail = COUNSELING_CATEGORIES.find((c) => c.id === b.category)!;

                    return (
                      <div 
                        key={b.id} 
                        className={`bg-white rounded-2xl p-5 border transition-all space-y-4 hover:shadow-soft-sm
                          ${previewBookingId === b.id 
                            ? "border-sage-500 ring-2 ring-sage-100" 
                            : "border-sage-100"}`}
                      >
                        {/* Session Top Badges Row */}
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <span className="bg-sage-50 text-sage-800 text-[10px] font-bold px-2 py-0.5 rounded font-sans uppercase">
                              {categoryDetail?.name}
                            </span>
                            <span className="text-[10px] text-neutral-warm-400 font-mono block mt-1">ID: {b.id}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {/* Payment Status Badge */}
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                              ${isPaid 
                                ? "bg-sage-100 text-sage-800" 
                                : b.paymentStatus === "failed" 
                                  ? "bg-terracotta-100 text-terracotta-800" 
                                  : "bg-amber-100 text-amber-800 animate-pulse"}`}
                            >
                              {isPaid ? "LUNAS" : "BELUM BAYAR"}
                            </span>

                            {/* Booking Status Badge */}
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                              ${isConfirmed 
                                ? "bg-sage-600 text-white" 
                                : isCompleted 
                                  ? "bg-neutral-warm-100 text-neutral-warm-700" 
                                  : isCancelled
                                    ? "bg-neutral-warm-200 text-neutral-warm-500"
                                    : "bg-terracotta-500 text-white"}`}
                            >
                              {isCancelled ? "BATAL" : b.status === "pending" ? "APPR. PENDING" : b.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Session details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-warm-600 border-t border-sage-50 pt-4">
                          <div className="space-y-1.5">
                            <p className="flex items-center gap-2">
                              <CalendarIcon className="w-3.5 h-3.5 text-sage-500 shrink-0" />
                              <strong className="text-neutral-warm-800">{formatDateIndo(b.date)}</strong>
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-sage-500 shrink-0" />
                              <span className="font-semibold text-neutral-warm-800">{b.timeSlot}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Globe className="w-3.5 h-3.5 text-sage-500 shrink-0" />
                              <span className="text-[10px] text-neutral-warm-500">{b.timezone || "Asia/Jakarta (WIB)"}</span>
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <p className="flex items-center gap-2">
                              {b.type === "online" ? <Video className="w-3.5 h-3.5 text-sage-500 shrink-0" /> : <MapPin className="w-3.5 h-3.5 text-sage-500 shrink-0" />}
                              <span className="capitalize font-semibold text-neutral-warm-800">Metode {b.type} ({b.platform?.replace("-", " ")})</span>
                            </p>
                            
                            {/* Render Google Meet / Zoom link or clinic location */}
                            {b.type === "online" && b.meetingLink ? (
                              isPaid ? (
                                <a 
                                  href={b.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sage-600 font-bold underline flex items-center gap-1 hover:text-sage-700 mt-1"
                                >
                                  <span>Masuk Link Ruangan Sesi</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <p className="text-[10px] text-terracotta-600 italic mt-1 font-semibold flex items-center gap-1">
                                  <Lock className="w-3 h-3" />
                                  <span>Link Terkunci (Selesaikan Pembayaran)</span>
                                </p>
                              )
                            ) : (
                              <p className="text-[10px] text-neutral-warm-500 font-medium">{b.address || "Ruko Menteng Square, Jakarta"}</p>
                            )}
                          </div>
                        </div>

                        {/* Notes excerpt */}
                        {b.notes && (
                          <div className="bg-sage-50/40 p-3 rounded-xl border border-sage-100 text-[11px] text-neutral-warm-600 italic">
                            " {b.notes} "
                          </div>
                        )}

                        {/* Action buttons for history list item */}
                        <div className="border-t border-sage-50 pt-3 flex flex-wrap gap-2 justify-between items-center">
                          <button
                            onClick={() => setPreviewBookingId(b.id)}
                            className="text-[11px] font-semibold text-sage-700 hover:text-sage-900 flex items-center gap-1 cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5 text-sage-600" />
                            <span>Lihat Template Reminder & Notifikasi</span>
                          </button>

                          <div className="flex gap-2">
                            {/* Cancel option */}
                            {(b.status === "pending" || b.status === "confirmed") && (
                              <button
                                onClick={() => {
                                  if (confirm("Apakah Anda yakin ingin membatalkan jadwal konseling ini?")) {
                                    updateBooking(b.id, { status: "cancelled" });
                                  }
                                }}
                                className="text-neutral-warm-400 hover:text-terracotta-600 text-[10px] font-semibold px-2.5 py-1 rounded-lg hover:bg-terracotta-50 transition-colors cursor-pointer"
                              >
                                Batalkan Sesi
                              </button>
                            )}

                            {/* Pay option if unpaid */}
                            {!isPaid && !isCancelled && (
                              <button
                                onClick={() => setCheckoutBookingId(b.id)}
                                className="bg-sage-500 hover:bg-sage-600 text-white font-bold text-[10px] px-3.5 py-1 rounded-lg shadow-soft-sm transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <CreditCard className="w-3 h-3" />
                                <span>Bayar Tagihan</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* NOTIFICATION & REMINDER PREVIEW DRAWER (6 Cols if open) */}
            {previewBookingId && activePreviewBooking && (
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-sage-100 shadow-soft-sm space-y-4 animate-scale-up">
                
                {/* Floating Notification success chimes */}
                {simulatedReminderLog && (
                  <div className="bg-sage-50 text-sage-800 border border-sage-200 text-xs font-semibold p-3.5 rounded-xl animate-fade-in flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sage-600 shrink-0" />
                    <span>{simulatedReminderLog}</span>
                  </div>
                )}

                {/* Sub-Header with Close button */}
                <div className="flex justify-between items-center border-b border-sage-50 pb-2.5">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-neutral-warm-900 flex items-center gap-1.5">
                      <Bell className="w-4.5 h-4.5 text-sage-600 animate-bounce" />
                      <span>Simulasi & Pratinjau Pengingat (Reminder)</span>
                    </h4>
                    <p className="text-[10px] text-neutral-warm-400 mt-0.5">Simulasikan pengiriman email otomatis atau WhatsApp pengingat untuk bimbingan ini.</p>
                  </div>
                  <button
                    onClick={() => {
                      setPreviewBookingId(null);
                      setSimulatedReminderLog(null);
                    }}
                    className="text-neutral-warm-400 hover:text-neutral-warm-700 font-bold text-xs p-1 rounded hover:bg-neutral-warm-50 cursor-pointer"
                    title="Tutup Panel Notifikasi"
                  >
                    × Tutup
                  </button>
                </div>

                {/* Simulated Trigger Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleTriggerNotification(activePreviewBooking.id, "email")}
                    className="border border-sage-200 hover:bg-sage-50 px-3 py-2 rounded-xl text-xs font-bold text-sage-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Kirim simulasi email konfirmasi invoice"
                  >
                    <Send className="w-3.5 h-3.5 text-sage-500" />
                    <span>Kirim Email Sesi</span>
                  </button>
                  <button
                    onClick={() => handleTriggerNotification(activePreviewBooking.id, "whatsapp")}
                    className="border border-sage-200 hover:bg-sage-50 px-3 py-2 rounded-xl text-xs font-bold text-sage-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Kirim SMS / WhatsApp reminder otomatis ke nomor handphone"
                  >
                    <Phone className="w-3.5 h-3.5 text-sage-500" />
                    <span>Kirim WA Reminder</span>
                  </button>
                </div>

                {/* Toggle Notification tabs preview */}
                <div className="flex border-b border-sage-100 gap-4 mt-2">
                  <button
                    onClick={() => setNotificationTab("email")}
                    className={`pb-2 text-xs font-semibold relative cursor-pointer
                      ${notificationTab === "email" ? "text-sage-800 border-b-2 border-sage-500 font-bold" : "text-neutral-warm-400 hover:text-neutral-warm-800"}`}
                  >
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Template Email Mandiri</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setNotificationTab("whatsapp")}
                    className={`pb-2 text-xs font-semibold relative cursor-pointer
                      ${notificationTab === "whatsapp" ? "text-sage-800 border-b-2 border-sage-500 font-bold" : "text-neutral-warm-400 hover:text-neutral-warm-800"}`}
                  >
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Template WhatsApp Reminder</span>
                    </span>
                  </button>
                </div>

                {/* TAB CONTENT A: EMAIL TEMPLATE HTML PREVIEW */}
                {notificationTab === "email" ? (
                  <div className="border border-sage-100 rounded-2xl bg-neutral-warm-50/50 overflow-hidden font-sans text-xs">
                    {/* Visual Email Client Header */}
                    <div className="bg-sage-900 text-white p-3.5 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-sage-300">Dari: admin@solusimrbi.com</p>
                        <p className="font-bold">Subjek: Konfirmasi Sesi & Invoice Bimbingan Psikologi - {COUNSELING_CATEGORIES.find((c) => c.id === activePreviewBooking.category)?.name}</p>
                      </div>
                      <span className="bg-white/10 text-[9px] font-mono px-2 py-0.5 rounded-md">SMTP Simulated</span>
                    </div>

                    {/* Email HTML Body content */}
                    <div className="p-5 space-y-4 bg-white text-neutral-warm-800 leading-relaxed">
                      <div className="flex justify-between items-center border-b border-sage-50 pb-3">
                        <span className="font-serif font-bold text-sage-800 text-sm">Solusi Mr Bi</span>
                        <span className="text-[10px] text-neutral-warm-400 font-mono">Invoice #{activePreviewBooking.id.substr(5)}</span>
                      </div>

                      <div className="space-y-1">
                        <p className="font-bold">Halo, {currentUser?.fullName || "Klien Terkasih"}!</p>
                        <p className="text-neutral-warm-600">
                          Jadwal bimbingan relasi Anda bersama <strong>Mr Bi, M.Psi.</strong> telah terdaftar. Berikut adalah rangkuman detail sesi pertemuan bimbingan:
                        </p>
                      </div>

                      {/* Summary box inside email */}
                      <div className="bg-sage-50/50 p-4 rounded-xl border border-sage-100 space-y-2 text-[11px]">
                        <p><strong>Layanan:</strong> {COUNSELING_CATEGORIES.find((c) => c.id === activePreviewBooking.category)?.name}</p>
                        <p><strong>Hari, Tanggal:</strong> {formatDateIndo(activePreviewBooking.date)}</p>
                        <p><strong>Waktu / Jam Sesi:</strong> {activePreviewBooking.timeSlot} ({activePreviewBooking.timezone || "WIB"})</p>
                        <p><strong>Metode Konseling:</strong> {activePreviewBooking.type === "online" ? "Online via Video Conference" : "Offline (Tatap Muka di Klinik)"}</p>
                        {activePreviewBooking.type === "online" && (
                          <p>
                            <strong>Video Conference Link: </strong>
                            {activePreviewBooking.paymentStatus === "paid" ? (
                              <a href={activePreviewBooking.meetingLink} target="_blank" rel="noopener noreferrer" className="text-sage-600 font-bold underline">
                                {activePreviewBooking.meetingLink}
                              </a>
                            ) : (
                              <span className="text-terracotta-600 italic">Tautan akan aktif otomatis setelah bimbingan dibayar lunas</span>
                            )}
                          </p>
                        )}
                        {activePreviewBooking.type === "offline" && (
                          <p><strong>Alamat Lokasi Klinik:</strong> {activePreviewBooking.address || "Klinik Utama Harmoni Jiwa, Jakarta Selatan"}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <p className="font-bold text-neutral-warm-900">Petunjuk Penting Sebelum Sesi:</p>
                        <ul className="list-disc list-inside space-y-1 text-neutral-warm-600 text-[11px]">
                          <li>Gunakan laptop atau tablet yang memiliki kamera & mikrofon aktif demi kualitas bimbingan.</li>
                          <li>Pastikan Anda dan pasangan berada di ruangan tertutup dan tenang (tidak bising) untuk kenyamanan bimbingan.</li>
                          <li>Tautan bimbingan dapat diakses 5 menit sebelum jam bimbingan dimulai.</li>
                        </ul>
                      </div>

                      <div className="border-t border-sage-50 pt-3 text-center text-[10px] text-neutral-warm-400">
                        <p>Butuh bantuan penjadwalan ulang? Hubungi WhatsApp Layanan Mr Bi di +62 812-3456-7890</p>
                        <p className="mt-1">© 2026 Solusi Mr Bi. All rights reserved.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* TAB CONTENT B: WHATSAPP SMS REMINDER TEXT PREVIEW */
                  <div className="border border-sage-100 rounded-2xl bg-neutral-warm-50/50 overflow-hidden font-sans text-xs">
                    {/* WhatsApp style header */}
                    <div className="bg-[#075E54] text-white p-3.5 flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-[#128C7E] flex items-center justify-center text-white font-bold">
                        B
                      </span>
                      <div>
                        <p className="font-bold">Layanan Solusi Mr Bi (Official)</p>
                        <p className="text-[10px] text-emerald-200">Online / Bisnis Terverifikasi</p>
                      </div>
                    </div>

                    {/* WhatsApp styled Chat bubble */}
                    <div className="p-4 bg-[#ECE5DD] space-y-3 min-h-[220px]">
                      <div className="bg-white p-3.5 rounded-r-xl rounded-bl-xl shadow-soft-sm max-w-[90%] text-neutral-warm-800 leading-normal space-y-2 relative">
                        <p className="text-[11px] font-semibold text-emerald-700">PENGINGAT OTOMATIS (CONFIRMED)</p>
                        
                        <p>
                          *Halo {currentUser?.fullName || "Klien Terkasih"}!* 👋
                        </p>
                        
                        <p>
                          Ini adalah pesan pengingat resmi dari *Solusi Mr Bi* untuk jadwal bimbingan psikologi terkonfirmasi Anda:
                        </p>

                        <div className="text-[11px] font-mono border-l-2 border-emerald-500 pl-2 text-neutral-warm-600 space-y-1 my-2">
                          <p>• Kategori: {COUNSELING_CATEGORIES.find((c) => c.id === activePreviewBooking.category)?.name}</p>
                          <p>• Hari/Tanggal: {formatDateIndo(activePreviewBooking.date)}</p>
                          <p>• Jam Sesi: {activePreviewBooking.timeSlot} ({activePreviewBooking.timezone || "WIB"})</p>
                          <p>• Metode: {activePreviewBooking.type === "online" ? `Online via ${activePreviewBooking.platform?.toUpperCase()}` : "Offline di Klinik"}</p>
                          {activePreviewBooking.type === "online" && activePreviewBooking.meetingLink && (
                            <p>• Ruangan Link: {activePreviewBooking.paymentStatus === "paid" ? activePreviewBooking.meetingLink : "(Belum Lunas)"}</p>
                          )}
                        </div>

                        <p>
                          Mohon persiapkan koneksi internet stabil & hadir tepat waktu. Sampai bertemu di sesi bimbingan bersama Mr Bi! 😊
                        </p>

                        <span className="text-[9px] text-neutral-warm-400 absolute bottom-1 right-2">
                          {new Date().toTimeString().split(" ")[0].substr(0, 5)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
