import React from "react";
import { Heart, Sparkles, User, ShieldAlert, BookOpen } from "lucide-react";
import { useAppState } from "../store";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, setCurrentUser } = useAppState();

  const toggleUserRole = () => {
    if (!currentUser) return;
    const newRole = currentUser.role === "client" ? "admin" : "client";
    setCurrentUser({
      ...currentUser,
      role: newRole,
      fullName: newRole === "client" ? "Clara Salsabila" : "Mr Bi, M.Psi.",
      avatarUrl: newRole === "client" 
        ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
    });
  };

  return (
    <nav id="navbar-main" className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-sage-100/60 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button 
          onClick={() => setActiveTab("landing")}
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-sage-500 flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 text-ivory-50 fill-white/10" />
          </div>
          <div>
            <span className="font-serif font-bold text-base text-neutral-warm-900 block leading-tight">Solusi Mr Bi</span>
            <span className="text-[9px] font-sans tracking-widest text-sage-600 uppercase block">Psikologi Hubungan</span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1.5">
          <button 
            onClick={() => setActiveTab("landing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all cursor-pointer ${activeTab === "landing" ? "bg-sage-100 text-sage-800" : "text-neutral-warm-600 hover:bg-sage-50/50 hover:text-sage-800"}`}
          >
            Layanan
          </button>
          <button 
            onClick={() => setActiveTab("articles")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all cursor-pointer ${activeTab === "articles" ? "bg-sage-100 text-sage-800" : "text-neutral-warm-600 hover:bg-sage-50/50 hover:text-sage-800"}`}
          >
            Artikel
          </button>
          <button 
            onClick={() => setActiveTab("videos")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all cursor-pointer ${activeTab === "videos" ? "bg-sage-100 text-sage-800" : "text-neutral-warm-600 hover:bg-sage-50/50 hover:text-sage-800"}`}
          >
            Video & Ebook
          </button>
          <button 
            onClick={() => setActiveTab("forum")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all cursor-pointer ${activeTab === "forum" ? "bg-sage-100 text-sage-800" : "text-neutral-warm-600 hover:bg-sage-50/50 hover:text-sage-800"}`}
          >
            Forum Komunitas
          </button>
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all cursor-pointer ${activeTab === "dashboard" ? "bg-sage-100 text-sage-800" : "text-neutral-warm-600 hover:bg-sage-50/50 hover:text-sage-800"}`}
          >
            Dashboard Klien
          </button>
          {currentUser?.role === "admin" && (
            <button 
              onClick={() => setActiveTab("admin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all cursor-pointer ${activeTab === "admin" ? "bg-terracotta-100 text-terracotta-800" : "text-neutral-warm-600 hover:bg-sage-50/50 hover:text-sage-800"}`}
            >
              Admin Panel
            </button>
          )}
          <button 
            onClick={() => setActiveTab("seo")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${activeTab === "seo" ? "bg-sage-600 text-white" : "text-neutral-warm-500 hover:bg-sage-50"}`}
          >
            SEO & Sitemap
          </button>
          <button 
            onClick={() => setActiveTab("design-system")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeTab === "design-system" ? "bg-sage-800 text-ivory-50" : "text-neutral-warm-500 hover:bg-sage-50"}`}
          >
            Design System
          </button>
        </div>

        {/* User Identity Switcher (Sandbox Utility for Testing Roles) */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-[11px] font-sans font-bold text-neutral-warm-800 leading-none">{currentUser?.fullName}</span>
            <button 
              onClick={toggleUserRole}
              className="text-[9px] font-mono text-terracotta-600 hover:underline cursor-pointer"
            >
              Switch Role to {currentUser?.role === "client" ? "Admin" : "Client"}
            </button>
          </div>
          <img 
            src={currentUser?.avatarUrl} 
            alt={currentUser?.fullName}
            className="w-8 h-8 rounded-full border border-sage-200/50 shadow-soft-sm"
          />
        </div>
      </div>
    </nav>
  );
};
