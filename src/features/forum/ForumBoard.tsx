import React, { useState, useRef, useEffect } from "react";
import { useAppState } from "../../store";
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  AlertCircle, 
  Lock, 
  Sparkles,
  Pin,
  Bookmark,
  AlertTriangle,
  Shield,
  Search,
  TrendingUp,
  Plus,
  ArrowLeft,
  Trash2,
  Check,
  X,
  ShieldAlert,
  Edit,
  User,
  Tag,
  Eye,
  EyeOff,
  MessageCircle,
  Flag,
  Share2,
  ChevronRight,
  Sparkle
} from "lucide-react";
import { formatDateIndo } from "../../utils/formatter";
import { ForumPost, ForumReply } from "../../types";

const COMMUNITY_USERS = [
  "Clara Salsabila",
  "Mr Bi, M.Psi.",
  "KeluargaBahagia99",
  "Anto_VisiMisi",
  "Rani_Eksklusif",
  "Budi_Harmoni",
  "Siti_Konseling",
  "Dewi_Asih",
  "Andi_Setiawan",
  "Linda_Harmonis"
];

const TRENDING_TAGS = [
  "#KomunikasiMacet",
  "#MertuaIkutCampur",
  "#PranikahMental",
  "#SeksualitasSehat",
  "#ForgivenessTherapy",
  "#ManajemenKonflik",
  "#EgoPasangan"
];

const CATEGORIES = [
  "Semua Topik",
  "Hubungan Suami Istri",
  "Mertua & Keluarga",
  "Persiapan Pranikah",
  "Keintiman Seksualitas",
  "Manajemen Konflik",
  "Terapi Pemulihan"
];

export const ForumBoard: React.FC = () => {
  const { 
    forumPosts, 
    addForumPost, 
    addForumReply, 
    currentUser,
    likeForumPost,
    bookmarkForumPost,
    reportForumPost,
    reportForumReply,
    pinForumPost,
    hideForumPost,
    deleteForumPost,
    deleteForumReply,
    editForumPost
  } = useAppState();

  const [activeCategory, setActiveCategory] = useState("Semua Topik");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [gatedPostAlert, setGatedPostAlert] = useState<any | null>(null);

  const activePost = forumPosts.find((p) => p.id === activePostId);
  
  // Create Post States
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Hubungan Suami Istri");
  const [isPremiumPost, setIsPremiumPost] = useState(false);
  
  // Mention Suggestion States
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [mentionTargetInput, setMentionTargetInput] = useState<"post" | "reply" | null>(null);
  const [mentionIndex, setMentionIndex] = useState(-1);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const postContentRef = useRef<HTMLTextAreaElement>(null);

  // Edit Post States
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Report States
  const [reportingPost, setReportingPost] = useState<ForumPost | null>(null);
  const [reportingReply, setReportingReply] = useState<{ postId: string; replyId: string } | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportSuccessMessage, setReportSuccessMessage] = useState("");

  // Admin Tab State within Forum
  const [isAdminView, setIsAdminView] = useState(false);

  const formatRupiah = (val: number) => {
    return "Rp " + val.toLocaleString("id-ID");
  };

  const isPostGated = (post: ForumPost) => {
    return !!post.isPremium && (!currentUser || currentUser.membershipTier === "free");
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addForumPost(newTitle, newContent, newCategory, isPremiumPost);
    setNewTitle("");
    setNewContent("");
    setIsPremiumPost(false);
    setShowNewPostForm(false);
  };

  const handleCreateReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !activePostId) return;

    addForumReply(activePostId, replyContent);
    setReplyContent("");
  };

  const handlePostClick = (post: ForumPost) => {
    if (isPostGated(post)) {
      setGatedPostAlert(post);
    } else {
      setActivePostId(post.id);
    }
  };

  // Mention Suggestions Handler
  const handleContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, 
    type: "post" | "reply"
  ) => {
    const value = e.target.value;
    if (type === "post") {
      setNewContent(value);
    } else {
      setReplyContent(value);
    }

    const words = value.split(/\s+/);
    const lastWord = words[words.length - 1] || "";

    if (lastWord.startsWith("@")) {
      setShowMentions(true);
      setMentionFilter(lastWord.substring(1).toLowerCase());
      setMentionTargetInput(type);
    } else {
      setShowMentions(false);
      setMentionTargetInput(null);
    }
  };

  const insertMention = (username: string) => {
    if (mentionTargetInput === "post") {
      const words = newContent.split(/\s+/);
      words[words.length - 1] = `@${username} `;
      setNewContent(words.join(" "));
      postContentRef.current?.focus();
    } else if (mentionTargetInput === "reply") {
      const words = replyContent.split(/\s+/);
      words[words.length - 1] = `@${username} `;
      setReplyContent(words.join(" "));
      replyInputRef.current?.focus();
    }
    setShowMentions(false);
    setMentionTargetInput(null);
  };

  // Render text and replace @username with nice badge
  const renderContentWithMentions = (text: string) => {
    if (!text) return "";
    const words = text.split(/(\s+)/);
    return words.map((word, idx) => {
      if (word.startsWith("@")) {
        const username = word.substring(1).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        const isKnownUser = COMMUNITY_USERS.includes(username) || username.includes("Mr Bi");
        return (
          <span 
            key={idx} 
            className={`font-semibold px-1.5 py-0.5 rounded-md inline-block text-xs mx-0.5 font-sans border transition-all ${
              isKnownUser 
                ? "bg-sage-100 text-sage-800 border-sage-200 hover:bg-sage-200" 
                : "bg-neutral-100 text-neutral-700 border-neutral-200"
            }`}
          >
            @{username}
          </span>
        );
      }
      return word;
    });
  };

  // Handle reporting
  const handleReportPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;

    if (reportingPost) {
      reportForumPost(reportingPost.id, reportReason);
      setReportSuccessMessage("Utas berhasil dilaporkan ke tim moderasi.");
    } else if (reportingReply) {
      reportForumReply(reportingReply.postId, reportingReply.replyId, reportReason);
      setReportSuccessMessage("Komentar berhasil dilaporkan ke tim moderasi.");
    }

    setReportReason("");
    setTimeout(() => {
      setReportingPost(null);
      setReportingReply(null);
      setReportSuccessMessage("");
    }, 1500);
  };

  const getFilteredPosts = () => {
    return forumPosts
      .filter((p) => {
        // Filter by Category
        if (activeCategory !== "Semua Topik" && p.category !== activeCategory) {
          return false;
        }
        // Filter by Bookmarked
        if (filterBookmarked) {
          const userKey = currentUser?.fullName || "Anonim";
          if (!p.bookmarkedBy?.includes(userKey)) return false;
        }
        // Filter by Search
        if (searchTerm.trim() !== "") {
          const term = searchTerm.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(term);
          const matchesContent = p.content.toLowerCase().includes(term);
          const matchesCategory = p.category.toLowerCase().includes(term);
          if (!matchesTitle && !matchesContent && !matchesCategory) return false;
        }
        // Filter hidden unless admin view is active
        if (p.isHidden && !isAdminView) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Pinned threads stay at the top
        const aPinned = a.isPinned ? 1 : 0;
        const bPinned = b.isPinned ? 1 : 0;
        if (aPinned !== bPinned) return bPinned - aPinned;
        
        // Then by date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  const filteredPosts = getFilteredPosts();

  // Get active trending threads (sorted by likes + replies count)
  const getTrendingThreads = () => {
    return [...forumPosts]
      .filter(p => !p.isHidden)
      .sort((a, b) => {
        const aScore = (a.likes || 0) + (a.replies?.length || 0) * 2;
        const bScore = (b.likes || 0) + (b.replies?.length || 0) * 2;
        return bScore - aScore;
      })
      .slice(0, 4);
  };

  const trendingThreads = getTrendingThreads();

  // Categories count stats
  const getCategoryCount = (category: string) => {
    if (category === "Semua Topik") return forumPosts.filter(p => !p.isHidden).length;
    return forumPosts.filter(p => p.category === category && !p.isHidden).length;
  };

  // Reported posts statistics
  const getReportedPostsCount = () => {
    let count = 0;
    forumPosts.forEach((p) => {
      if (p.reports && p.reports.length > 0) count++;
      p.replies?.forEach((r) => {
        if (r.reports && r.reports.length > 0) count++;
      });
    });
    return count;
  };

  const reportedCount = getReportedPostsCount();

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Forum Search Bar and Filter Navigation */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-sage-100 shadow-soft-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-warm-400" />
          <input 
            type="text"
            placeholder="Cari kata kunci, topik, atau tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 rounded-full bg-ivory-50/50 border border-sage-100 text-xs font-sans text-neutral-warm-800 placeholder-neutral-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-warm-400 hover:text-neutral-warm-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Quick Toggles */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
          <button 
            onClick={() => {
              setFilterBookmarked(false);
              setIsAdminView(false);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              !filterBookmarked && !isAdminView
                ? "bg-sage-600 text-white shadow-soft-sm"
                : "bg-neutral-warm-50 text-neutral-warm-700 hover:bg-neutral-warm-100 border border-neutral-warm-100"
            }`}
          >
            Semua Diskusi
          </button>
          <button 
            onClick={() => {
              setFilterBookmarked(true);
              setIsAdminView(false);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1 ${
              filterBookmarked && !isAdminView
                ? "bg-sage-600 text-white shadow-soft-sm"
                : "bg-neutral-warm-50 text-neutral-warm-700 hover:bg-neutral-warm-100 border border-neutral-warm-100"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            Tersimpan
          </button>

          {/* Admin Moderation Button */}
          {currentUser?.role === "admin" && (
            <button 
              onClick={() => {
                setIsAdminView(true);
                setFilterBookmarked(false);
                setActivePostId(null);
                setShowNewPostForm(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                isAdminView
                  ? "bg-amber-600 text-white shadow-soft-sm"
                  : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Moderasi
              {reportedCount > 0 && (
                <span className="bg-red-500 text-white font-sans text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {reportedCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Categories List Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-3xl border border-sage-100 shadow-soft-sm space-y-4">
            <h3 className="font-serif text-sm font-bold tracking-wider text-neutral-warm-900 uppercase border-b border-sage-50 pb-2">
              KATEGORI TOPIK
            </h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat && !isAdminView;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsAdminView(false);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all whitespace-nowrap shrink-0 lg:shrink w-auto lg:w-full ${
                      isActive
                        ? "bg-sage-50 text-sage-800 border-l-4 border-sage-600"
                        : "text-neutral-warm-600 hover:bg-neutral-warm-50 hover:text-neutral-warm-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Tag className={`w-3.5 h-3.5 ${isActive ? "text-sage-600" : "text-neutral-warm-400"}`} />
                      <span>{cat}</span>
                    </div>
                    <span className="ml-2 bg-neutral-warm-100 text-neutral-warm-600 font-sans text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {getCategoryCount(cat)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-sage-100 shadow-soft-sm space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sage-600" />
              <h3 className="font-serif text-sm font-bold text-neutral-warm-900 uppercase">
                Ruang Aman Kita
              </h3>
            </div>
            <p className="text-xs text-neutral-warm-500 leading-relaxed">
              Mr Bi menjamin kerahasiaan identitas Anda. Penggunaan pseudonim atau nama samaran sangat dianjurkan saat mencurahkan isi hati.
            </p>
            <div className="pt-2 border-t border-sage-50 text-[11px] text-sage-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>120+ Konselor Aktif Online</span>
            </div>
          </div>

          {/* Create Post trigger button */}
          {!activePostId && !isAdminView && (
            <button
              onClick={() => {
                setShowNewPostForm(!showNewPostForm);
                if (!showNewPostForm) {
                  // scroll to top of workspace
                  window.scrollTo({ top: 350, behavior: "smooth" });
                }
              }}
              className="btn-primary w-full text-xs font-bold py-3 px-4 flex items-center justify-center gap-2"
            >
              {showNewPostForm ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Batal Menulis</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Buat Pertanyaan Baru</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Center: Main Forum Content Area */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Admin Moderation Panel View */}
          {isAdminView ? (
            <div className="bg-amber-50/30 rounded-3xl p-6 border border-amber-200 shadow-soft-sm space-y-6 animate-scale-up">
              <div className="flex items-center justify-between border-b border-amber-200/50 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-amber-700" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-neutral-warm-900">Moderasi Admin</h3>
                    <p className="text-xs text-neutral-warm-600">Pantau dan kelola konten yang dilaporkan oleh komunitas.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAdminView(false)}
                  className="text-neutral-500 hover:text-neutral-800 text-xs font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Forum
                </button>
              </div>

              {/* Reported Content Lists */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold font-mono tracking-wider text-neutral-500 uppercase">DAFTAR LAPORAN ({reportedCount})</h4>
                
                {reportedCount === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-dashed border-neutral-200 text-center text-neutral-500 space-y-2">
                    <Check className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="text-xs font-bold">Kondisi Aman Terkendali!</p>
                    <p className="text-[11px] text-neutral-400">Tidak ada postingan atau reply yang dilaporkan oleh pengguna saat ini.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Reported Posts */}
                    {forumPosts.filter(p => p.reports && p.reports.length > 0).map(post => (
                      <div key={post.id} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-soft-sm space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            Utas Dilaporkan
                          </span>
                          <span className="text-[10px] font-mono text-neutral-warm-400">{formatDateIndo(post.createdAt)}</span>
                        </div>
                        <h5 className="text-sm font-bold text-neutral-900 leading-snug">{post.title}</h5>
                        <p className="text-xs text-neutral-warm-600 line-clamp-3 bg-neutral-warm-50 p-2.5 rounded-xl italic">"{post.content}"</p>
                        
                        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs space-y-1">
                          <p className="font-bold text-amber-800 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Detail Laporan:</p>
                          {post.reports?.map((r) => (
                            <p key={r.id} className="text-neutral-700 font-sans pl-4">
                              • <span className="font-bold">@{r.authorName}</span>: "{r.reason}"
                            </p>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-sage-50 flex flex-wrap justify-end gap-2 text-xs">
                          <button 
                            onClick={() => hideForumPost(post.id)}
                            className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            {post.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{post.isHidden ? "Buka Sembunyikan" : "Sembunyikan"}</span>
                          </button>
                          <button 
                            onClick={() => pinForumPost(post.id)}
                            className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <Pin className="w-3.5 h-3.5" />
                            <span>{post.isPinned ? "Lepas Pin" : "Sematkan Pin"}</span>
                          </button>
                          <button 
                            onClick={() => deleteForumPost(post.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 flex items-center gap-1 cursor-pointer font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Permanen</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Reported Replies */}
                    {forumPosts.map(post => 
                      (post.replies || []).filter(r => r.reports && r.reports.length > 0).map(reply => (
                        <div key={reply.id} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-soft-sm space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                              Balasan Dilaporkan
                            </span>
                            <span className="text-[10px] text-neutral-400">Di Utas: "{post.title}"</span>
                          </div>
                          <p className="text-xs text-neutral-warm-800 leading-relaxed font-sans">{reply.content}</p>
                          <p className="text-[10px] font-mono text-neutral-warm-500">Oleh: @{reply.authorName} • {formatDateIndo(reply.createdAt)}</p>

                          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs space-y-1">
                            <p className="font-bold text-amber-800 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Detail Laporan:</p>
                            {reply.reports?.map((r) => (
                              <p key={r.id} className="text-neutral-700 font-sans pl-4">
                                • <span className="font-bold">@{r.authorName}</span>: "{r.reason}"
                              </p>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-sage-50 flex justify-end gap-2 text-xs">
                            <button 
                              onClick={() => deleteForumReply(post.id, reply.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 flex items-center gap-1 cursor-pointer font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus Balasan</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : gatedPostAlert ? (
            /* Premium Gate Lock Alert */
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-soft-md animate-scale-up text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-1.5">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {gatedPostAlert.category}
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-neutral-warm-900 font-bold mt-2 leading-snug">
                  {gatedPostAlert.title}
                </h3>
              </div>
              
              <p className="text-xs md:text-sm text-neutral-warm-600 max-w-md mx-auto leading-relaxed">
                Forum tanya jawab bimbingan psikologi romantis ini bersifat rahasia dan merupakan konten premium eksklusif untuk member kelas <span className="font-bold text-sage-700">Silver, Gold, atau Lifetime</span>.
              </p>

              <div className="p-4 bg-amber-50/50 rounded-2xl text-left border border-amber-100 text-xs text-neutral-warm-700 space-y-2">
                <p className="font-bold text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Mengapa Harus Upgrade Ke Premium?
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-warm-600 pl-1.5">
                  <li>Baca tanggapan & saran pemulihan interaktif dari verified expert (Mr Bi, M.Psi.)</li>
                  <li>Bisa menulis pertanyaan & berdiskusi privat</li>
                  <li>Mendapatkan respons pendampingan langsung oleh tim psikolog dalam waktu 1x24 jam</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button 
                  onClick={() => setGatedPostAlert(null)}
                  className="btn-secondary text-xs px-5 py-2.5 cursor-pointer"
                >
                  Kembali ke Forum Umum
                </button>
              </div>
            </div>
          ) : activePostId && activePost ? (
            /* Single Thread Details View */
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-sage-100 shadow-soft-md animate-scale-up space-y-6">
              <button 
                onClick={() => {
                  setActivePostId(null);
                  setEditingPostId(null);
                }}
                className="text-xs text-sage-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                ← Kembali ke Forum Utama
              </button>

              {/* Editing Form Inline if triggered */}
              {editingPostId === activePost.id ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  editForumPost(activePost.id, editTitle, editContent, editCategory);
                  setEditingPostId(null);
                }} className="space-y-4 pt-2">
                  <h4 className="font-serif text-sm font-bold text-neutral-warm-800">Edit Utas Diskusi</h4>
                  <div>
                    <label className="label-field">Kategori</label>
                    <select 
                      value={editCategory} 
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="input-field"
                    >
                      {CATEGORIES.filter(c => c !== "Semua Topik").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Judul</label>
                    <input 
                      type="text" 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-field">Isi Curahan</label>
                    <textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="input-field min-h-[140px] resize-none"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setEditingPostId(null)}
                      className="btn-text text-xs"
                    >
                      Batal
                    </button>
                    <button type="submit" className="btn-primary text-xs py-2 px-4 font-bold">
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              ) : (
                <div className="border-b border-sage-100 pb-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-sage-50 text-sage-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {activePost.category}
                    </span>
                    {activePost.isPremium && (
                      <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 fill-white/10" /> Premium Thread
                      </span>
                    )}
                    {activePost.isPinned && (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5 fill-current" /> PINNED
                      </span>
                    )}
                    <span className="text-[11px] text-neutral-warm-400 font-mono">
                      Oleh <span className="font-semibold text-neutral-warm-700">@{activePost.authorName}</span> • {formatDateIndo(activePost.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg md:text-2xl text-neutral-warm-900 font-bold leading-tight">
                    {activePost.title}
                  </h3>

                  <p className="body-comfort text-neutral-warm-700 mt-4 leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {renderContentWithMentions(activePost.content)}
                  </p>

                  {/* Actions Bar for Active Thread */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-xs text-neutral-warm-500 border-t border-dashed border-sage-100 mt-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => likeForumPost(activePost.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                          activePost.likedBy?.includes(currentUser?.fullName || "Anonim")
                            ? "bg-rose-50 text-rose-600 font-bold border border-rose-100"
                            : "hover:bg-neutral-warm-50 border border-transparent"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${activePost.likedBy?.includes(currentUser?.fullName || "Anonim") ? "fill-rose-500 text-rose-500" : ""}`} />
                        <span>{activePost.likes} Suka</span>
                      </button>

                      <button 
                        onClick={() => bookmarkForumPost(activePost.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                          activePost.bookmarkedBy?.includes(currentUser?.fullName || "Anonim")
                            ? "bg-amber-50 text-amber-600 font-bold border border-amber-100"
                            : "hover:bg-neutral-warm-50 border border-transparent"
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${activePost.bookmarkedBy?.includes(currentUser?.fullName || "Anonim") ? "fill-amber-500 text-amber-500" : ""}`} />
                        <span>{activePost.bookmarkedBy?.includes(currentUser?.fullName || "Anonim") ? "Tersimpan" : "Simpan"}</span>
                      </button>

                      <button 
                        onClick={() => setReportingPost(activePost)}
                        className="flex items-center gap-1 hover:text-red-600 px-3 py-1.5 rounded-full hover:bg-red-50/50"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        <span>Laporkan</span>
                      </button>
                    </div>

                    {/* Admin/Author inline moderation actions */}
                    <div className="flex items-center gap-1.5">
                      {(currentUser?.role === "admin" || currentUser?.fullName === activePost.authorName) && (
                        <button 
                          onClick={() => {
                            setEditingPostId(activePost.id);
                            setEditTitle(activePost.title);
                            setEditContent(activePost.content);
                            setEditCategory(activePost.category);
                          }}
                          className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600 cursor-pointer"
                          title="Edit Utas"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {currentUser?.role === "admin" && (
                        <>
                          <button 
                            onClick={() => pinForumPost(activePost.id)}
                            className={`p-1.5 rounded-lg border cursor-pointer ${activePost.isPinned ? "bg-amber-100 text-amber-700 border-amber-200" : "border-neutral-200 hover:bg-neutral-50"}`}
                            title={activePost.isPinned ? "Lepas Semat Pin" : "Sematkan Pin"}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => {
                              deleteForumPost(activePost.id);
                              setActivePostId(null);
                            }}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                            title="Hapus Utas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Replies List */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-xs tracking-wider text-neutral-warm-500 uppercase flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-sage-600" />
                  RESPON DISKUSI ({activePost.replies?.length || 0})
                </h4>
                
                {(!activePost.replies || activePost.replies.length === 0) ? (
                  <p className="text-xs italic text-neutral-warm-400 py-4 text-center bg-neutral-warm-50/50 rounded-2xl border border-dashed border-neutral-warm-100">
                    Belum ada respon hangat. Mari jadilah yang pertama memberikan pandangan berharga.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {activePost.replies.map((rep) => {
                      const isPsychologist = rep.authorName.includes("Mr Bi") || rep.authorName.includes("M.Psi");
                      const replyLiked = rep.likedBy?.includes(currentUser?.fullName || "Anonim");
                      return (
                        <div 
                          key={rep.id} 
                          className={`p-4 md:p-5 rounded-2xl border transition-all ${
                            isPsychologist 
                              ? "bg-sage-50/70 border-sage-200/80 shadow-soft-sm" 
                              : "bg-neutral-warm-50/40 border-neutral-warm-100"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-xs font-bold font-sans text-neutral-warm-800 flex items-center gap-1.5">
                                <User className={`w-3.5 h-3.5 ${isPsychologist ? "text-sage-700" : "text-neutral-warm-400"}`} />
                                @{rep.authorName}
                                {isPsychologist && (
                                  <span className="bg-sage-600 text-white text-[9px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase">
                                    Verified Expert
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] font-mono text-neutral-warm-400">
                                {formatDateIndo(rep.createdAt)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {/* Report reply */}
                              <button 
                                onClick={() => setReportingReply({ postId: activePost.id, replyId: rep.id })}
                                className="text-neutral-warm-400 hover:text-red-500 p-1 rounded hover:bg-red-50/50"
                                title="Laporkan komentar"
                              >
                                <Flag className="w-3 h-3" />
                              </button>

                              {/* Admin deletion of reply */}
                              {currentUser?.role === "admin" && (
                                <button 
                                  onClick={() => deleteForumReply(activePost.id, rep.id)}
                                  className="text-red-500 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                  title="Hapus komentar"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-xs md:text-sm text-neutral-warm-700 leading-relaxed font-sans pl-1.5">
                            {renderContentWithMentions(rep.content)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Create Reply Form with Autocomplete suggestions */}
              <form onSubmit={handleCreateReply} className="pt-4 border-t border-sage-100 relative">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input 
                      ref={replyInputRef}
                      type="text" 
                      placeholder="Tulis saran atau tanggapan hangat Anda... (ketik @ untuk sebut nama)"
                      value={replyContent}
                      onChange={(e) => handleContentChange(e, "reply")}
                      className="input-field py-3 text-xs md:text-sm"
                      required
                      autoComplete="off"
                    />
                    
                    {/* Mention Suggestions Popup for Reply Input */}
                    {showMentions && mentionTargetInput === "reply" && (
                      <div className="absolute bottom-full left-0 mb-2 w-56 bg-white border border-sage-100 rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto p-1.5 animate-scale-up">
                        <p className="text-[10px] text-neutral-400 font-mono px-2 py-1 border-b border-sage-50">SEBUT ANGGOTA KOMUNITAS:</p>
                        {COMMUNITY_USERS.filter(u => u.toLowerCase().includes(mentionFilter)).map(u => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => insertMention(u)}
                            className="w-full text-left px-2 py-1.5 text-xs text-neutral-warm-700 hover:bg-sage-50 hover:text-sage-800 rounded-lg font-medium transition-all"
                          >
                            @{u}
                          </button>
                        ))}
                        {COMMUNITY_USERS.filter(u => u.toLowerCase().includes(mentionFilter)).length === 0 && (
                          <p className="text-[10px] text-neutral-warm-400 italic p-2 text-center">Nama tidak ditemukan</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button type="submit" className="btn-primary py-3 px-5 text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-soft-sm">
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Kirim</span>
                  </button>
                </div>
              </form>
            </div>
          ) : showNewPostForm ? (
            /* Create New Thread Form View */
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-sage-100 shadow-soft-md animate-scale-up space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-sage-50">
                <h3 className="font-serif text-lg text-neutral-warm-900 font-bold">Tanyakan Dinamika Pernikahan</h3>
                <button onClick={() => setShowNewPostForm(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="label-field text-xs uppercase tracking-wider font-semibold text-neutral-warm-500">Kategori Topik</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="input-field"
                  >
                    {CATEGORIES.filter(c => c !== "Semua Topik").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="label-field text-xs uppercase tracking-wider font-semibold text-neutral-warm-500">Judul Pertanyaan (Utas)</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Menghadapi silent treatment berkepanjangan"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="label-field text-xs uppercase tracking-wider font-semibold text-neutral-warm-500">Isi Curahan Pertanyaan / Detail Masalah</label>
                  <textarea 
                    ref={postContentRef}
                    placeholder="Ceritakan dengan lengkap masalah Anda... Ketik @ untuk menyebut anggota atau psikolog seperti @Mr Bi, M.Psi."
                    value={newContent}
                    onChange={(e) => handleContentChange(e, "post")}
                    className="input-field min-h-[140px] resize-none"
                    required
                  />

                  {/* Mention Suggestions Popup for Post Textarea */}
                  {showMentions && mentionTargetInput === "post" && (
                    <div className="absolute left-0 bottom-full mb-2 w-56 bg-white border border-sage-100 rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto p-1.5 animate-scale-up">
                      <p className="text-[10px] text-neutral-400 font-mono px-2 py-1 border-b border-sage-50">SEBUT ANGGOTA KOMUNITAS:</p>
                      {COMMUNITY_USERS.filter(u => u.toLowerCase().includes(mentionFilter)).map(u => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => insertMention(u)}
                          className="w-full text-left px-2 py-1.5 text-xs text-neutral-warm-700 hover:bg-sage-50 hover:text-sage-800 rounded-lg font-medium transition-all"
                        >
                          @{u}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-sage-50/50 rounded-2xl border border-sage-100 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={isPremiumPost}
                      disabled={currentUser?.membershipTier === "free"}
                      onChange={(e) => setIsPremiumPost(e.target.checked)}
                      className="rounded border-sage-300 text-sage-600 focus:ring-sage-500 w-4 h-4 disabled:opacity-50 cursor-pointer"
                    />
                    <span className="text-xs font-sans font-semibold text-neutral-warm-700 flex items-center gap-1.5">
                      Jadikan Utas Premium
                      <span className="bg-amber-500 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 fill-white/10" /> Premium
                      </span>
                    </span>
                  </label>
                  {currentUser?.membershipTier === "free" && (
                    <p className="text-[10px] text-amber-600 pl-6 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3" /> Hanya tersedia untuk member Silver, Gold, atau Lifetime.
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-sage-50">
                  <button 
                    type="button" 
                    onClick={() => setShowNewPostForm(false)}
                    className="btn-text text-xs"
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn-primary text-xs py-2 px-5 font-bold">
                    Kirim Pertanyaan Ke Komunitas
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Main Feed List Threads View */
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-xs font-bold font-mono tracking-widest text-neutral-500 uppercase">
                  {isAdminView ? "MODERASI AKTIF" : filterBookmarked ? "DISKUSI DISIMPAN SAYA" : `TOPIK: ${activeCategory.toUpperCase()}`}
                </h4>
                <span className="text-[11px] text-neutral-warm-400 font-mono">
                  Menampilkan {filteredPosts.length} utas
                </span>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-sage-100 shadow-soft-sm text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-sage-300 mx-auto" />
                  <h4 className="font-serif text-base text-neutral-warm-800 font-bold">Tidak Ada Diskusi</h4>
                  <p className="text-xs text-neutral-warm-500 max-w-sm mx-auto leading-relaxed">
                    Tidak ditemukan utas untuk kriteria saat ini. Jadilah yang pertama membuat diskusi baru untuk topik ini!
                  </p>
                  {!filterBookmarked && (
                    <button 
                      onClick={() => setShowNewPostForm(true)}
                      className="btn-primary text-xs py-2 px-4 mt-2 font-bold"
                    >
                      Tulis Pertanyaan Baru
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => {
                    const isGated = isPostGated(post);
                    const isLikedByMe = post.likedBy?.includes(currentUser?.fullName || "Anonim");
                    const isBookmarkedByMe = post.bookmarkedBy?.includes(currentUser?.fullName || "Anonim");
                    
                    return (
                      <div 
                        key={post.id}
                        className={`bg-white p-6 rounded-3xl border transition-all shadow-soft-sm hover:shadow-soft-md relative overflow-hidden group hover:-translate-y-0.5 ${
                          post.isPinned 
                            ? "border-amber-200 bg-amber-50/10" 
                            : post.isHidden 
                            ? "border-dashed border-red-200 bg-red-50/10" 
                            : "border-sage-100 hover:border-sage-200"
                        }`}
                      >
                        {/* Pinned top indicator ribbon */}
                        {post.isPinned && (
                          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl font-mono tracking-wider flex items-center gap-1 shadow-soft-sm">
                            <Pin className="w-3 h-3 fill-current" /> PINNED
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="bg-sage-50 text-sage-700 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            {post.category}
                          </span>
                          {post.isPremium && (
                            <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5 shadow-soft-sm">
                              <Sparkles className="w-2.5 h-2.5 fill-white/10" /> Premium
                            </span>
                          )}
                          {post.isHidden && (
                            <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5 font-mono">
                              HIDDEN (MODERATED)
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-neutral-warm-400">
                            @{post.authorName} • {formatDateIndo(post.createdAt)}
                          </span>
                        </div>
                        
                        <h4 
                          onClick={() => handlePostClick(post)}
                          className="font-sans font-bold text-base text-neutral-warm-900 mb-2 leading-snug cursor-pointer group-hover:text-sage-700 transition-colors"
                        >
                          {post.title}
                        </h4>
                        
                        <p className={`text-xs md:text-sm text-neutral-warm-600 line-clamp-2 leading-relaxed mb-4 ${isGated ? "blur-[2px] select-none pointer-events-none" : ""}`}>
                          {post.content}
                        </p>

                        <div className="flex flex-wrap justify-between items-center border-t border-sage-50/50 pt-4 text-[11px] text-neutral-warm-500 gap-3">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => likeForumPost(post.id)}
                              className={`flex items-center gap-1 hover:text-rose-600 p-1 rounded transition-colors ${isLikedByMe ? "text-rose-600 font-bold" : ""}`}
                            >
                              <Heart className={`w-4 h-4 ${isLikedByMe ? "fill-rose-500 text-rose-500" : "text-neutral-warm-400"}`} />
                              <span>{post.likes}</span>
                            </button>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4 text-neutral-warm-400" />
                              <span>{post.replies?.length || 0} respon</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Bookmark trigger */}
                            <button 
                              onClick={() => bookmarkForumPost(post.id)}
                              className={`p-1 hover:text-amber-500 rounded transition-colors ${isBookmarkedByMe ? "text-amber-600" : ""}`}
                              title={isBookmarkedByMe ? "Batalkan simpan" : "Simpan Utas"}
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarkedByMe ? "fill-amber-500 text-amber-500" : "text-neutral-warm-400"}`} />
                            </button>

                            {/* Report trigger */}
                            <button 
                              onClick={() => setReportingPost(post)}
                              className="p-1 hover:text-red-500 rounded transition-colors"
                              title="Laporkan Utas"
                            >
                              <Flag className="w-4 h-4 text-neutral-warm-400" />
                            </button>

                            <button 
                              onClick={() => handlePostClick(post)}
                              className="text-sage-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5 pl-2"
                            >
                              {isGated ? (
                                <>
                                  <Lock className="w-3.5 h-3.5 text-amber-500 mr-1" />
                                  Buka Kunci →
                                </>
                              ) : (
                                "Ikut Berdiskusi →"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Trending & Mention suggestions panel */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Trending hashtags panel */}
          <div className="bg-white p-5 rounded-3xl border border-sage-100 shadow-soft-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-sage-50 pb-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <h3 className="font-serif text-xs font-bold tracking-wider text-neutral-warm-900 uppercase">
                HASHTAG TRENDING
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchTerm(tag);
                    setIsAdminView(false);
                    setFilterBookmarked(false);
                  }}
                  className="bg-ivory-50 hover:bg-sage-50 text-[11px] text-neutral-warm-700 hover:text-sage-800 font-sans font-medium px-2.5 py-1.5 rounded-xl border border-sage-100 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Trending Hot Posts Panel */}
          <div className="bg-white p-5 rounded-3xl border border-sage-100 shadow-soft-sm space-y-4">
            <h3 className="font-serif text-xs font-bold tracking-wider text-neutral-warm-900 uppercase border-b border-sage-50 pb-2">
              UTAS TERPOPULER 🔥
            </h3>
            <div className="space-y-3.5">
              {trendingThreads.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => handlePostClick(p)}
                  className="group cursor-pointer space-y-1"
                >
                  <p className="text-[10px] text-sage-600 font-bold uppercase tracking-wider">{p.category}</p>
                  <h4 className="text-xs font-bold text-neutral-warm-800 group-hover:text-sage-700 leading-snug transition-colors line-clamp-2">
                    {p.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-warm-400 font-mono">
                    <span>{p.likes} Suka</span>
                    <span>•</span>
                    <span>{p.replies?.length || 0} Balasan</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* active community users with click-to-mention helper */}
          <div className="bg-white p-5 rounded-3xl border border-sage-100 shadow-soft-sm space-y-4">
            <h3 className="font-serif text-xs font-bold tracking-wider text-neutral-warm-900 uppercase border-b border-sage-50 pb-2">
              SEBUT ANGGOTA (@)
            </h3>
            <p className="text-[10px] text-neutral-warm-500 leading-relaxed">Klik nama di bawah untuk langsung menyalin sebutan di draf tulisan Anda:</p>
            <div className="grid grid-cols-2 gap-1.5">
              {COMMUNITY_USERS.slice(0, 8).map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    if (showNewPostForm) {
                      setNewContent(prev => prev + `@${u} `);
                      postContentRef.current?.focus();
                    } else if (activePostId) {
                      setReplyContent(prev => prev + `@${u} `);
                      replyInputRef.current?.focus();
                    } else {
                      // fallback toggle form
                      setShowNewPostForm(true);
                      setNewContent(prev => prev + `@${u} `);
                    }
                  }}
                  className="bg-neutral-warm-50/50 hover:bg-sage-50 border border-neutral-warm-100 hover:border-sage-200 text-[10px] font-sans font-bold text-neutral-warm-700 hover:text-sage-800 p-1.5 rounded-lg text-center truncate cursor-pointer transition-all"
                >
                  @{u.split("_")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reporting Reason Selection Modal Dialog */}
      {(reportingPost || reportingReply) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-warm-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-sage-100 animate-scale-up space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-base font-bold text-neutral-warm-900 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Laporkan Konten
              </h3>
              <button 
                onClick={() => {
                  setReportingPost(null);
                  setReportingReply(null);
                }} 
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccessMessage ? (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-center text-xs font-semibold">
                {reportSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleReportPostSubmit} className="space-y-4">
                <p className="text-xs text-neutral-warm-500 leading-relaxed">
                  Bantu kami menjaga kesantunan komunitas. Silakan pilih alasan pelaporan konten ini:
                </p>

                <div className="space-y-2">
                  {[
                    "Spam / Iklan tidak relevan",
                    "Bahasa kasar / Tidak sopan / Menghakimi",
                    "Ujaran kebencian / SARA",
                    "Konten Seksual / Pornografi",
                    "Lainnya"
                  ].map((reason) => (
                    <label key={reason} className="flex items-center gap-2 text-xs text-neutral-warm-800 cursor-pointer p-1">
                      <input 
                        type="radio" 
                        name="report_reason" 
                        value={reason}
                        checked={reportReason === reason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="text-sage-600 focus:ring-sage-500 border-sage-300 w-3.5 h-3.5"
                        required
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-sage-50">
                  <button 
                    type="button" 
                    onClick={() => {
                      setReportingPost(null);
                      setReportingReply(null);
                    }}
                    className="btn-text text-xs"
                  >
                    Batal
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-soft-sm cursor-pointer">
                    Kirim Laporan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
