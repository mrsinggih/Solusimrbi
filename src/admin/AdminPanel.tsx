import React, { useState } from "react";
import { useAppState } from "../store";
import { formatDateIndo, formatRupiah } from "../utils/formatter";
import { 
  Calendar, 
  ShieldAlert, 
  Check, 
  BookOpen, 
  Clock, 
  Trash2, 
  Edit3, 
  X, 
  CheckCircle, 
  Video, 
  MapPin, 
  CreditCard, 
  Globe, 
  Mail, 
  Bell, 
  ExternalLink,
  Save,
  AlertTriangle
} from "lucide-react";
import { ArticleCMS } from "./ArticleCMS";

export const AdminPanel: React.FC = () => {
  const { bookings, updateBookingStatus, updateBooking, articles } = useAppState();
  const [subTab, setSubTab] = useState<"bookings" | "articles">("bookings");

  // Editing state for rescheduling / modifying sessions
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTimeSlot, setEditTimeSlot] = useState("");
  const [editTimezone, setEditTimezone] = useState("");
  const [editType, setEditType] = useState<"online" | "offline">("online");
  const [editPlatform, setEditPlatform] = useState<"google-meet" | "zoom" | "offline-location">("google-meet");
  const [editMeetingLink, setEditMeetingLink] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState<"unpaid" | "paid" | "failed">("unpaid");

  // Notifications status log
  const [statusLog, setStatusLog] = useState<{ [bookingId: string]: string }>({});

  const handleApprove = (id: string) => {
    updateBookingStatus(id, "confirmed");
    showStatusMessage(id, "Sesi disetujui, email konfirmasi dikirim otomatis.");
  };

  const handleComplete = (id: string) => {
    updateBookingStatus(id, "completed");
    showStatusMessage(id, "Sesi berhasil diselesaikan.");
  };

  const handleCancel = (id: string) => {
    updateBookingStatus(id, "cancelled");
    showStatusMessage(id, "Sesi berhasil dibatalkan.");
  };

  const showStatusMessage = (bookingId: string, msg: string) => {
    setStatusLog((prev) => ({ ...prev, [bookingId]: msg }));
    setTimeout(() => {
      setStatusLog((prev) => {
        const copy = { ...prev };
        delete copy[bookingId];
        return copy;
      });
    }, 4000);
  };

  const startEdit = (b: any) => {
    setEditingId(b.id);
    setEditDate(b.date);
    setEditTimeSlot(b.timeSlot.split(" ")[0] || "14:00 - 15:00");
    setEditTimezone(b.timezone || "Asia/Jakarta (WIB)");
    setEditType(b.type || "online");
    setEditPlatform(b.platform || "google-meet");
    setEditMeetingLink(b.meetingLink || "");
    setEditAddress(b.address || "");
    setEditPaymentStatus(b.paymentStatus);
  };

  const saveEdit = (id: string) => {
    updateBooking(id, {
      date: editDate,
      timeSlot: `${editTimeSlot} ${editTimezone.includes("WIB") ? "WIB" : editTimezone.includes("WITA") ? "WITA" : "WIT"}`,
      timezone: editTimezone,
      type: editType,
      platform: editType === "online" ? editPlatform : "offline-location",
      meetingLink: editType === "online" ? editMeetingLink : undefined,
      address: editType === "offline" ? editAddress : undefined,
      paymentStatus: editPaymentStatus
    });
    setEditingId(null);
    showStatusMessage(id, "Detail jadwal bimbingan berhasil diperbarui!");
  };

  // Simulators inside admin
  const triggerEmailSimulation = async (id: string) => {
    setStatusLog((prev) => ({ ...prev, [id]: "Menyiapkan server mail..." }));
    await new Promise((resolve) => setTimeout(resolve, 800));
    updateBooking(id, { emailSent: true });
    showStatusMessage(id, "Email konfirmasi & invoice bimbingan berhasil dikirim ulang ke klien!");
  };

  const triggerWASimulation = async (id: string) => {
    setStatusLog((prev) => ({ ...prev, [id]: "Mengirim payload WhatsApp..." }));
    await new Promise((resolve) => setTimeout(resolve, 800));
    updateBooking(id, { reminderSent: true });
    showStatusMessage(id, "WhatsApp reminder otomatis sukses dikirim ke handphone klien!");
  };

  const togglePaymentStatus = (id: string, current: string) => {
    const nextStatus = current === "paid" ? "unpaid" : "paid";
    updateBooking(id, { paymentStatus: nextStatus });
    showStatusMessage(id, `Status pembayaran diubah menjadi ${nextStatus.toUpperCase()}`);
  };

  const totalArticles = articles.length;
  const draftArticles = articles.filter((a) => a.status === "draft").length;
  const publishedArticles = totalArticles - draftArticles;

  return (
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* Intro Admin */}
      <div className="bg-sage-900 text-ivory-100 rounded-3xl p-8 border border-sage-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-soft-lg">
        <div>
          <span className="text-[10px] font-mono text-sage-400 tracking-wider uppercase font-bold">Admin Management Panel</span>
          <h2 className="font-serif text-2xl text-ivory-50 mt-1">Sistem Kontrol Konseling Mr Bi</h2>
          <p className="font-sans text-xs text-sage-300 mt-1">Gunakan panel otorisasi khusus ini untuk verifikasi transaksi Midtrans manual, persetujuan jadwal, serta tinjauan bimbingan.</p>
        </div>
        <div className="bg-sage-800 px-4 py-2 rounded-xl border border-sage-700 flex items-center gap-2 text-xs">
          <ShieldAlert className="w-5 h-5 text-terracotta-400" />
          <span className="text-sage-200 font-medium">Otoritas Super Admin Aktif</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-sage-200/50 pb-px gap-4">
        <button
          onClick={() => setSubTab("bookings")}
          className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer
            ${subTab === "bookings" 
              ? "text-sage-800 border-b-2 border-sage-500 font-bold" 
              : "text-neutral-warm-500 hover:text-neutral-warm-800"}`}
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Verifikasi & Kontrol Konseling</span>
            <span className="bg-terracotta-100 text-terracotta-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {bookings.filter((b) => b.status === "pending").length} Pending
            </span>
          </span>
        </button>
        <button
          onClick={() => setSubTab("articles")}
          className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer
            ${subTab === "articles" 
              ? "text-sage-800 border-b-2 border-sage-500 font-bold" 
              : "text-neutral-warm-500 hover:text-neutral-warm-800"}`}
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>CMS Artikel Psikologi</span>
            <span className="bg-sage-100 text-sage-800 text-[10px] px-2 py-0.5 rounded-full font-sans">
              {publishedArticles} Live
            </span>
          </span>
        </button>
      </div>

      {subTab === "bookings" ? (
        <>
          {/* Analytics Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-sage-100 shadow-soft-sm">
              <span className="text-xs text-neutral-warm-500 font-sans block">Total Bookings Masuk</span>
              <span className="font-serif text-2xl font-bold text-neutral-warm-900 block mt-1">{bookings.length} Sesi</span>
              <span className="text-[9px] font-mono text-sage-500 block mt-0.5">Bimbingan Aktif & Terjadwal</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sage-100 shadow-soft-sm">
              <span className="text-xs text-neutral-warm-500 font-sans block">Persetujuan Pending</span>
              <span className="font-serif text-2xl font-bold text-terracotta-600 block mt-1">
                {bookings.filter((b) => b.status === "pending").length} Sesi
              </span>
              <span className="text-[9px] font-mono text-terracotta-500 block mt-0.5">Membutuhkan Verifikasi</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sage-100 shadow-soft-sm">
              <span className="text-xs text-neutral-warm-500 font-sans block">Konfirmasi Terjadwal</span>
              <span className="font-serif text-2xl font-bold text-sage-600 block mt-1">
                {bookings.filter((b) => b.status === "confirmed").length} Sesi
              </span>
              <span className="text-[9px] font-mono text-sage-500 block mt-0.5">Aktif Menunggu Jam Mulai</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sage-100 shadow-soft-sm">
              <span className="text-xs text-neutral-warm-500 font-sans block">Pembayaran Lunas</span>
              <span className="font-serif text-2xl font-bold text-emerald-600 block mt-1">
                {bookings.filter((b) => b.paymentStatus === "paid").length} Transaksi
              </span>
              <span className="text-[9px] font-mono text-emerald-500 block mt-0.5">Omset Terverifikasi Midtrans</span>
            </div>
          </div>

          {/* Bookings Verifier Table / Advanced Control list */}
          <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-soft-sm space-y-6">
            <div className="flex justify-between items-center border-b border-sage-50 pb-4">
              <h3 className="font-serif text-lg text-neutral-warm-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sage-600" />
                <span>Manajemen Verifikasi Konseling Pasangan & Pranikah</span>
              </h3>
              <p className="text-[10px] font-mono text-neutral-warm-400">Total Data: {bookings.length} baris</p>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-neutral-warm-500 italic text-center py-6">Belum ada booking terdaftar untuk dikelola.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => {
                  const isEditing = editingId === b.id;
                  const hasLog = statusLog[b.id];

                  return (
                    <div 
                      key={b.id} 
                      className={`p-5 rounded-2xl border transition-all space-y-4
                        ${isEditing ? "border-sage-500 bg-sage-50/10 shadow-soft-md" : "border-sage-100 bg-white hover:shadow-soft-sm"}`}
                    >
                      {/* Booking Item Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-sage-50 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-neutral-warm-700 bg-neutral-warm-50 px-2 py-0.5 rounded border">
                            ID: {b.id}
                          </span>
                          <span className="bg-sage-50 text-sage-800 text-[10px] font-bold px-2 py-0.5 rounded font-sans uppercase">
                            {b.category}
                          </span>
                          <span className="text-[11px] text-neutral-warm-400 font-sans">Klien ID: <strong>{b.clientId}</strong></span>
                        </div>

                        {/* Status badges */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => togglePaymentStatus(b.id, b.paymentStatus)}
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all hover:scale-105 cursor-pointer
                              ${b.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                            title="Klik untuk ubah status pembayaran klien"
                          >
                            {b.paymentStatus === "paid" ? "💳 Lunas / Paid" : "💳 Unpaid / Unverified"}
                          </button>

                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase
                            ${b.status === "confirmed" ? "bg-sage-600 text-white" : ""}
                            ${b.status === "pending" ? "bg-terracotta-500 text-white animate-pulse" : ""}
                            ${b.status === "completed" ? "bg-neutral-warm-100 text-neutral-warm-700" : ""}
                            ${b.status === "cancelled" ? "bg-neutral-warm-200 text-neutral-warm-500" : ""}`}
                          >
                            {b.status === "pending" ? "⚠️ PENDING APPROVAL" : `● ${b.status.toUpperCase()}`}
                          </span>
                        </div>
                      </div>

                      {/* Log notice overlay */}
                      {hasLog && (
                        <div className="bg-sage-50 text-sage-800 text-[11px] font-bold p-2.5 rounded-xl border border-sage-200 animate-scale-up flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-sage-600 shrink-0" />
                          <span>{hasLog}</span>
                        </div>
                      )}

                      {/* EDIT MODE (Inline rescheduler) */}
                      {isEditing ? (
                        <div className="bg-white p-4 rounded-xl border border-sage-200 space-y-4 animate-scale-up">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-sage-800 border-b pb-2">
                            <Edit3 className="w-4 h-4" />
                            <span>Reschedule & Edit Jadwal Sesi</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block text-[11px] font-bold text-neutral-warm-600 mb-1">Tanggal Sesi</label>
                              <input 
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                                className="input-field py-1"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-neutral-warm-600 mb-1">Jam Slot (Waktu)</label>
                              <input 
                                type="text"
                                value={editTimeSlot}
                                placeholder="E.g., 14:00 - 15:00"
                                onChange={(e) => setEditTimeSlot(e.target.value)}
                                className="input-field py-1"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-neutral-warm-600 mb-1">Timezone</label>
                              <select 
                                value={editTimezone}
                                onChange={(e) => setEditTimezone(e.target.value)}
                                className="input-field py-1"
                              >
                                <option value="Asia/Jakarta (WIB)">Asia/Jakarta (WIB)</option>
                                <option value="Asia/Makassar (WITA)">Asia/Makassar (WITA)</option>
                                <option value="Asia/Jayapura (WIT)">Asia/Jayapura (WIT)</option>
                                <option value="UTC / GMT">UTC / GMT</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block text-[11px] font-bold text-neutral-warm-600 mb-1">Metode Sesi</label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditType("online")}
                                  className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer
                                    ${editType === "online" ? "bg-sage-500 border-sage-500 text-white" : "bg-white border-neutral-warm-200 text-neutral-warm-600"}`}
                                >
                                  Online
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditType("offline")}
                                  className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer
                                    ${editType === "offline" ? "bg-sage-500 border-sage-500 text-white" : "bg-white border-neutral-warm-200 text-neutral-warm-600"}`}
                                >
                                  Offline
                                </button>
                              </div>
                            </div>

                            {editType === "online" ? (
                              <>
                                <div>
                                  <label className="block text-[11px] font-bold text-neutral-warm-600 mb-1">Platform Video</label>
                                  <select
                                    value={editPlatform}
                                    onChange={(e: any) => setEditPlatform(e.target.value)}
                                    className="input-field py-1"
                                  >
                                    <option value="google-meet">Google Meet</option>
                                    <option value="zoom">Zoom</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-neutral-warm-600 mb-1">Custom Link Rapat Sesi</label>
                                  <input 
                                    type="text"
                                    value={editMeetingLink}
                                    onChange={(e) => setEditMeetingLink(e.target.value)}
                                    placeholder="https://meet.google.com/..."
                                    className="input-field py-1"
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="col-span-2">
                                <label className="block text-[11px] font-bold text-neutral-warm-600 mb-1">Alamat Klinik Tatap Muka</label>
                                <input 
                                  type="text"
                                  value={editAddress}
                                  onChange={(e) => setEditAddress(e.target.value)}
                                  className="input-field py-1"
                                />
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[11px] font-bold text-neutral-warm-600 mb-1">Status Pembayaran</label>
                              <select
                                value={editPaymentStatus}
                                onChange={(e: any) => setEditPaymentStatus(e.target.value)}
                                className="input-field py-1"
                              >
                                <option value="unpaid">Belum Dibayar (Unpaid)</option>
                                <option value="paid">Sudah Dibayar (Paid)</option>
                                <option value="failed">Gagal / Failed</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-3 border-t">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 border border-neutral-warm-200 text-neutral-warm-700 rounded-xl text-xs font-semibold hover:bg-neutral-warm-50 cursor-pointer"
                            >
                              Tutup Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => saveEdit(b.id)}
                              className="px-4 py-1.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Simpan Reschedule</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* VIEW MODE DETAILS */
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-warm-600">
                          {/* Col 1: Date & Time */}
                          <div className="space-y-1.5">
                            <p className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-sage-500" />
                              <strong>{formatDateIndo(b.date)}</strong>
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-sage-500" />
                              <span>{b.timeSlot}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Globe className="w-3.5 h-3.5 text-sage-500" />
                              <span className="text-[10px] text-neutral-warm-400">{b.timezone || "Asia/Jakarta (WIB)"}</span>
                            </p>
                          </div>

                          {/* Col 2: Methods & Links */}
                          <div className="space-y-1.5">
                            <p className="flex items-center gap-2">
                              {b.type === "online" ? <Video className="w-3.5 h-3.5 text-sage-500" /> : <MapPin className="w-3.5 h-3.5 text-sage-500" />}
                              <span className="capitalize font-semibold text-neutral-warm-800">
                                Metode {b.type} ({b.platform?.replace("-", " ")})
                              </span>
                            </p>
                            {b.type === "online" && b.meetingLink ? (
                              <a 
                                href={b.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sage-600 hover:text-sage-700 flex items-center gap-1 font-bold underline text-[11px]"
                              >
                                <span>Buka Meeting Sesi</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <p className="text-[10px] text-neutral-warm-400 max-w-xs truncate">{b.address || "Tidak ada lokasi offline"}</p>
                            )}
                          </div>

                          {/* Col 3: Client Info & Notes */}
                          <div className="space-y-1 bg-sage-50/50 p-3 rounded-xl border border-sage-100 italic">
                            <span className="text-[9px] font-mono font-bold text-neutral-warm-400 block not-italic uppercase">Catatan Masalah Klien:</span>
                            <p className="text-[11px] text-neutral-warm-600 line-clamp-3">"{b.notes || "Tidak ada catatan keluhan."}"</p>
                          </div>
                        </div>
                      )}

                      {/* Notification details badges & Actions */}
                      {!isEditing && (
                        <div className="border-t border-sage-50 pt-3.5 flex flex-wrap justify-between items-center gap-4">
                          {/* Notification delivery indicators */}
                          <div className="flex gap-4 text-[10px] text-neutral-warm-500">
                            <span className="flex items-center gap-1.5">
                              <Mail className={`w-3.5 h-3.5 ${b.emailSent ? "text-sage-600" : "text-neutral-warm-300"}`} />
                              <span>Email: {b.emailSent ? "Terkirim ✓" : "Belum terkirim"}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Bell className={`w-3.5 h-3.5 ${b.reminderSent ? "text-sage-600" : "text-neutral-warm-300"}`} />
                              <span>WhatsApp: {b.reminderSent ? "Terkirim ✓" : "Belum terkirim"}</span>
                            </span>
                          </div>

                          {/* Action Button Controls */}
                          <div className="flex flex-wrap gap-2">
                            {/* Simulator Buttons */}
                            <button
                              onClick={() => triggerEmailSimulation(b.id)}
                              className="px-2.5 py-1 border border-sage-200 hover:bg-sage-50 text-[10px] font-bold text-sage-700 rounded-lg cursor-pointer flex items-center gap-1"
                              title="Simulasikan kirim email invoice ke klien"
                            >
                              <Mail className="w-3 h-3 text-sage-600" />
                              <span>Simulasi Kirim Email</span>
                            </button>
                            <button
                              onClick={() => triggerWASimulation(b.id)}
                              className="px-2.5 py-1 border border-sage-200 hover:bg-sage-50 text-[10px] font-bold text-sage-700 rounded-lg cursor-pointer flex items-center gap-1"
                              title="Simulasikan kirim pesan WhatsApp pengingat otomatis"
                            >
                              <Bell className="w-3 h-3 text-sage-600" />
                              <span>Simulasi Kirim WhatsApp</span>
                            </button>

                            <div className="w-px h-5 bg-sage-200 self-center"></div>

                            {/* Reschedule Button */}
                            <button
                              onClick={() => startEdit(b)}
                              className="px-3 py-1 bg-white hover:bg-sage-50 border border-sage-300 text-sage-700 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3 text-sage-600" />
                              <span>Reschedule / Edit</span>
                            </button>

                            {/* Approval Actions */}
                            {b.status === "pending" && (
                              <button
                                onClick={() => handleApprove(b.id)}
                                className="px-3 py-1 bg-sage-500 hover:bg-sage-600 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-soft-sm"
                              >
                                <Check className="w-3 h-3" />
                                <span>Setujui Jadwal</span>
                              </button>
                            )}

                            {b.status === "confirmed" && (
                              <button
                                onClick={() => handleComplete(b.id)}
                                className="px-3 py-1 bg-sage-700 hover:bg-sage-800 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Selesaikan Sesi</span>
                              </button>
                            )}

                            {/* Cancel session */}
                            {b.status !== "cancelled" && b.status !== "completed" && (
                              <button
                                onClick={() => {
                                  if (confirm("Apakah Anda yakin ingin membatalkan jadwal ini?")) {
                                    handleCancel(b.id);
                                  }
                                }}
                                className="px-2 py-1 hover:bg-terracotta-50 text-terracotta-600 rounded-lg text-[10px] font-semibold cursor-pointer"
                              >
                                Batal Sesi
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-soft-sm">
          <ArticleCMS />
        </div>
      )}
    </div>
  );
};
