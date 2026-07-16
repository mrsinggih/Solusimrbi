import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, CounselingSession, ForumPost, PsychologyArticle, PremiumVideo, PremiumEbook, MembershipTier, PurchaseRecord } from "../types";
import { MOCK_VIDEOS, MOCK_EBOOKS } from "../constants";

interface AppStateContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  bookings: CounselingSession[];
  addBooking: (booking: Omit<CounselingSession, "id" | "createdAt">) => void;
  updateBookingStatus: (id: string, status: CounselingSession["status"]) => void;
  updateBooking: (id: string, updatedFields: Partial<CounselingSession>) => void;
  forumPosts: ForumPost[];
  addForumPost: (title: string, content: string, category: string, isPremium?: boolean) => void;
  addForumReply: (postId: string, content: string) => void;
  likeForumPost: (postId: string) => void;
  bookmarkForumPost: (postId: string) => void;
  reportForumPost: (postId: string, reason: string) => void;
  reportForumReply: (postId: string, replyId: string, reason: string) => void;
  pinForumPost: (postId: string) => void;
  hideForumPost: (postId: string) => void;
  deleteForumPost: (postId: string) => void;
  deleteForumReply: (postId: string, replyId: string) => void;
  editForumPost: (postId: string, title: string, content: string, category: string) => void;
  videos: PremiumVideo[];
  buyVideo: (id: string) => void;
  ebooks: PremiumEbook[];
  buyEbook: (id: string) => void;
  articles: PsychologyArticle[];
  addArticle: (article: Omit<PsychologyArticle, "id">) => void;
  updateArticle: (id: string, article: Partial<PsychologyArticle>) => void;
  deleteArticle: (id: string) => void;
  purchases: PurchaseRecord[];
  addPurchaseRecord: (record: Omit<PurchaseRecord, "id" | "createdAt">) => PurchaseRecord;
  upgradeMembership: (tier: MembershipTier) => void;
  webhooks: any[];
  addWebhook: (webhook: any) => void;
  clearWebhooks: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

const INITIAL_ARTICLES: PsychologyArticle[] = [
  {
    id: "art-1",
    title: "Mengapa Pertengkaran Kecil Bisa Menjadi Bom Waktu?",
    excerpt: "Memahami 'Kuda Penunggang Kiamat' dalam pernikahan menurut Dr. John Gottman dan solusinya.",
    content: "Di dalam dunia konseling pernikahan, terdapat konsep terkenal bernama 'The Four Horsemen' atau empat penunggang kuda kiamat pernikahan: Kritik (Criticism), Sikap Defensif (Defensiveness), Penghinaan (Contempt), dan Pembungkaman (Stonewalling). Mengabaikan pola pertengkaran kecil yang terus berulang tanpa merestorasi jembatan emosional dapat mengarah pada retaknya ikatan cinta.",
    category: "Pernikahan",
    author: "Mr Bi, M.Psi.",
    publishedAt: "2026-07-15",
    readTime: "5 Menit",
    coverUrl: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "art-2",
    title: "Seni Mendengarkan Bahasa Kalbu Pasangan",
    excerpt: "Komunikasi bukan tentang siapa yang menang, melainkan tentang rasa saling dipahami.",
    content: "Kesalahan terbesar dalam berpasangan adalah mendengarkan untuk menjawab, bukan mendengarkan untuk memahami. Lensa psikologi mengajarkan kita untuk melakukan mirroring aktif demi memvalidasi emosi pasangan secara tulus.",
    category: "Dinamika Cinta",
    author: "Mr Bi, M.Psi.",
    publishedAt: "2026-07-10",
    readTime: "4 Menit",
    coverUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "art-3",
    title: "Kesiapan Mental Finansial Menjelang Pranikah",
    excerpt: "Bagaimana cara menyatukan dua pola pikir keuangan yang bertolak belakang?",
    content: "Diskusi finansial sebelum pernikahan seringkali dianggap tabu, namun ketidakcocokan dalam gaya pengelolaan uang merupakan salah satu penyebab perceraian tertinggi. Konseling pranikah membantu menyelaraskan orientasi finansial.",
    category: "Seksologi",
    author: "Mr Bi, M.Psi.",
    publishedAt: "2026-07-01",
    readTime: "6 Menit",
    coverUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
    isPremium: true
  }
];

const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: "post-1",
    authorName: "KeluargaBahagia99",
    title: "Bagaimana cara meredam ego saat berselisih paham mengenai mertua?",
    content: "Saya dan suami baru menikah 8 bulan, belakangan kami sering bersitegang karena perbedaan pendapat cara menyikapi mertua yang terlalu ikut campur. Adakah tips dari kacamata psikologi?",
    category: "Mertua & Keluarga",
    likes: 12,
    createdAt: "2026-07-16T04:20:00Z",
    replies: [
      {
        id: "rep-1",
        authorName: "Mr Bi, M.Psi.",
        content: "Halo KeluargaBahagia99, sangat normal mengalami masa penyesuaian ini. Saling menyelaraskan batasan (boundaries) antara keluarga asal dan keluarga baru adalah tugas utama tahun pertama pernikahan. Mari bicarakan berdua dengan kepala dingin menggunakan 'I-statement' bukan menyalahkan.",
        createdAt: "2026-07-16T05:10:00Z"
      }
    ]
  },
  {
    id: "post-2",
    authorName: "Anto_VisiMisi",
    title: "Berapa bulan ideal untuk mengikuti bimbingan pranikah?",
    content: "Kami berencana melangsungkan akad pernikahan 6 bulan lagi. Apakah sudah waktu yang pas untuk mendaftar konseling pranikah Solusi Mr Bi?",
    category: "Persiapan Pranikah",
    likes: 8,
    createdAt: "2026-07-15T12:00:00Z",
    replies: []
  },
  {
    id: "post-3-premium",
    authorName: "Rani_Eksklusif",
    title: "Bagaimana menyembuhkan luka batin pasca perselingkuhan?",
    content: "Saya butuh bimbingan terarah tentang forgiveness therapy. Bagaimana cara menerima kenyataan pahit tanpa memendam dendam yang merusak masa depan anak? Apakah berhak saya mendapatkan kedamaian kembali?",
    category: "Terapi Pemulihan",
    likes: 18,
    createdAt: "2026-07-16T08:00:00Z",
    replies: [],
    isPremium: true
  }
];

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("solusi_mr_bi_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading user from localStorage:", e);
      }
    }
    return {
      id: "user-client-1",
      email: "clara.pasangan@gmail.com",
      fullName: "Clara Salsabila",
      role: "client",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      createdAt: "2026-01-10",
      membershipTier: "free",
      membershipExpiry: "never",
      membershipStatus: "active",
      phone: "+6281234567890"
    };
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("solusi_mr_bi_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("solusi_mr_bi_user");
    }
  }, [currentUser]);

  const [purchases, setPurchases] = useState<PurchaseRecord[]>(() => {
    const saved = localStorage.getItem("solusi_mr_bi_purchases");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading purchases:", e);
      }
    }
    return [
      {
        id: "trx-1",
        userId: "user-client-1",
        itemType: "video",
        itemId: "v1",
        itemName: "Mengurai Benang Kusut Komunikasi Pasutri",
        amount: 75000,
        paymentMethod: "QRIS",
        status: "success",
        createdAt: "2026-07-15T08:30:00Z",
        orderId: "ORDER-V1-92837"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("solusi_mr_bi_purchases", JSON.stringify(purchases));
  }, [purchases]);

  const [webhooks, setWebhooks] = useState<any[]>(() => {
    const saved = localStorage.getItem("solusi_mr_bi_webhooks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading webhooks:", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("solusi_mr_bi_webhooks", JSON.stringify(webhooks));
  }, [webhooks]);

  const addWebhook = (log: any) => {
    setWebhooks(prev => [log, ...prev]);
  };

  const clearWebhooks = () => {
    setWebhooks([]);
  };

  const [bookings, setBookings] = useState<CounselingSession[]>(() => {
    const saved = localStorage.getItem("solusi_mr_bi_bookings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading bookings from localStorage:", e);
      }
    }
    return [
      {
        id: "book-1",
        clientId: "user-client-1",
        category: "Pasangan",
        date: "2026-07-20",
        timeSlot: "14:00 - 15:00",
        notes: "Keluhan tentang pola komunikasi berulang yang kaku.",
        status: "confirmed",
        paymentStatus: "paid",
        createdAt: "2026-07-16",
        type: "online",
        platform: "google-meet",
        timezone: "Asia/Jakarta (WIB)",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        reminderSent: true,
        emailSent: true,
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("solusi_mr_bi_bookings", JSON.stringify(bookings));
  }, [bookings]);

  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem("solusi_mr_bi_forum_posts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading forum posts from localStorage:", e);
      }
    }
    return INITIAL_FORUM_POSTS;
  });

  useEffect(() => {
    localStorage.setItem("solusi_mr_bi_forum_posts", JSON.stringify(forumPosts));
  }, [forumPosts]);

  const [videos, setVideos] = useState<PremiumVideo[]>(MOCK_VIDEOS);
  const [ebooks, setEbooks] = useState<PremiumEbook[]>(MOCK_EBOOKS);
  const [articles, setArticles] = useState<PsychologyArticle[]>(() => {
    const saved = localStorage.getItem("solusi_mr_bi_articles");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading articles from localStorage:", e);
      }
    }
    return INITIAL_ARTICLES;
  });

  useEffect(() => {
    localStorage.setItem("solusi_mr_bi_articles", JSON.stringify(articles));
  }, [articles]);

  const addArticle = (newArticle: Omit<PsychologyArticle, "id">) => {
    const article: PsychologyArticle = {
      ...newArticle,
      id: `art-${Math.random().toString(36).substr(2, 9)}`,
    };
    setArticles((prev) => [article, ...prev]);
  };

  const updateArticle = (id: string, updatedFields: Partial<PsychologyArticle>) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, ...updatedFields } : art))
    );
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((art) => art.id !== id));
  };

  const addBooking = (newBooking: Omit<CounselingSession, "id" | "createdAt">) => {
    const session: CounselingSession = {
      ...newBooking,
      id: `book-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBookings((prev) => [session, ...prev]);
  };

  const updateBookingStatus = (id: string, status: CounselingSession["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const updateBooking = (id: string, updatedFields: Partial<CounselingSession>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
  };

  const addForumPost = (title: string, content: string, category: string, isPremium?: boolean) => {
    const newPost: ForumPost = {
      id: `post-${Math.random().toString(36).substr(2, 9)}`,
      authorName: currentUser?.fullName || "Anonim",
      title,
      content,
      category,
      likes: 0,
      createdAt: new Date().toISOString(),
      replies: [],
      isPremium: !!isPremium,
      likedBy: [],
      bookmarkedBy: [],
      isPinned: false,
      isHidden: false,
      reports: []
    };
    setForumPosts((prev) => [newPost, ...prev]);
  };

  const addForumReply = (postId: string, content: string) => {
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [
              ...(p.replies || []),
              {
                id: `rep-${Math.random().toString(36).substr(2, 9)}`,
                authorName: currentUser?.fullName || "Pengguna Anonim",
                content,
                createdAt: new Date().toISOString(),
                likedBy: [],
                reports: []
              },
            ],
          };
        }
        return p;
      })
    );
  };

  const likeForumPost = (postId: string) => {
    const userKey = currentUser?.fullName || "Anonim";
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const likedBy = p.likedBy || [];
          const isLiked = likedBy.includes(userKey);
          const newLikedBy = isLiked
            ? likedBy.filter((u) => u !== userKey)
            : [...likedBy, userKey];
          return {
            ...p,
            likedBy: newLikedBy,
            likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
          };
        }
        return p;
      })
    );
  };

  const bookmarkForumPost = (postId: string) => {
    const userKey = currentUser?.fullName || "Anonim";
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const bookmarkedBy = p.bookmarkedBy || [];
          const isBookmarked = bookmarkedBy.includes(userKey);
          const newBookmarkedBy = isBookmarked
            ? bookmarkedBy.filter((u) => u !== userKey)
            : [...bookmarkedBy, userKey];
          return {
            ...p,
            bookmarkedBy: newBookmarkedBy,
          };
        }
        return p;
      })
    );
  };

  const reportForumPost = (postId: string, reason: string) => {
    const userKey = currentUser?.fullName || "Anonim";
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const reports = p.reports || [];
          if (reports.some((r) => r.authorName === userKey)) return p;
          const newReport = {
            id: `rep-post-${Math.random().toString(36).substr(2, 5)}`,
            authorName: userKey,
            reason,
            createdAt: new Date().toISOString(),
          };
          return {
            ...p,
            reports: [...reports, newReport],
          };
        }
        return p;
      })
    );
  };

  const reportForumReply = (postId: string, replyId: string, reason: string) => {
    const userKey = currentUser?.fullName || "Anonim";
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updatedReplies = (p.replies || []).map((r) => {
            if (r.id === replyId) {
              const reports = r.reports || [];
              if (reports.some((rep) => rep.authorName === userKey)) return r;
              const newReport = {
                id: `rep-reply-${Math.random().toString(36).substr(2, 5)}`,
                authorName: userKey,
                reason,
                createdAt: new Date().toISOString(),
              };
              return {
                ...r,
                reports: [...reports, newReport],
              };
            }
            return r;
          });
          return {
            ...p,
            replies: updatedReplies,
          };
        }
        return p;
      })
    );
  };

  const pinForumPost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isPinned: !p.isPinned } : p))
    );
  };

  const hideForumPost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isHidden: !p.isHidden } : p))
    );
  };

  const deleteForumPost = (postId: string) => {
    setForumPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const deleteForumReply = (postId: string, replyId: string) => {
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: (p.replies || []).filter((r) => r.id !== replyId),
          };
        }
        return p;
      })
    );
  };

  const editForumPost = (postId: string, title: string, content: string, category: string) => {
    setForumPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, title, content, category } : p
      )
    );
  };

  const buyVideo = (id: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isUnlocked: true } : v))
    );
  };

  const buyEbook = (id: string) => {
    setEbooks((prev) =>
      prev.map((eb) => (eb.id === id ? { ...eb, isUnlocked: true } : eb))
    );
  };

  const addPurchaseRecord = (newRec: Omit<PurchaseRecord, "id" | "createdAt">) => {
    const record: PurchaseRecord = {
      ...newRec,
      id: `trx-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setPurchases(prev => [record, ...prev]);
    return record;
  };

  const upgradeMembership = (tier: MembershipTier) => {
    if (!currentUser) return;
    const expiry = tier === "lifetime" ? "never" : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    setCurrentUser(prev => prev ? {
      ...prev,
      membershipTier: tier,
      membershipExpiry: expiry,
      membershipStatus: "active"
    } : null);
  };

  return (
    <AppStateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        bookings,
        addBooking,
        updateBookingStatus,
        updateBooking,
        forumPosts,
        addForumPost,
        addForumReply,
        likeForumPost,
        bookmarkForumPost,
        reportForumPost,
        reportForumReply,
        pinForumPost,
        hideForumPost,
        deleteForumPost,
        deleteForumReply,
        editForumPost,
        videos,
        buyVideo,
        ebooks,
        buyEbook,
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        purchases,
        addPurchaseRecord,
        upgradeMembership,
        webhooks,
        addWebhook,
        clearWebhooks,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
};
