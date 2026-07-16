import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../store";
import { PsychologyArticle } from "../types";
import { 
  createArticleServerAction, 
  updateArticleServerAction, 
  deleteArticleServerAction, 
  uploadToSupabaseStorage 
} from "../actions/articleActions";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Sparkles, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Folder, 
  Image as ImageIcon, 
  Globe, 
  FileText, 
  CheckCircle, 
  Clock, 
  Bold, 
  Italic, 
  Heading, 
  Link as LinkIcon, 
  Quote, 
  List as ListIcon, 
  Code,
  Upload,
  AlertCircle
} from "lucide-react";

export const ArticleCMS: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useAppState();

  // State definitions
  const [editorMode, setEditorMode] = useState<"list" | "create" | "edit">("list");
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  
  // Table search, pagination, and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Editor form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Pernikahan");
  const [newCategoryText, setNewCategoryText] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [coverUrl, setCoverUrl] = useState("");
  const [author, setAuthor] = useState("Mr Bi, M.Psi.");
  
  // SEO fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  // Editor worktab for mobile responsive view
  const [editorTab, setEditorTab] = useState<"edit" | "preview" | "seo">("edit");

  // Utilities states
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingBucket, setUploadingBucket] = useState<string | null>(null);
  const [autosaveTime, setAutosaveTime] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset covers gallery
  const PRESET_COVERS = [
    { name: "Pernikahan (Cincin)", url: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5c?auto=format&fit=crop&q=80&w=600" },
    { name: "Komunikasi (Pasangan)", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" },
    { name: "Terapeutik (Taman)", url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600" },
    { name: "Keintiman (Genggaman)", url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600" },
    { name: "Konseling (Diskusi)", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600" }
  ];

  // Dynamic list of categories for filters
  const allCategories = ["Semua", ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];
  const activeEditorCategories = Array.from(new Set(["Pernikahan", "Dinamika Cinta", "Seksologi", "Self-Care", ...articles.map((a) => a.category).filter(Boolean)]));

  // Auto-generate slug when title changes in creation mode
  useEffect(() => {
    if (editorMode === "create" && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
      );
    }
  }, [title, editorMode]);

  // Sync SEO Title and Meta Description by default
  useEffect(() => {
    if (title && !metaTitle) {
      setMetaTitle(`${title} - Solusi Mr Bi`);
    }
    if (excerpt && !metaDescription) {
      setMetaDescription(excerpt);
    }
  }, [title, excerpt, metaTitle, metaDescription]);

  // AUTOSAVE ENGINE: runs when in write mode every 15 seconds
  useEffect(() => {
    if (editorMode === "list") return;

    const timer = setInterval(() => {
      // Save form state as a draft in localStorage
      const draftState = {
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        status,
        coverUrl,
        author,
        metaTitle,
        metaDescription,
        metaKeywords,
        currentArticleId
      };
      localStorage.setItem("solusi_mr_bi_autosave_draft", JSON.stringify(draftState));
      
      const now = new Date();
      const timeString = now.toTimeString().split(" ")[0];
      setAutosaveTime(timeString);

      // Flash a brief auto-save badge
      setTimeout(() => setAutosaveTime((prev) => prev), 2000);
    }, 15000);

    return () => clearInterval(timer);
  }, [title, slug, excerpt, content, category, tags, status, coverUrl, author, metaTitle, metaDescription, metaKeywords, currentArticleId, editorMode]);

  // Load draft autosave if it exists
  const handleLoadAutosavedDraft = () => {
    const saved = localStorage.getItem("solusi_mr_bi_autosave_draft");
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setTitle(draft.title || "");
        setSlug(draft.slug || "");
        setExcerpt(draft.excerpt || "");
        setContent(draft.content || "");
        setCategory(draft.category || "Pernikahan");
        setTags(draft.tags || []);
        setStatus(draft.status || "draft");
        setCoverUrl(draft.coverUrl || "");
        setAuthor(draft.author || "Mr Bi, M.Psi.");
        setMetaTitle(draft.metaTitle || "");
        setMetaDescription(draft.metaDescription || "");
        setMetaKeywords(draft.metaKeywords || "");
        if (draft.currentArticleId) {
          setEditorMode("edit");
          setCurrentArticleId(draft.currentArticleId);
        } else {
          setEditorMode("create");
          setCurrentArticleId(null);
        }
        showNotification("success", "Autosave berhasil dipulihkan!");
      } catch (e) {
        showNotification("error", "Gagal memulihkan autosave.");
      }
    }
  };

  // Helper to show floating feedback notifications
  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Insert formatting markdown in the text area
  const insertMarkdown = (syntax: string, placeholder = "") => {
    const textarea = document.getElementById("markdown-editor-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || placeholder;

    let replacement = "";
    if (syntax === "bold") replacement = `**${selected}**`;
    else if (syntax === "italic") replacement = `*${selected}*`;
    else if (syntax === "heading") replacement = `### ${selected}`;
    else if (syntax === "link") replacement = `[${selected}](https://example.com)`;
    else if (syntax === "quote") replacement = `> ${selected}`;
    else if (syntax === "list") replacement = `- ${selected}`;
    else if (syntax === "code") replacement = `\`\`\`javascript\n${selected}\n\`\`\``;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setContent(newValue);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 3, start + 3 + selected.length);
    }, 50);
  };

  // Simulated File upload to Supabase Storage covers bucket
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBucket("covers");
    setUploadProgress(0);

    try {
      const publicUrl = await uploadToSupabaseStorage(file, "covers", (percent) => {
        setUploadProgress(percent);
      });
      setCoverUrl(publicUrl);
      showNotification("success", `File '${file.name}' berhasil diunggah ke Supabase Storage (bucket: covers)!`);
    } catch (err: any) {
      showNotification("error", `Gagal mengunggah file: ${err?.message}`);
    } finally {
      setTimeout(() => {
        setUploadProgress(null);
        setUploadingBucket(null);
      }, 1000);
    }
  };

  // Manage custom categories
  const handleAddCategory = () => {
    if (newCategoryText.trim()) {
      setCategory(newCategoryText.trim());
      setNewCategoryText("");
      setShowNewCategoryInput(false);
      showNotification("success", `Kategori '${newCategoryText}' terpilih!`);
    }
  };

  // Tags management
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/,/g, "");
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  // Editor Workspace Actions
  const handleNewArticle = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("Pernikahan");
    setTags([]);
    setStatus("draft");
    setCoverUrl("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600");
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setCurrentArticleId(null);
    setEditorMode("create");
    setEditorTab("edit");
  };

  const handleEditArticle = (art: PsychologyArticle) => {
    setCurrentArticleId(art.id);
    setTitle(art.title);
    setSlug(art.slug || art.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    setExcerpt(art.excerpt);
    setContent(art.content);
    setCategory(art.category);
    setTags(art.tags || []);
    setStatus(art.status || "published");
    setCoverUrl(art.coverUrl);
    setAuthor(art.author || "Mr Bi, M.Psi.");
    setMetaTitle(art.metaTitle || `${art.title} - Solusi Mr Bi`);
    setMetaDescription(art.metaDescription || art.excerpt);
    setMetaKeywords(art.metaKeywords || "");
    setEditorMode("edit");
    setEditorTab("edit");
  };

  // Submit form with Server Actions
  const handleSaveArticle = async () => {
    if (!title.trim()) {
      showNotification("error", "Judul artikel wajib diisi!");
      return;
    }
    if (!content.trim()) {
      showNotification("error", "Konten artikel wajib diisi!");
      return;
    }

    setIsSaving(true);
    
    const articlePayload: Omit<PsychologyArticle, "id"> = {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      status,
      coverUrl,
      author,
      metaTitle,
      metaDescription,
      metaKeywords,
      readTime: "1 Menit",
      publishedAt: status === "published" ? new Date().toISOString().split("T")[0] : ""
    };

    if (editorMode === "create") {
      const res = await createArticleServerAction(articlePayload, (finalPayload) => {
        addArticle(finalPayload);
      });
      if (res.success) {
        showNotification("success", res.message);
        // Clear autosave draft after successful create
        localStorage.removeItem("solusi_mr_bi_autosave_draft");
        setEditorMode("list");
      } else {
        showNotification("error", res.message);
      }
    } else if (editorMode === "edit" && currentArticleId) {
      const res = await updateArticleServerAction(currentArticleId, articlePayload, (id, fields) => {
        updateArticle(id, fields);
      });
      if (res.success) {
        showNotification("success", res.message);
        localStorage.removeItem("solusi_mr_bi_autosave_draft");
        setEditorMode("list");
      } else {
        showNotification("error", res.message);
      }
    }
    setIsSaving(false);
  };

  const handleDeleteArticle = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus artikel "${name}"?`)) {
      const res = await deleteArticleServerAction(id, (articleId) => {
        deleteArticle(articleId);
      });
      if (res.success) {
        showNotification("success", res.message);
      } else {
        showNotification("error", res.message);
      }
    }
  };

  // Simple Regex-based Markdown parser to preview formatted HTML
  const parseMarkdown = (markdownText: string) => {
    if (!markdownText) return "";
    let html = markdownText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*?)$/gm, "<h4 class='text-base font-bold font-serif text-neutral-warm-900 mt-4 mb-2'>$1</h4>");
    html = html.replace(/^## (.*?)$/gm, "<h3 class='text-lg font-bold font-serif text-neutral-warm-900 mt-6 mb-3 border-b border-sage-100 pb-1'>$1</h3>");
    html = html.replace(/^# (.*?)$/gm, "<h2 class='text-xl font-bold font-serif text-neutral-warm-900 mt-8 mb-4'>$1</h2>");

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Blockquotes
    html = html.replace(/^&gt; (.*?)$/gm, "<blockquote class='border-l-4 border-sage-400 pl-4 py-1 italic my-4 text-neutral-warm-600 bg-sage-50/50 rounded-r-md'>$1</blockquote>");

    // Code blocks
    html = html.replace(/```(.*?)\n([\s\S]*?)```/g, "<pre class='bg-neutral-warm-900 text-ivory-100 p-4 rounded-xl font-mono text-xs overflow-x-auto my-4'><code>$2</code></pre>");
    html = html.replace(/`(.*?)`/g, "<code class='bg-neutral-warm-100 px-1 py-0.5 rounded font-mono text-xs text-terracotta-600'>$1</code>");

    // Lists
    html = html.replace(/^\- (.*?)$/gm, "<li class='list-disc ml-5 my-1 text-neutral-warm-700'>$1</li>");

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank' class='text-sage-600 underline font-semibold'>$1</a>");

    // Paragraph paragraphs
    const paragraphs = html.split(/\n\n+/);
    return paragraphs
      .map((p) => {
        if (p.trim().startsWith("<h") || p.trim().startsWith("<blockquote") || p.trim().startsWith("<pre") || p.trim().startsWith("<li")) {
          return p;
        }
        return `<p class='body-comfort-sm text-neutral-warm-700 leading-relaxed my-3'>${p.replace(/\n/g, "<br />")}</p>`;
      })
      .join("");
  };

  // Filter & Search Logic
  const filteredArticles = articles.filter((art) => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      art.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.content && art.content.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === "Semua" || art.category === filterCategory;
    
    const isDraft = art.status === "draft";
    const matchesStatus = 
      filterStatus === "Semua" || 
      (filterStatus === "Published" && !isDraft) || 
      (filterStatus === "Draft" && isDraft);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasAutosave = localStorage.getItem("solusi_mr_bi_autosave_draft") !== null;

  return (
    <div id="cms-main-panel" className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 p-4 rounded-xl shadow-lg border text-xs font-semibold animate-scale-up
          ${notification.type === "success" 
            ? "bg-sage-50 text-sage-800 border-sage-200" 
            : "bg-terracotta-50 text-terracotta-800 border-terracotta-200"
          }`}
        >
          {notification.type === "success" ? <CheckCircle className="w-4 h-4 text-sage-600" /> : <AlertCircle className="w-4 h-4 text-terracotta-600" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sage-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-sage-600 uppercase font-bold tracking-wider">
              Supabase Storage & Server Actions: ACTIVE
            </span>
          </div>
          <h2 className="font-serif text-2xl text-neutral-warm-900 mt-1">CMS Pengelolaan Artikel</h2>
          <p className="text-xs text-neutral-warm-500 mt-1">
            Gunakan panel profesional ini untuk menulis draf, mengunggah media ke Supabase, mengoptimalkan SEO Google, dan meluncurkan esai literasi psikologi.
          </p>
        </div>

        {editorMode === "list" && (
          <div className="flex flex-wrap gap-2">
            {hasAutosave && (
              <button
                onClick={handleLoadAutosavedDraft}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 hover:border-sage-400"
                title="Pulihkan draf autosave terakhir yang belum disimpan"
              >
                <Clock className="w-3.5 h-3.5 text-sage-600" />
                <span>Pulihkan Autosave</span>
              </button>
            )}
            <button 
              onClick={handleNewArticle}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Artikel</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: DATA TABLE & FILTERS */}
      {editorMode === "list" ? (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-sage-100 shadow-soft-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-neutral-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Cari artikel (Judul, ringkasan, isi)..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="input-field pl-9"
              />
            </div>

            {/* Filter Category */}
            <div>
              <label className="text-[10px] font-mono text-neutral-warm-400 block mb-1">Kategori</label>
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                className="input-field py-1 text-xs"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <label className="text-[10px] font-mono text-neutral-warm-400 block mb-1">Status Publikasi</label>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="input-field py-1 text-xs"
              >
                <option value="Semua">Semua Status</option>
                <option value="Published">Published (Aktif)</option>
                <option value="Draft">Draft (Arsip/Draf)</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-3xl border border-sage-100 shadow-soft-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-sage-50/50 border-b border-sage-100 text-neutral-warm-500 font-sans uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-16">Cover</th>
                    <th className="py-3 px-4">Artikel / Ringkasan</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Tags</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArticles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-neutral-warm-400 italic">
                        Tidak ada artikel yang cocok dengan pencarian atau filter Anda.
                      </td>
                    </tr>
                  ) : (
                    paginatedArticles.map((art) => {
                      const isDraft = art.status === "draft";
                      return (
                        <tr key={art.id} className="border-b border-sage-50/50 hover:bg-ivory-50/30 transition-colors">
                          {/* Thumbnail */}
                          <td className="py-3 px-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-sage-100 shrink-0">
                              <img src={art.coverUrl} alt="" className="object-cover w-full h-full" />
                            </div>
                          </td>
                          {/* Title & Slug */}
                          <td className="py-3 px-4 max-w-sm">
                            <h4 className="font-serif text-sm font-bold text-neutral-warm-900 leading-snug hover:text-sage-600 transition-colors">
                              {art.title}
                            </h4>
                            <p className="text-[10px] font-mono text-neutral-warm-400 mt-1 truncate">
                              /{art.slug || art.id}
                            </p>
                            <p className="text-[11px] text-neutral-warm-500 line-clamp-1 mt-0.5 font-sans">
                              {art.excerpt}
                            </p>
                          </td>
                          {/* Category */}
                          <td className="py-3 px-4 font-medium text-neutral-warm-800">
                            <span className="flex items-center gap-1.5">
                              <Folder className="w-3.5 h-3.5 text-sage-400 shrink-0" />
                              {art.category}
                            </span>
                          </td>
                          {/* Tags */}
                          <td className="py-3 px-4 max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {art.tags && art.tags.length > 0 ? (
                                art.tags.map((tg, idx) => (
                                  <span key={idx} className="bg-sage-50 text-sage-700 px-1.5 py-0.5 rounded text-[9px] font-medium font-sans">
                                    #{tg}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-neutral-warm-400 italic">-</span>
                              )}
                            </div>
                          </td>
                          {/* Status */}
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                              ${isDraft 
                                ? "bg-terracotta-100 text-terracotta-800" 
                                : "bg-sage-100 text-sage-800"}`}
                            >
                              {isDraft ? "DRAFT" : "PUBLISHED"}
                            </span>
                            {art.publishedAt && (
                              <p className="text-[9px] text-neutral-warm-400 font-mono mt-1">{art.publishedAt}</p>
                            )}
                          </td>
                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditArticle(art)}
                                className="p-1.5 text-neutral-warm-600 hover:text-sage-700 hover:bg-sage-50 rounded-lg cursor-pointer"
                                title="Edit Artikel"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.id, art.title)}
                                className="p-1.5 text-neutral-warm-400 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-lg cursor-pointer"
                                title="Hapus Artikel"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-sage-50/30 px-6 py-4 border-t border-sage-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-warm-500 font-mono">
                Menampilkan {filteredArticles.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredArticles.length)} dari {filteredArticles.length} artikel
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-1.5 rounded-lg border border-sage-200 bg-white text-neutral-warm-600 hover:bg-sage-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold px-3 py-1 font-sans text-neutral-warm-800">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1.5 rounded-lg border border-sage-200 bg-white text-neutral-warm-600 hover:bg-sage-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: ARTICLE WRITING & PREVIEW EDITOR WORKSPACE */
        <div className="space-y-6">
          {/* Editor Workspace Sub-Header */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-sage-100 shadow-soft-sm">
            <button
              onClick={() => {
                if (confirm("Ada perubahan yang mungkin belum Anda simpan. Kembali ke daftar?")) {
                  setEditorMode("list");
                }
              }}
              className="btn-secondary text-xs px-3 py-1.5 self-start"
            >
              ← Kembali ke Daftar
            </button>

            {/* Workplace tabs for mobile split workspace */}
            <div className="flex p-0.5 bg-sage-50 rounded-xl border border-sage-100 shrink-0 self-center">
              <button
                onClick={() => setEditorTab("edit")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1
                  ${editorTab === "edit" ? "bg-white text-sage-800 shadow-soft-sm" : "text-neutral-warm-500 hover:text-neutral-warm-800"}`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setEditorTab("preview")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1
                  ${editorTab === "preview" ? "bg-white text-sage-800 shadow-soft-sm" : "text-neutral-warm-500 hover:text-neutral-warm-800"}`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau Live</span>
              </button>
              <button
                onClick={() => setEditorTab("seo")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1
                  ${editorTab === "seo" ? "bg-white text-sage-800 shadow-soft-sm" : "text-neutral-warm-500 hover:text-neutral-warm-800"}`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Optimasi SEO</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Autosaved Indicator */}
              {autosaveTime && (
                <span className="text-[10px] text-sage-600 font-mono bg-sage-50 px-2.5 py-1 rounded-md animate-fade-in flex items-center gap-1 border border-sage-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-ping"></span>
                  <span>Autosaved {autosaveTime}</span>
                </span>
              )}

              <button
                onClick={handleSaveArticle}
                disabled={isSaving}
                className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5 cursor-pointer"
              >
                {isSaving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{editorMode === "create" ? "Publikasikan" : "Simpan Perubahan"}</span>
              </button>
            </div>
          </div>

          {/* SPLIT WORKSPACE: LEFT EDITOR, RIGHT PREVIEW (DESKTOP) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: CORE EDITING FORM */}
            <div className={`space-y-6 lg:col-span-7 ${editorTab === "edit" ? "block" : "hidden lg:block"}`}>
              <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-soft-sm space-y-4">
                <h3 className="font-serif text-base text-neutral-warm-900 border-b border-sage-50 pb-2">
                  1. Informasi Konten
                </h3>
                
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">Judul Artikel</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Seni Membangun Batasan Emosi yang Sehat"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field text-sm font-serif font-semibold"
                  />
                </div>

                {/* Slug and Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">Slug URL</label>
                    <div className="flex gap-1.5">
                      <span className="bg-sage-50 border border-sage-200 text-neutral-warm-500 px-2 rounded-xl text-xs flex items-center select-none">
                        /
                      </span>
                      <input 
                        type="text" 
                        placeholder="seni-membangun-batasan"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                        className="input-field text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">Penulis</label>
                    <input 
                      type="text" 
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">Ringkasan Singkat (Excerpt)</label>
                  <textarea 
                    rows={2}
                    placeholder="Satu atau dua kalimat yang menggambarkan artikel ini di daftar list..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="input-field text-xs font-sans"
                  />
                </div>

                {/* Category selection and creation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">Kategori</label>
                    {showNewCategoryInput ? (
                      <div className="flex gap-1.5">
                        <input 
                          type="text" 
                          placeholder="Kategori baru..."
                          value={newCategoryText}
                          onChange={(e) => setNewCategoryText(e.target.value)}
                          className="input-field text-xs"
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                        />
                        <button
                          onClick={handleAddCategory}
                          className="bg-sage-500 hover:bg-sage-600 text-white px-3 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Pilih
                        </button>
                        <button
                          onClick={() => setShowNewCategoryInput(false)}
                          className="border border-neutral-warm-200 px-2.5 rounded-xl text-xs hover:bg-neutral-warm-50 cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="input-field text-xs"
                        >
                          {activeEditorCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setShowNewCategoryInput(true)}
                          className="border border-sage-200 hover:border-sage-400 px-2.5 rounded-xl text-xs text-sage-700 flex items-center justify-center cursor-pointer"
                          title="Tambah Kategori Baru"
                        >
                          + Baru
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Status Toggle */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">Status Publikasi</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStatus("draft")}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer
                          ${status === "draft" 
                            ? "bg-terracotta-50 border-terracotta-300 text-terracotta-700 shadow-soft-sm" 
                            : "bg-white border-neutral-warm-200 text-neutral-warm-600 hover:bg-neutral-warm-50"
                          }`}
                      >
                        Draft (Draf)
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus("published")}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer
                          ${status === "published" 
                            ? "bg-sage-50 border-sage-300 text-sage-700 shadow-soft-sm" 
                            : "bg-white border-neutral-warm-200 text-neutral-warm-600 hover:bg-neutral-warm-50"
                          }`}
                      >
                        Publish (Tayang)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tags management */}
                <div>
                  <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">
                    Tags / Label (Tekan Enter atau Koma untuk menambah)
                  </label>
                  <div className="border border-neutral-warm-200 focus-within:border-sage-400 bg-white rounded-xl p-1.5 flex flex-wrap gap-1.5 items-center">
                    {tags.map((tg, idx) => (
                      <span key={idx} className="bg-sage-100 text-sage-800 pl-2.5 pr-1.5 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <span>#{tg}</span>
                        <button 
                          onClick={() => removeTag(idx)}
                          className="hover:bg-sage-200 text-sage-600 hover:text-sage-800 rounded-full w-3.5 h-3.5 text-[9px] font-bold flex items-center justify-center shrink-0"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text"
                      placeholder={tags.length === 0 ? "Ketik tag lalu enter..." : ""}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="border-none outline-none focus:ring-0 p-1 flex-grow text-xs min-w-[120px] bg-transparent text-neutral-warm-800"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: FEATURED COVER MEDIA */}
              <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-soft-sm space-y-4">
                <div className="flex justify-between items-center border-b border-sage-50 pb-2">
                  <h3 className="font-serif text-base text-neutral-warm-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4.5 h-4.5 text-sage-600" />
                    <span>2. Gambar Sampul (Featured Image)</span>
                  </h3>
                  <span className="bg-sage-100 text-sage-800 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Supabase Bucket: covers
                  </span>
                </div>

                {/* Upload or enter URL */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">URL Gambar Sampul</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan URL gambar Unsplash atau tautan luar..."
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      className="input-field text-xs font-mono"
                    />
                  </div>

                  {/* Supabase Storage drag & drop file uploader */}
                  <div className="border-2 border-dashed border-sage-200 hover:border-sage-400 bg-sage-50/20 rounded-2xl p-6 text-center transition-colors relative">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {uploadProgress !== null && uploadingBucket === "covers" ? (
                      <div className="space-y-2 py-3">
                        <div className="flex justify-between items-center text-xs text-sage-700 max-w-xs mx-auto">
                          <span className="font-semibold">Mengunggah ke Supabase...</span>
                          <span className="font-mono">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-sage-100 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                          <div 
                            className="bg-sage-500 h-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-8 h-8 text-sage-500 mx-auto" />
                        <p className="text-xs font-semibold text-neutral-warm-800">
                          Klik untuk unggah atau seret file gambar ke sini
                        </p>
                        <p className="text-[10px] text-neutral-warm-400">
                          PNG, JPG, WebP (Maksimal 10MB) - Otomatis disimpan ke folder storage Supabase
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Preset Covers Gallery Carousel */}
                  <div>
                    <p className="text-[10px] font-semibold text-neutral-warm-500 uppercase tracking-wider mb-2">
                      Atau pilih dari galeri terapi Mr Bi:
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_COVERS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCoverUrl(preset.url)}
                          className={`relative h-14 rounded-xl overflow-hidden border transition-all cursor-pointer group
                            ${coverUrl === preset.url ? "border-sage-500 ring-2 ring-sage-200" : "border-transparent opacity-75 hover:opacity-100"}`}
                          title={preset.name}
                        >
                          <img src={preset.url} alt="" className="object-cover w-full h-full" />
                          <div className="absolute inset-0 bg-neutral-warm-900/10 group-hover:bg-transparent transition-colors"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: MARKDOWN RICH TEXT WORKSPACE */}
              <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-soft-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-sage-50 pb-2">
                  <h3 className="font-serif text-base text-neutral-warm-900 flex items-center gap-1.5">
                    <Sparkles className="w-4.5 h-4.5 text-sage-600" />
                    <span>3. Editor Markdown / Rich Text</span>
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-warm-400">
                    Mendukung live editor split-view & shortcut pemformatan
                  </span>
                </div>

                {/* Formatting Rich Text Toolbar */}
                <div className="flex flex-wrap gap-1 p-1 bg-sage-50 rounded-xl border border-sage-100">
                  <button 
                    type="button" 
                    onClick={() => insertMarkdown("bold", "teks tebal")}
                    className="p-1.5 text-neutral-warm-600 hover:text-sage-800 hover:bg-white rounded-lg transition-all"
                    title="Tebal (Ctrl+B)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertMarkdown("italic", "teks miring")}
                    className="p-1.5 text-neutral-warm-600 hover:text-sage-800 hover:bg-white rounded-lg transition-all"
                    title="Miring (Ctrl+I)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertMarkdown("heading", "Tajuk Utama")}
                    className="p-1.5 text-neutral-warm-600 hover:text-sage-800 hover:bg-white rounded-lg transition-all"
                    title="Header 3"
                  >
                    <Heading className="w-4 h-4" />
                  </button>
                  <span className="w-px h-6 bg-sage-200/60 self-center"></span>
                  <button 
                    type="button" 
                    onClick={() => insertMarkdown("link", "Deskripsi Tautan")}
                    className="p-1.5 text-neutral-warm-600 hover:text-sage-800 hover:bg-white rounded-lg transition-all"
                    title="Sisipkan Link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertMarkdown("quote", "Kutipan Penting")}
                    className="p-1.5 text-neutral-warm-600 hover:text-sage-800 hover:bg-white rounded-lg transition-all"
                    title="Blok Kutipan"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertMarkdown("list", "Butir List")}
                    className="p-1.5 text-neutral-warm-600 hover:text-sage-800 hover:bg-white rounded-lg transition-all"
                    title="Poin List"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertMarkdown("code", "Kode block")}
                    className="p-1.5 text-neutral-warm-600 hover:text-sage-800 hover:bg-white rounded-lg transition-all"
                    title="Blok Kode"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                </div>

                {/* Large Code Editor Text Area */}
                <div>
                  <textarea
                    id="markdown-editor-textarea"
                    rows={15}
                    placeholder="Tulis materi bimbingan atau artikel di sini menggunakan markdown..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="input-field font-mono text-xs leading-relaxed p-4 bg-neutral-warm-50/30 text-neutral-warm-900 border border-neutral-warm-200 focus:border-sage-500 rounded-2xl resize-y"
                  />
                  <div className="flex justify-between items-center text-[10px] text-neutral-warm-400 font-mono mt-1.5 px-1">
                    <span>{content.length} karakter</span>
                    <span>{content.split(/\s+/).filter(Boolean).length} kata</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MIDDLE/RIGHT COLUMN: LIVE FORMATTED PREVIEW VIEW */}
            <div className={`space-y-6 lg:col-span-5 ${editorTab === "preview" ? "block" : "hidden lg:block"}`}>
              <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-soft-sm space-y-4 sticky top-6">
                <h3 className="font-serif text-base text-neutral-warm-900 border-b border-sage-50 pb-2 flex items-center justify-between">
                  <span>Pratinjau Artikel di Website</span>
                  <span className="bg-sage-100 text-sage-800 font-mono text-[9px] px-2 py-0.5 rounded">LIVE PREVIEW</span>
                </h3>

                {/* Simulated Article Header Card */}
                <div className="space-y-4">
                  {/* Image preview */}
                  <div className="relative h-44 w-full bg-neutral-warm-100 rounded-xl overflow-hidden border border-sage-100">
                    {coverUrl ? (
                      <img src={coverUrl} alt="" className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-warm-400">
                        <ImageIcon className="w-8 h-8 stroke-1" />
                        <span className="text-[10px] font-mono mt-1">Belum ada cover</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-sage-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-sans">
                      {category}
                    </span>
                  </div>

                  {/* Title and stats */}
                  <div>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-warm-400 font-mono">
                      <span>Penulis: {author}</span>
                      <span>•</span>
                      <span>Tanggal: {status === "published" ? new Date().toISOString().split("T")[0] : "(Belum Terbit)"}</span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-neutral-warm-900 mt-1 leading-snug">
                      {title || "Judul Artikel Baru"}
                    </h2>
                    {excerpt && (
                      <p className="font-serif italic text-xs text-sage-700 mt-2 bg-sage-50/50 p-2.5 border-l-2 border-sage-300 rounded-r-md">
                        "{excerpt}"
                      </p>
                    )}
                  </div>

                  {/* Rendered Live Markdown Body */}
                  <div className="border-t border-sage-100 pt-3 max-h-[350px] overflow-y-auto pr-1">
                    {content ? (
                      <div 
                        className="prose prose-sm max-w-none text-xs leading-relaxed text-neutral-warm-700 space-y-3"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
                      />
                    ) : (
                      <p className="text-xs text-neutral-warm-400 italic py-6 text-center">
                        Mulai mengetik di kolom editor untuk melihat pratinjau artikel terformat secara tulus di sini.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SEO OPTIMIZATION DRAWER VIEW */}
            <div className={`space-y-6 lg:col-span-12 ${editorTab === "seo" ? "block" : "hidden"}`}>
              <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-soft-sm space-y-6">
                <div>
                  <h3 className="font-serif text-base text-neutral-warm-900 border-b border-sage-50 pb-2">
                    Panel Optimasi SEO Google (Search Engine Optimization)
                  </h3>
                  <p className="text-xs text-neutral-warm-500 mt-1">
                    Pastikan esai atau materi bimbingan Mr Bi mudah ditemukan oleh pasangan Indonesia di mesin telusur Google dengan melengkapi kolom optimasi di bawah ini.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* SEO Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">
                        Meta Title (Judul di Google)
                      </label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Mengatasi Masalah Mertua & Komunikasi - Solusi Mr Bi"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="input-field text-xs"
                      />
                      <p className="text-[10px] text-neutral-warm-400 mt-1">
                        Panjang ideal: 50-60 karakter. Karakter saat ini: <span className="font-semibold">{metaTitle.length}</span>
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">
                        Meta Description (Ringkasan di Google Search)
                      </label>
                      <textarea 
                        rows={3}
                        placeholder="Masukkan deskripsi singkat untuk pencarian Google..."
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="input-field text-xs"
                      />
                      <p className="text-[10px] text-neutral-warm-400 mt-1">
                        Panjang ideal: 120-160 karakter. Karakter saat ini: <span className="font-semibold">{metaDescription.length}</span>
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-warm-800 block mb-1">
                        Meta Keywords (Fokus Kata Kunci)
                      </label>
                      <input 
                        type="text" 
                        placeholder="Contoh: mertua ikut campur, konseling pranikah, mr bi psikolog"
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                        className="input-field text-xs"
                      />
                      <p className="text-[10px] text-neutral-warm-400 mt-1">
                        Pisahkan dengan koma untuk membantu mesin telusur merayapi topik utama.
                      </p>
                    </div>
                  </div>

                  {/* Live Google Snippet Simulator */}
                  <div className="space-y-3 bg-neutral-warm-50/50 p-6 rounded-2xl border border-neutral-warm-200">
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-neutral-warm-500 mb-2">
                      Live Google Search Snippet Simulator:
                    </h4>

                    <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-1">
                      {/* Google URL */}
                      <div className="text-[11px] font-sans text-neutral-500 flex items-center gap-1">
                        <span>https://solusimrbi.com</span>
                        <span>›</span>
                        <span>artikel</span>
                        <span>›</span>
                        <span className="text-neutral-700 truncate max-w-[120px]">{slug || "seni-relasi"}</span>
                      </div>
                      
                      {/* Google Title */}
                      <h4 className="text-lg font-sans text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug">
                        {metaTitle || `${title || "Judul Artikel"} - Solusi Mr Bi`}
                      </h4>

                      {/* Google Description */}
                      <p className="text-xs font-sans text-[#4d5156] leading-relaxed">
                        <span className="text-neutral-400">16 Jul 2026 — </span>
                        {metaDescription || (excerpt || "Deskripsi ringkasan Google akan otomatis merender kutipan di sini begitu Anda menulis ringkasan esai secara tulus di editor.")}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-warm-500 leading-relaxed space-y-1">
                      <p className="font-semibold text-sage-800">Tips Optimasi SEO:</p>
                      <p>✓ Letakkan kata kunci fokus pada awal **Judul Artikel** dan **Meta Title**.</p>
                      <p>✓ Jaga panjang deskripsi antara 120 hingga 160 karakter agar tidak terpotong oleh Google.</p>
                      <p>✓ Buat kalimat ringkasan yang menarik agar tingkat klik (CTR) pembaca meningkat.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
