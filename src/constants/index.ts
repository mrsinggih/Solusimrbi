import { CounselingCategory } from "../types";

export const BRAND_NAME = "Solusi Mr Bi";
export const BRAND_TAGLINE = "Memahami makna terdalam dari pernikahan dan dinamika cinta melalui lensa psikologi.";

export const COUNSELING_CATEGORIES: { id: CounselingCategory; name: string; description: string; price: number }[] = [
  {
    id: "Pernikahan",
    name: "Konseling Pernikahan",
    description: "Pendampingan khusus pasangan suami istri untuk menyelaraskan harapan, memulihkan luka batin, dan merekonstruksi komitmen pernikahan.",
    price: 350000,
  },
  {
    id: "Pasangan",
    name: "Konseling Pasangan",
    description: "Resolusi konflik pacaran atau tunangan, mengenali pola komunikasi disfungsional, dan memperkuat keintiman relasi.",
    price: 250000,
  },
  {
    id: "Pranikah",
    name: "Konseling Pranikah",
    description: "Bimbingan kesiapan psikologis, finansial, dan visi misi keluarga baru sebelum melangkah ke jenjang ikatan suci pernikahan.",
    price: 300000,
  },
];

export const TIME_SLOTS = [
  "09:00 - 10:00 WIB",
  "11:00 - 12:00 WIB",
  "14:00 - 15:00 WIB",
  "16:00 - 17:00 WIB",
  "19:30 - 20:30 WIB"
];

export const MOCK_VIDEOS = [
  {
    id: "v1",
    title: "Mengurai Benang Kusut Komunikasi Pasutri",
    description: "Langkah taktis mendengarkan secara aktif dan mengekspresikan kebutuhan tanpa memicu defensif pasangan.",
    duration: "45 Menit",
    thumbnailUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=400",
    videoUrl: "#",
    isUnlocked: false,
    price: 75000,
  },
  {
    id: "v2",
    title: "Membangun Kembali Kepercayaan Pasca Pengkhianatan",
    description: "Panduan psikologis terstruktur untuk memulihkan luka hati yang mendalam demi komitmen baru.",
    duration: "60 Menit",
    thumbnailUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400",
    videoUrl: "#",
    isUnlocked: false,
    price: 99000,
  }
];

export const MOCK_EBOOKS = [
  {
    id: "eb1",
    title: "Seni Mencintai Tanpa Kehilangan Jati Diri",
    author: "Mr Bi, M.Psi.",
    description: "Menghindari codependency dalam hubungan pernikahan agar cinta bertumbuh secara sehat dan dewasa.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    price: 49000,
    isUnlocked: false,
  },
  {
    id: "eb2",
    title: "Visi Pranikah: Lebih Dari Sekadar Resepsi",
    author: "Mr Bi, M.Psi.",
    description: "Pertanyaan-pertanyaan krusial bimbingan kesiapan mental pengantin baru sebelum mengucapkan janji suci.",
    coverUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400",
    price: 59000,
    isUnlocked: false,
  }
];
