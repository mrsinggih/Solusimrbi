import React from "react";
import { Heart, Sparkles, Mail, Shield, CheckCircle } from "lucide-react";
import { BRAND_NAME, BRAND_TAGLINE } from "../constants";

export const Footer: React.FC = () => {
  return (
    <footer id="footer-main" className="w-full bg-sage-900 text-sage-200 py-16 border-t border-sage-950 mt-18">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        
        {/* Company Pitch */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sage-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-ivory-50 fill-white/10" />
            </div>
            <span className="font-serif font-bold text-lg text-ivory-100">{BRAND_NAME}</span>
          </div>
          <p className="font-sans text-sm text-sage-300 leading-relaxed max-w-sm">
            {BRAND_TAGLINE}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-sage-400">
            <Shield className="w-4 h-4 text-ivory-500" />
            <span>Kerahasiaan klien 100% aman berlandaskan kode etik psikologi Indonesia.</span>
          </div>
        </div>

        {/* Dynamic SEO Sitemaps */}
        <div>
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-ivory-100 mb-4">Layanan Utama</h4>
          <ul className="space-y-2 text-xs text-sage-300 font-sans">
            <li><a href="#counseling" className="hover:text-ivory-100 transition-colors">Konseling Pernikahan</a></li>
            <li><a href="#counseling" className="hover:text-ivory-100 transition-colors">Konseling Pasangan</a></li>
            <li><a href="#counseling" className="hover:text-ivory-100 transition-colors">Konseling Pranikah</a></li>
            <li><a href="#ebooks" className="hover:text-ivory-100 transition-colors">Ebook Premium</a></li>
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-ivory-100 mb-4">Kontak & Alamat</h4>
          <ul className="space-y-2 text-xs text-sage-300 font-sans">
            <li>Menteng, Jakarta Pusat</li>
            <li>support@solusimrbi.id</li>
            <li>+62 812-3456-7890</li>
            <li className="pt-2">
              <span className="inline-flex items-center gap-1 bg-sage-800 text-ivory-300 px-2 py-1 rounded text-[10px] font-mono border border-sage-700">
                <CheckCircle className="w-3 h-3 text-sage-400" />
                Active Sandbox Mode
              </span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-sage-800 text-center text-xs text-sage-400 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 {BRAND_NAME}. Dipersembahkan untuk harmoni cinta Indonesia.</p>
        <p className="font-mono text-[10px] text-sage-500">
          Built with Next.js architecture on React/Vite Sandbox
        </p>
      </div>
    </footer>
  );
};
