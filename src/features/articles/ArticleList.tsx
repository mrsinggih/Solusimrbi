import React, { useState } from "react";
import { useAppState } from "../../store";
import { formatDateIndo } from "../../utils/formatter";
import { BookOpen, User, Calendar, Heart, Search, Lock, Sparkles } from "lucide-react";

export const ArticleList: React.FC = () => {
  const { articles, currentUser } = useAppState();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const isPremiumGated = (art: any) => {
    return !!art.isPremium && (!currentUser || currentUser.membershipTier === "free");
  };

  // Dynamically extract categories from all published articles
  const categories = ["Semua", ...Array.from(new Set(articles
    .filter((art) => !art.status || art.status === "published")
    .map((art) => art.category)
    .filter(Boolean)
  ))];

  const filteredArticles = articles.filter((art) => {
    // Only show published articles in public list
    const isPublished = !art.status || art.status === "published";
    if (!isPublished) return false;

    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeArticle = articles.find((a) => a.id === selectedArticleId);

  return (
    <div className="w-full">
      {selectedArticleId && activeArticle ? (
        /* Full Article Detail Modal View */
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-sage-100/50 shadow-soft-lg animate-scale-up">
          <button 
            onClick={() => setSelectedArticleId(null)}
            className="btn-secondary text-xs px-4 py-2 mb-6"
          >
            ← Kembali ke Daftar Artikel
          </button>
          
          <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-6">
            <img 
              src={activeArticle.coverUrl} 
              alt={activeArticle.title} 
              className="object-cover w-full h-full"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="bg-sage-500 text-ivory-50 text-xs px-3 py-1 rounded-full font-sans font-medium">
                {activeArticle.category}
              </div>
              {activeArticle.isPremium && (
                <div className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-sans font-medium flex items-center gap-1 shadow-soft-sm">
                  <Sparkles className="w-3 h-3 fill-white/10" /> Premium
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-warm-500 mb-4 font-sans">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-sage-600" />
              {activeArticle.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sage-600" />
              {formatDateIndo(activeArticle.publishedAt)}
            </span>
            <span>•</span>
            <span>{activeArticle.readTime} Bacaan</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-neutral-warm-900 mb-6 leading-tight">
            {activeArticle.title}
          </h2>

          {isPremiumGated(activeArticle) ? (
            <div className="border-t border-sage-100 pt-8 mt-6">
              <p className="font-serif italic text-lg text-neutral-warm-500 mb-6">
                "{activeArticle.excerpt}"
              </p>
              <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-6 md:p-8 text-center max-w-2xl mx-auto space-y-4 shadow-soft-sm">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-neutral-warm-900">Konten Khusus Member Premium</h3>
                <p className="text-xs md:text-sm text-neutral-warm-600 max-w-md mx-auto">
                  Artikel <span className="font-bold">"{activeArticle.title}"</span> adalah konten premium eksklusif untuk member kelas <span className="font-bold text-sage-700">Silver, Gold, atau Lifetime</span>.
                </p>
                <div className="p-4 bg-white/90 rounded-xl text-left border border-sage-100 text-xs text-neutral-warm-700 space-y-2">
                  <p className="font-bold text-sage-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Keuntungan Member Premium:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-warm-600">
                    <li>Akses seluruh artikel premium & esai psikologi terdalam</li>
                    <li>Akses forum diskusi premium "Dengar Rasa" (Tanya jawab bimbingan)</li>
                    <li>Bebas download Ebook & modul panduan bimbingan</li>
                    <li>Akses Video Pembelajaran interaktif Mr Bi</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-neutral-warm-500 mb-3">Silakan buka tab <strong>Membership</strong> di menu utama atau Dashboard untuk melakukan beralih ke paket premium.</p>
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => setSelectedArticleId(null)}
                      className="btn-secondary text-xs px-4 py-2 cursor-pointer"
                    >
                      Lihat Artikel Lain
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="body-comfort text-neutral-warm-700 space-y-4 max-w-3xl border-t border-sage-100 pt-6">
              <p className="font-serif italic text-lg text-sage-700 mb-4">
                "{activeArticle.excerpt}"
              </p>
              <p>{activeArticle.content}</p>
              <p>
                Bimbingan intensif batin bersama pasangan dapat diwujudkan secara utuh melalui modul bimbingan terintegrasi. Psikologi bimbingan meyakini bahwa keterbukaan emosi di ruang konseling yang aman merupakan langkah pemulihan terbaik.
              </p>
              <p className="pt-4 font-semibold text-sage-800 font-sans text-sm">
                Ingin mendiskusikan topik ini langsung secara privat dengan Mr Bi? Anda bisa langsung booking bimbingan via form bimbingan.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Articles List Grid View */
        <div className="space-y-8">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-sage-100 shadow-soft-sm">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-neutral-warm-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari artikel psikologi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all
                    ${selectedCategory === cat 
                      ? "bg-sage-500 text-ivory-50 shadow-soft-sm" 
                      : "bg-sage-50 text-sage-700 hover:bg-sage-100"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div 
                key={art.id}
                className="card-therapy flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden mb-4">
                    <img 
                      src={art.coverUrl} 
                      alt={art.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="bg-white/90 backdrop-blur-sm text-sage-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-soft-sm">
                        {art.category}
                      </span>
                      {art.isPremium && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-soft-sm">
                          <Sparkles className="w-2.5 h-2.5 fill-white/10" /> Premium
                        </span>
                      )}
                    </div>
                    {isPremiumGated(art) && (
                      <div className="absolute inset-0 bg-neutral-warm-900/30 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 group-hover:bg-neutral-warm-900/40">
                        <div className="bg-white/90 text-neutral-warm-900 p-2.5 rounded-full shadow-soft-md">
                          <Lock className="w-4 h-4 text-amber-600" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] font-mono text-sage-500 mb-1">
                    {formatDateIndo(art.publishedAt)}
                  </div>
                  <h3 className="h4-sans text-neutral-warm-900 group-hover:text-sage-600 transition-colors leading-snug line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="body-comfort-sm text-neutral-warm-500 line-clamp-3 mt-2">
                    {art.excerpt}
                  </p>
                </div>

                <div className="border-t border-sage-50 pt-4 mt-4 flex justify-between items-center text-xs">
                  <span className="text-neutral-warm-400 font-medium">{art.readTime} Baca</span>
                  <button 
                    onClick={() => setSelectedArticleId(art.id)}
                    className="text-sage-600 font-bold hover:text-sage-800 cursor-pointer flex items-center gap-1"
                  >
                    Selengkapnya →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
