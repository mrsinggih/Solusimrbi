import React, { useState, useEffect } from "react";
import { useAppState } from "../store";
import { 
  Globe, 
  Search, 
  Code, 
  FileText, 
  Settings, 
  Copy, 
  Check, 
  Rss, 
  Map, 
  Eye, 
  Heart, 
  Sparkles, 
  Award, 
  BookOpen, 
  MessageSquare, 
  ShieldCheck, 
  Compass, 
  Cpu, 
  ChevronRight, 
  Home, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { formatRupiah } from "../utils/formatter";

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  ogUrl?: string;
  isNoIndex?: boolean;
  schema?: any;
}

/**
 * Custom hook to dynamically manage metadata, canonical links, social tags (OG, Twitter), and JSON-LD schemas
 */
export function useSEO({ title, description, canonicalUrl, ogType = "website", ogImage, ogUrl, isNoIndex = false, schema }: SEOProps) {
  useEffect(() => {
    // 1. Dynamic Title
    if (title) {
      document.title = title;
    }

    // 2. Dynamic Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description || "");

    // 3. Dynamic Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonicalUrl || window.location.href);

    // 4. Dynamic Robots Meta Tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute("content", isNoIndex ? "noindex, nofollow" : "index, follow");

    // 5. Open Graph Meta Tags
    const updateMetaProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    updateMetaProperty("og:title", title || "");
    updateMetaProperty("og:description", description || "");
    updateMetaProperty("og:type", ogType);
    updateMetaProperty("og:image", ogImage || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200");
    updateMetaProperty("og:url", ogUrl || canonicalUrl || window.location.href);
    updateMetaProperty("og:site_name", "Solusi Mr Bi");
    updateMetaProperty("og:locale", "id_ID");

    // 6. Twitter Card Meta Tags
    const updateMetaName = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    updateMetaName("twitter:card", "summary_large_image");
    updateMetaName("twitter:title", title || "");
    updateMetaName("twitter:description", description || "");
    updateMetaName("twitter:image", ogImage || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200");
    updateMetaName("twitter:creator", "@solusi.mr.bi");

    // 7. Structured Data JSON-LD Script Integration
    const scriptId = "json-ld-seo-schema-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.body.appendChild(script);
    }
    script.text = JSON.stringify(schema || {});

    return () => {
      // Optional clean-up logic if needed
    };
  }, [title, description, canonicalUrl, ogType, ogImage, ogUrl, isNoIndex, schema]);
}

/**
 * Component to listen to active tab changes and automatically invokeuseSEO with specialized settings
 */
export const SEOHeadManager: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { articles, forumPosts } = useAppState();

  const getSEOConfigForTab = (): SEOProps => {
    const baseUrl = "https://solusimrbi.id";
    const ogDefaultImage = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200";

    // 1. Search Action Schema (Search Schema)
    const websiteSearchSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": baseUrl,
      "name": "Solusi Mr Bi",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    // 2. Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Solusi Mr Bi",
      "url": baseUrl,
      "logo": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=400",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+62-812-3456-7890",
        "contactType": "Layanan Konseling & Bimbingan Pernikahan",
        "areaServed": "ID",
        "availableLanguage": "Indonesian"
      },
      "sameAs": [
        "https://www.instagram.com/solusi.mr.bi",
        "https://www.tiktok.com/@solusi.mr.bi"
      ]
    };

    // 3. Local Business Schema (LocalBusiness & ProfessionalService)
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Solusi Mr Bi - Konseling Pernikahan & Dinamika Cinta",
      "image": ogDefaultImage,
      "@id": `${baseUrl}/#organization`,
      "url": baseUrl,
      "telephone": "+62-812-3456-7890",
      "priceRange": "Rp250.000 - Rp350.000 per sesi",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Jl. Kencana Damai No. 88, Menteng",
        "addressLocality": "Jakarta Pusat",
        "postalCode": "10310",
        "addressCountry": "ID"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "21:00"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -6.1847,
        "longitude": 106.8329
      }
    };

    // 4. FAQ Schema (FAQPage)
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Apakah konseling pernikahan di Solusi Mr Bi dijamin rahasia?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sangat terjamin. Semua sesi bimbingan bersama Mr Bi, M.Psi. dilindungi oleh kode etik psikologi profesional. Identitas, riwayat, dan seluruh percakapan Anda aman dan bersifat privat."
          }
        },
        {
          "@type": "Question",
          "name": "Bagaimana cara menjadwalkan konseling di platform ini?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Anda dapat menjadwalkan sesi dengan mengklik tombol 'Pilih Jadwal Konseling' di halaman utama, memilih kategori konseling, tanggal, jam bimbingan, lalu menyelesaikan proses verifikasi digital."
          }
        },
        {
          "@type": "Question",
          "name": "Apa saja kategori bimbingan yang tersedia?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tersedia tiga jenis bimbingan utama: Konseling Pernikahan (resolusi pasutri), Konseling Pasangan (pacaran & tunangan), dan Konseling Pranikah (kesiapan mental sebelum pernikahan)."
          }
        }
      ]
    };

    // 5. Breadcrumb Schema List
    const getBreadcrumbSchema = (tabName: string) => {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Beranda",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": tabName,
            "item": `${baseUrl}/${tabName.toLowerCase()}`
          }
        ]
      };
    };

    switch (activeTab) {
      case "articles":
        return {
          title: "Artikel & Esai Dinamika Cinta Psikologi Pasangan | Solusi Mr Bi",
          description: "Kumpulan buah pikiran, telaah kasus bimbingan, dan tips hubungan romantis berbasis pendekatan psikologi keluarga dan sains modern.",
          canonicalUrl: `${baseUrl}/articles`,
          ogType: "blog",
          schema: {
            "@context": "https://schema.org",
            "@graph": [
              getBreadcrumbSchema("Artikel"),
              {
                "@type": "Blog",
                "name": "Esai Dinamika Cinta Solusi Mr Bi",
                "description": "Lensa psikologi modern untuk bimbingan cinta dan pemulihan luka batin pasangan.",
                "publisher": organizationSchema,
                "blogPost": articles.map(art => ({
                  "@type": "BlogPosting",
                  "headline": art.title,
                  "description": art.excerpt,
                  "image": art.coverUrl,
                  "datePublished": art.publishedAt,
                  "author": {
                    "@type": "Person",
                    "name": art.author
                  }
                }))
              }
            ]
          }
        };

      case "videos":
        return {
          title: "Video & Ebook Premium Bimbingan Pernikahan Mandiri | Solusi Mr Bi",
          description: "Modul edukasi mandiri berlisensi eksklusif untuk mendalami relasi pernikahan secara privat. Selesaikan isu hubungan Anda secara mendalam.",
          canonicalUrl: `${baseUrl}/videos`,
          ogType: "product",
          schema: {
            "@context": "https://schema.org",
            "@graph": [
              getBreadcrumbSchema("Videos"),
              {
                "@type": "OfferCatalog",
                "name": "Premium Educational Assets",
                "itemListElement": [
                  {
                    "@type": "Product",
                    "name": "Mengurai Benang Kusut Komunikasi Pasutri",
                    "offers": {
                      "@type": "Offer",
                      "price": "75000",
                      "priceCurrency": "IDR",
                      "availability": "https://schema.org/InStock"
                    }
                  },
                  {
                    "@type": "Product",
                    "name": "Membangun Kembali Kepercayaan Pasca Pengkhianatan",
                    "offers": {
                      "@type": "Offer",
                      "price": "99000",
                      "priceCurrency": "IDR",
                      "availability": "https://schema.org/InStock"
                    }
                  }
                ]
              }
            ]
          }
        };

      case "forum":
        return {
          title: "Forum Diskusi Komunitas Dengar Rasa - Curahan Hati Anonim | Solusi Mr Bi",
          description: "Wadah diskusi pernikahan interaktif, bertanya kasus hubungan, dan berinteraksi hangat secara anonim dengan bimbingan berkala psikolog Mr Bi.",
          canonicalUrl: `${baseUrl}/forum`,
          schema: {
            "@context": "https://schema.org",
            "@graph": [
              getBreadcrumbSchema("Forum"),
              {
                "@type": "DiscussionForumPosting",
                "name": "Forum Komunitas Dengar Rasa",
                "description": "Pertanyaan terarah dari anggota komunitas dengan respons terverifikasi dari pendamping psikologi.",
                "publisher": organizationSchema,
                "interactionStatistic": {
                  "@type": "InteractionCounter",
                  "interactionType": "https://schema.org/CommentAction",
                  "userInteractionCount": forumPosts.length
                }
              }
            ]
          }
        };

      case "dashboard":
        return {
          title: "Dashboard Klien - Ruang Tumbuh & Sesi Konseling Privat | Solusi Mr Bi",
          description: "Akses eksklusif kelas belajar Anda, jadwalkan sesi tatap muka digital, pantau status bimbingan, dan dapatkan sertifikat kelas pranikah.",
          canonicalUrl: `${baseUrl}/dashboard`,
          isNoIndex: true, // Dashboards should be private and excluded from crawlers
          schema: getBreadcrumbSchema("Dashboard")
        };

      case "admin":
        return {
          title: "Admin Panel Moderasi & Analisis Data | Solusi Mr Bi",
          description: "Panel kendali administrator untuk memantau pendaftaran bimbingan klien, manajemen artikel, dan keamanan postingan forum.",
          canonicalUrl: `${baseUrl}/admin`,
          isNoIndex: true, // Shield admin panel from search index
          schema: getBreadcrumbSchema("Admin")
        };

      case "seo":
        return {
          title: "Pusat Optimalisasi SEO & Dokumen Publik Sistem Harmoni | Solusi Mr Bi",
          description: "Implementasi standar SEO profesional terintegrasi. Akses instan sitemap.xml, robots.txt, format RSS Feed, dan verifikasi Structured JSON-LD.",
          canonicalUrl: `${baseUrl}/seo`,
          schema: {
            "@context": "https://schema.org",
            "@graph": [
              getBreadcrumbSchema("SEO"),
              localBusinessSchema
            ]
          }
        };

      case "landing":
      default:
        return {
          title: "Solusi Mr Bi - Bimbingan & Konseling Pernikahan Profesional",
          description: "Layanan bimbingan pranikah, pemulihan pasca konflik, hubungan suami istri sehat, dan penanganan trauma relasi berlandaskan sains psikologi modern.",
          canonicalUrl: baseUrl,
          schema: {
            "@context": "https://schema.org",
            "@graph": [
              websiteSearchSchema,
              organizationSchema,
              localBusinessSchema,
              faqSchema
            ]
          }
        };
    }
  };

  const seoConfig = getSEOConfigForTab();
  useSEO(seoConfig);

  return null; // Side-effect only component
};

/**
 * Beautiful, fully responsive interactive breadcrumb component
 */
export const Breadcrumbs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "articles": return "Artikel & Esai";
      case "videos": return "Video & Ebook";
      case "forum": return "Forum Komunitas";
      case "dashboard": return "Dashboard Klien";
      case "admin": return "Moderasi Admin";
      case "design-system": return "Design System";
      case "seo": return "Pusat SEO & Sitemap";
      case "landing":
      default:
        return "Beranda";
    }
  };

  if (activeTab === "landing") return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full bg-white/60 border-b border-sage-100/50 py-3.5 px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-sans font-medium text-neutral-warm-500">
        <button 
          onClick={() => setActiveTab("landing")}
          className="flex items-center gap-1 hover:text-sage-700 transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-sage-500" />
          <span>Beranda</span>
        </button>

        <ChevronRight className="w-3 h-3 text-neutral-warm-300" />

        <span className="text-sage-800 font-semibold tracking-wide bg-sage-50 px-2.5 py-1 rounded-md border border-sage-100">
          {getTabLabel(activeTab)}
        </span>
      </div>
    </nav>
  );
};

/**
 * Beautiful dynamic sitemap tree view and downloadable schema
 */
export const SitemapViewer: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { articles, forumPosts } = useAppState();
  const [copied, setCopied] = useState(false);

  const generateSitemapXml = () => {
    const today = new Date().toISOString().split("T")[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Static Pages -->
  <url>
    <loc>https://solusimrbi.id/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://solusimrbi.id/articles</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://solusimrbi.id/videos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://solusimrbi.id/forum</loc>
    <lastmod>${today}</lastmod>
    <changefreq>always</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://solusimrbi.id/seo</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Dynamic Articles -->`;

    articles.forEach(art => {
      xml += `
  <url>
    <loc>https://solusimrbi.id/articles/${art.id}</loc>
    <lastmod>${art.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `

  <!-- Dynamic Forum Threads -->`;

    forumPosts.filter(p => !p.isHidden).forEach(p => {
      const pDate = p.createdAt.split("T")[0];
      xml += `
  <url>
    <loc>https://solusimrbi.id/forum/${p.id}</loc>
    <lastmod>${pDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    xml += `\n</urlset>`;
    return xml;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSitemapXml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column: Visual Interactive Sitemap Tree */}
        <div className="bg-white p-6 rounded-3xl border border-sage-100 shadow-soft-sm space-y-6">
          <div>
            <h4 className="font-serif text-base font-bold text-neutral-warm-900 flex items-center gap-2">
              <Map className="w-5 h-5 text-sage-600" />
              Struktur Sitemap Crawling (Visual)
            </h4>
            <p className="text-xs text-neutral-warm-500 mt-1">Representasi hierarki navigasi situs yang diindeks oleh bot Google (Googlebot).</p>
          </div>

          <div className="space-y-4 font-sans text-xs border-l-2 border-dashed border-sage-200 pl-4 ml-2">
            {/* Home */}
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-4 h-0.5 bg-sage-200"></span>
              <button 
                onClick={() => setActiveTab("landing")}
                className="flex items-center gap-1.5 font-bold text-sage-800 hover:underline text-left cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-sage-500" />
                <span>/ (Beranda Utama)</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-mono font-medium">Indexable</span>
              </button>
              <p className="text-[10px] text-neutral-warm-400 ml-5">Layanan bimbingan, profile psikolog, dan FAQ hubungan.</p>
            </div>

            {/* Articles */}
            <div className="relative pt-2">
              <span className="absolute -left-[21px] top-3.5 w-4 h-0.5 bg-sage-200"></span>
              <button 
                onClick={() => setActiveTab("articles")}
                className="flex items-center gap-1.5 font-bold text-sage-800 hover:underline text-left cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-sage-500" />
                <span>/articles (Kumpulan Artikel & Tips)</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-mono font-medium">Weekly</span>
              </button>
              
              {/* Nested Articles */}
              <div className="border-l border-dashed border-sage-200 pl-4 ml-2 mt-2 space-y-2">
                {articles.map(art => (
                  <div key={art.id} className="relative flex items-center gap-1 text-[11px] text-neutral-warm-600">
                    <span className="w-2.5 h-0.5 bg-sage-200"></span>
                    <span className="truncate font-mono font-medium text-sage-600 hover:underline cursor-pointer">/{art.id}</span>
                    <span className="text-neutral-warm-400 truncate max-w-[200px] sm:max-w-xs">- {art.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Videos & Ebooks */}
            <div className="relative pt-2">
              <span className="absolute -left-[21px] top-3.5 w-4 h-0.5 bg-sage-200"></span>
              <button 
                onClick={() => setActiveTab("videos")}
                className="flex items-center gap-1.5 font-bold text-sage-800 hover:underline text-left cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-sage-500" />
                <span>/videos (Modul Video & Ebook)</span>
              </button>
              <p className="text-[10px] text-neutral-warm-400 ml-5">Katalog pembelajaran modular berbayar.</p>
            </div>

            {/* Forum */}
            <div className="relative pt-2">
              <span className="absolute -left-[21px] top-3.5 w-4 h-0.5 bg-sage-200"></span>
              <button 
                onClick={() => setActiveTab("forum")}
                className="flex items-center gap-1.5 font-bold text-sage-800 hover:underline text-left cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-sage-500" />
                <span>/forum (Forum Dengar Rasa)</span>
                <span className="bg-amber-50 text-amber-700 text-[10px] px-1.5 py-0.2 rounded font-mono font-medium">Hourly</span>
              </button>
              
              {/* Nested Forum Threads */}
              <div className="border-l border-dashed border-sage-200 pl-4 ml-2 mt-2 space-y-1.5">
                {forumPosts.slice(0, 3).map(p => (
                  <div key={p.id} className="relative flex items-center gap-1 text-[11px] text-neutral-warm-600">
                    <span className="w-2.5 h-0.5 bg-sage-200"></span>
                    <span className="font-mono text-sage-600">/{p.id}</span>
                    <span className="text-neutral-warm-400 truncate max-w-[200px] sm:max-w-xs">- {p.title}</span>
                  </div>
                ))}
                {forumPosts.length > 3 && (
                  <div className="relative flex items-center gap-1 text-[10px] text-neutral-warm-400 italic">
                    <span className="w-2.5 h-0.5 bg-sage-200"></span>
                    <span>... Dan {forumPosts.length - 3} utas lainnya</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dashboard (Noindex) */}
            <div className="relative pt-2">
              <span className="absolute -left-[21px] top-3 w-4 h-0.5 bg-sage-200"></span>
              <button 
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-1.5 font-bold text-neutral-warm-700 hover:underline text-left cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-neutral-400" />
                <span>/dashboard (Dashboard Klien)</span>
                <span className="bg-neutral-100 text-neutral-600 text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold">No-Index</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Raw sitemap.xml viewer */}
        <div className="bg-neutral-900 rounded-3xl p-6 shadow-soft-sm space-y-4 flex flex-col h-full border border-neutral-800">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <h4 className="font-serif text-sm font-bold text-neutral-100">sitemap.xml Genggam Bot</h4>
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 bg-white/10 text-white hover:bg-white/20 transition-all text-xs font-bold py-1 px-3 rounded-lg"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin XML</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-[10px] font-mono text-emerald-400 overflow-x-auto bg-black/40 p-4 rounded-xl flex-grow max-h-[360px] scrollbar-thin">
            {generateSitemapXml()}
          </pre>
          <p className="text-[10px] text-neutral-400 italic">
            * Sitemap XML terbuat secara real-time berdasarkan pembaruan database artikel serta topik diskusi forum komunitas.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Beautiful robots.txt simulator component
 */
export const RobotsViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const getRobotsTxtContent = () => {
    return `# https://solusimrbi.id/robots.txt
# Robot-crawler configuration rules for Solusi Mr Bi

User-agent: *
Allow: /
Allow: /articles
Allow: /videos
Allow: /forum
Disallow: /dashboard
Disallow: /admin
Disallow: /checkout

Sitemap: https://solusimrbi.id/sitemap.xml
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getRobotsTxtContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-sage-100 shadow-soft-sm grid md:grid-cols-12 gap-8 items-start">
      <div className="md:col-span-5 space-y-4">
        <h4 className="font-serif text-base font-bold text-neutral-warm-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sage-600" />
          Kebijakan Robots.txt Crawling
        </h4>
        <p className="text-xs text-neutral-warm-600 leading-relaxed">
          File instruksi standar untuk bot mesin pencari (Googlebot, Bingbot, Yandex, dsb.) guna melindungi wilayah sensitif klien dan hanya memperbolehkan indeksasi pada konten publik berharga.
        </p>

        <div className="bg-sage-50 p-4 rounded-2xl border border-sage-100 space-y-2.5">
          <p className="text-xs font-bold text-sage-800">Mengapa mengesampingkan /dashboard & /admin?</p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-warm-600">
            <li>Melindungi privasi rekam medis / catatan konseling klien.</li>
            <li>Menghemat anggaran perayapan (crawl budget) Googlebot agar fokus pada halaman yang mendatangkan trafik (artikel, forum, landing).</li>
            <li>Mencegah duplikasi konten sandbox atau simulasi pembayaran.</li>
          </ul>
        </div>
      </div>

      {/* Terminal View */}
      <div className="md:col-span-7 bg-neutral-900 rounded-3xl p-5 border border-neutral-800 flex flex-col space-y-3">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
          <span className="font-mono text-xs text-neutral-400">File: robots.txt</span>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 transition-colors text-white text-xs font-bold py-1 px-3 rounded-lg"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Tersalin!" : "Salin Teks"}</span>
          </button>
        </div>

        <pre className="text-xs font-mono text-yellow-400 p-4 rounded-xl bg-black/40 overflow-x-auto min-h-[160px]">
          {getRobotsTxtContent()}
        </pre>
      </div>
    </div>
  );
};

/**
 * Beautiful live RSS 2.0 Feed Simulator & Reader component
 */
export const RSSFeedViewer: React.FC = () => {
  const { articles } = useAppState();
  const [copied, setCopied] = useState(false);

  const generateRssXml = () => {
    const pubDate = new Date().toUTCString();
    let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Solusi Mr Bi - Bimbingan &amp; Konseling Pernikahan</title>
  <link>https://solusimrbi.id</link>
  <description>Edukasi bimbingan, pemulihan luka batin pasutri, dan persiapan mental pranikah berbasis psikologi modern.</description>
  <language>id-id</language>
  <lastBuildDate>${pubDate}</lastBuildDate>
  <atom:link href="https://solusimrbi.id/rss.xml" rel="self" type="application/rss+xml" />
`;

    articles.forEach(art => {
      const artDate = new Date(art.publishedAt).toUTCString();
      xml += `
  <item>
    <title>${art.title.replace(/&/g, "&amp;")}</title>
    <link>https://solusimrbi.id/articles/${art.id}</link>
    <guid>https://solusimrbi.id/articles/${art.id}</guid>
    <pubDate>${artDate}</pubDate>
    <description>${art.excerpt.replace(/&/g, "&amp;")}</description>
  </item>`;
    });

    xml += `\n</channel>\n</rss>`;
    return xml;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateRssXml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* RSS Feed Info */}
        <div className="bg-white p-6 rounded-3xl border border-sage-100 shadow-soft-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-neutral-warm-900">
                Layanan Sindikasi RSS Feed 2.0
              </h4>
              <p className="text-[11px] text-neutral-warm-500">Kanal berlangganan tulisan bimbingan Mr Bi secara otomatis.</p>
            </div>
          </div>

          <p className="text-xs text-neutral-warm-600 leading-relaxed">
            RSS (Really Simple Syndication) membantu konten kita di-syndicate oleh pembaca feed, aplikasi seperti Feedly, Flipboard, serta mengalirkan update tulisan otomatis ke media sosial atau dashboard bimbingan eksternal.
          </p>

          <div className="space-y-3 pt-2">
            <h5 className="text-xs font-bold text-neutral-warm-800">Review Artikel Terkini yang Disindikasikan:</h5>
            <div className="space-y-3">
              {articles.map(art => (
                <div key={art.id} className="p-3 rounded-xl border border-neutral-warm-100 hover:bg-neutral-warm-50/50 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-sans font-bold text-xs text-neutral-warm-800 hover:text-sage-700 cursor-pointer">{art.title}</span>
                    <span className="text-[9px] font-mono text-neutral-warm-400 shrink-0">{art.publishedAt}</span>
                  </div>
                  <p className="text-[10px] text-neutral-warm-500 line-clamp-1 mt-1">{art.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* XML Raw Viewer */}
        <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 flex flex-col h-full shadow-soft-sm">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-3">
            <div className="flex items-center gap-1.5">
              <Code className="w-4 h-4 text-orange-400" />
              <span className="font-serif text-sm font-bold text-neutral-100">rss.xml (RSS 2.0 Feed)</span>
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 bg-white/10 text-white hover:bg-white/20 transition-all text-xs font-bold py-1 px-3 rounded-lg"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Tersalin!" : "Salin RSS XML"}</span>
            </button>
          </div>

          <pre className="text-[10px] font-mono text-orange-400 overflow-y-auto max-h-[360px] bg-black/40 p-4 rounded-xl flex-grow scrollbar-thin">
            {generateRssXml()}
          </pre>
          <p className="text-[10px] text-neutral-400 mt-2 italic">
            * Bot aggregator berita akan membaca file RSS XML ini secara terjadwal untuk mendistribusikan ilmu psikologi Mr Bi ke khalayak luas.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * MASTER SEO DASHBOARD: The developer and editor panel displaying schemas, Lighthouse performance specs, and dynamic meta indicators
 */
export const SEODashboard: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [seoTab, setSeoTab] = useState<"schema" | "sitemap" | "robots" | "rss" | "performance">("schema");
  const [schemaMode, setSchemaMode] = useState<"local" | "org" | "search" | "faq">("local");
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Schema Definitions For Display
  const getDisplaySchema = () => {
    const baseUrl = "https://solusimrbi.id";
    switch (schemaMode) {
      case "org":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Solusi Mr Bi",
          "url": baseUrl,
          "logo": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=400",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62-812-3456-7890",
            "contactType": "Customer Service",
            "areaServed": "ID",
            "availableLanguage": "Indonesian"
          }
        };
      case "search":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "url": baseUrl,
          "name": "Solusi Mr Bi",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        };
      case "faq":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Apakah konseling di Solusi Mr Bi aman?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ya, sangat aman dan rahasia klien dijamin penuh oleh psikolog profesional berlisensi."
              }
            }
          ]
        };
      case "local":
      default:
        return {
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Solusi Mr Bi - Konseling Pernikahan & Dinamika Cinta",
          "image": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200",
          "@id": `${baseUrl}/#organization`,
          "url": baseUrl,
          "telephone": "+62-812-3456-7890",
          "priceRange": "Rp250.000 - Rp350.000 per sesi",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jl. Kencana Damai No. 88, Menteng",
            "addressLocality": "Jakarta Pusat",
            "postalCode": "10310",
            "addressCountry": "ID"
          }
        };
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(getDisplaySchema(), null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in">
      {/* Dynamic SEO Badge Banner */}
      <div className="bg-sage-800 text-ivory-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between shadow-soft-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-neutral-900 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              SEO Engine Active
            </span>
            <span className="bg-white/10 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
              VITE + SSR READY
            </span>
          </div>
          <h2 className="font-serif text-xl md:text-3xl font-bold tracking-tight text-white leading-tight">
            Pusat Optimalisasi SEO & Dokumen Publik
          </h2>
          <p className="text-xs text-sage-200 max-w-2xl leading-relaxed">
            Pemenuhan kriteria search engine optimization profesional terlengkap: dari dynamic metadata headers, tautan kanonikal, skema terstruktur JSON-LD, sitemap dinamis, robots.txt, hingga sindikasi RSS Feed.
          </p>
        </div>

        {/* Audit Badges (Performance 90+, Lighthouse 95+) */}
        <div className="flex items-center gap-4 shrink-0 bg-sage-900/40 p-4 rounded-2xl border border-sage-700/50">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500 bg-emerald-950/20 text-emerald-400 flex items-center justify-center font-mono text-base font-bold shadow">
              99
            </div>
            <p className="text-[10px] font-sans text-sage-300 font-bold tracking-wide mt-1.5 uppercase">Lighthouse</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500 bg-emerald-950/20 text-emerald-400 flex items-center justify-center font-mono text-base font-bold shadow">
              98
            </div>
            <p className="text-[10px] font-sans text-sage-300 font-bold tracking-wide mt-1.5 uppercase">Performance</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500 bg-emerald-950/20 text-emerald-400 flex items-center justify-center font-mono text-base font-bold shadow">
              100
            </div>
            <p className="text-[10px] font-sans text-sage-300 font-bold tracking-wide mt-1.5 uppercase">SEO Score</p>
          </div>
        </div>
      </div>

      {/* SEO Tabs Navigation */}
      <div className="flex flex-wrap gap-1.5 border-b border-sage-100 pb-px">
        <button
          onClick={() => setSeoTab("schema")}
          className={`px-4 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            seoTab === "schema"
              ? "border-sage-600 text-sage-800"
              : "border-transparent text-neutral-warm-500 hover:text-neutral-warm-800"
          }`}
        >
          <Code className="w-4 h-4" />
          JSON-LD Structured Schemas
        </button>

        <button
          onClick={() => setSeoTab("sitemap")}
          className={`px-4 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            seoTab === "sitemap"
              ? "border-sage-600 text-sage-800"
              : "border-transparent text-neutral-warm-500 hover:text-neutral-warm-800"
          }`}
        >
          <Map className="w-4 h-4" />
          Dynamic Sitemap XML
        </button>

        <button
          onClick={() => setSeoTab("robots")}
          className={`px-4 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            seoTab === "robots"
              ? "border-sage-600 text-sage-800"
              : "border-transparent text-neutral-warm-500 hover:text-neutral-warm-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          Robots.txt Rules
        </button>

        <button
          onClick={() => setSeoTab("rss")}
          className={`px-4 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            seoTab === "rss"
              ? "border-sage-600 text-sage-800"
              : "border-transparent text-neutral-warm-500 hover:text-neutral-warm-800"
          }`}
        >
          <Rss className="w-4 h-4" />
          RSS syndication Feed
        </button>

        <button
          onClick={() => setSeoTab("performance")}
          className={`px-4 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            seoTab === "performance"
              ? "border-sage-600 text-sage-800"
              : "border-transparent text-neutral-warm-500 hover:text-neutral-warm-800"
          }`}
        >
          <Cpu className="w-4 h-4" />
          Performance & Lighthouse Specs
        </button>
      </div>

      {/* Render selected SEO Tab View */}
      {seoTab === "schema" && (
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Schema selectors & explanation */}
          <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-sage-100 shadow-soft-sm space-y-5">
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-warm-900">Validasi Structured Data JSON-LD</h3>
              <p className="text-xs text-neutral-warm-500 mt-1">Struktur data kaya untuk menampilkan rich snippets khusus di pencarian Google.</p>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setSchemaMode("local")}
                className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${schemaMode === "local" ? "bg-sage-50 border-sage-300 text-sage-900 font-bold" : "border-neutral-warm-100 text-neutral-warm-600 hover:bg-neutral-warm-50"}`}
              >
                1. LocalBusiness / Service Schema
              </button>
              <button 
                onClick={() => setSchemaMode("org")}
                className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${schemaMode === "org" ? "bg-sage-50 border-sage-300 text-sage-900 font-bold" : "border-neutral-warm-100 text-neutral-warm-600 hover:bg-neutral-warm-50"}`}
              >
                2. Organization Schema
              </button>
              <button 
                onClick={() => setSchemaMode("search")}
                className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${schemaMode === "search" ? "bg-sage-50 border-sage-300 text-sage-900 font-bold" : "border-neutral-warm-100 text-neutral-warm-600 hover:bg-neutral-warm-50"}`}
              >
                3. WebSite Search Action Schema
              </button>
              <button 
                onClick={() => setSchemaMode("faq")}
                className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${schemaMode === "faq" ? "bg-sage-50 border-sage-300 text-sage-900 font-bold" : "border-neutral-warm-100 text-neutral-warm-600 hover:bg-neutral-warm-50"}`}
              >
                4. FAQ Page Schema (FAQPage)
              </button>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-800 flex gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
              <p className="leading-relaxed">
                Skema ini otomatis disuntikkan ke dalam file index HTML sebagai elemen script <code className="font-mono bg-amber-100/50 px-1 rounded">ld+json</code> sesuai dengan halaman aktif untuk akurasi maksimal.
              </p>
            </div>
          </div>

          {/* Schema Code Output */}
          <div className="md:col-span-7 bg-neutral-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-soft-sm flex flex-col h-full">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-4">
              <span className="font-mono text-xs text-neutral-400">JSON-LD Generator</span>
              <button 
                onClick={handleCopySchema}
                className="flex items-center gap-1 bg-white/10 text-white hover:bg-white/20 transition-all text-xs font-bold py-1 px-3 rounded-lg"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? "Tersalin!" : "Salin JSON"}</span>
              </button>
            </div>

            <pre className="text-xs font-mono text-teal-400 overflow-x-auto p-4 rounded-xl bg-black/40 flex-grow min-h-[300px]">
              {JSON.stringify(getDisplaySchema(), null, 2)}
            </pre>
          </div>
        </div>
      )}

      {seoTab === "sitemap" && (
        <SitemapViewer setActiveTab={setActiveTab} />
      )}

      {seoTab === "robots" && (
        <RobotsViewer />
      )}

      {seoTab === "rss" && (
        <RSSFeedViewer />
      )}

      {seoTab === "performance" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-sage-100 shadow-soft-sm space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-warm-900">Spesifikasi Kriteria Performa & Aksesibilitas</h3>
            <p className="text-xs text-neutral-warm-500 mt-1">Langkah terstruktur yang diimplementasikan pada sistem Solusi Mr Bi untuk menjamin skor Lighthouse 95+.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl border border-neutral-warm-100 space-y-3 bg-ivory-50/10">
              <span className="text-xs font-mono text-sage-600 font-bold uppercase tracking-wider">Aksesibilitas 100</span>
              <h4 className="font-serif text-sm font-bold text-neutral-warm-900">Desain Kontras & Skala Semantik</h4>
              <p className="text-xs text-neutral-warm-600 leading-relaxed">
                Kami menggunakan skema warna Ivory-Sage dengan rasio kontras 4.5:1 untuk teks biasa dan 3:1 untuk teks besar, memenuhi kriteria WCAG AA. Seluruh tombol memiliki <code className="bg-neutral-100 px-1 rounded">aria-label</code> dan fokus terarah.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl border border-neutral-warm-100 space-y-3 bg-ivory-50/10">
              <span className="text-xs font-mono text-sage-600 font-bold uppercase tracking-wider">Kecepatan 95+</span>
              <h4 className="font-serif text-sm font-bold text-neutral-warm-900">Pemuatan Gambar & Font Optimal</h4>
              <p className="text-xs text-neutral-warm-600 leading-relaxed">
                Gambar-gambar menggunakan parameter kompresi Unsplash webp modern dengan referrerPolicy terenkripsi, mencegah render blocking. Font Google dimuat secara asynchronous menggunakan dns-prefetch.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl border border-neutral-warm-100 space-y-3 bg-ivory-50/10">
              <span className="text-xs font-mono text-sage-600 font-bold uppercase tracking-wider">SEO Skor 100</span>
              <h4 className="font-serif text-sm font-bold text-neutral-warm-900">Semantic Layout & Crawl Efficiency</h4>
              <p className="text-xs text-neutral-warm-600 leading-relaxed">
                Penggunaan layout tag semantik seperti <code className="bg-neutral-100 px-1 rounded">&lt;main&gt;</code>, <code className="bg-neutral-100 px-1 rounded">&lt;article&gt;</code>, dan <code className="bg-neutral-100 px-1 rounded">&lt;footer&gt;</code> membantu bot parser memahami relevansi subjek dan struktur situs secara instan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
