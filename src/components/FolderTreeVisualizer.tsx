import React, { useState } from "react";
import { Folder, File, ChevronRight, ChevronDown, CheckCircle, Info } from "lucide-react";

interface TreeNodeProps {
  name: string;
  type: "folder" | "file";
  children?: TreeNodeProps[];
  desc?: string;
}

const NEXT_JS_ARCHITECTURE: TreeNodeProps[] = [
  {
    name: "solusi-mr-bi-app",
    type: "folder",
    children: [
      {
        name: "public",
        type: "folder",
        desc: "Aset statis publik (Logo Mr Bi, ebook PDFs, dan thumbnail video)",
        children: [
          { name: "favicon.ico", type: "file" },
          { name: "robots.txt", type: "file", desc: "Instruksi crawling ramah SEO" },
          { name: "sitemap.xml", type: "file", desc: "Peta situs bimbingan dinamis" },
        ],
      },
      {
        name: "src",
        type: "folder",
        children: [
          {
            name: "app",
            type: "folder",
            desc: "Next.js 15 App Router - Routing System",
            children: [
              { name: "layout.tsx", type: "file", desc: "Global layout dengan font Playfair & Inter" },
              { name: "page.tsx", type: "file", desc: "Landing page utama Solusi Mr Bi" },
              {
                name: "api",
                type: "folder",
                desc: "Serverless Route Handlers",
                children: [
                  { name: "midtrans-webhook", type: "folder", children: [{ name: "route.ts", type: "file", desc: "Webhook callback Midtrans" }] },
                  { name: "counseling", type: "folder", children: [{ name: "route.ts", type: "file", desc: "API CRUD jadwal bimbingan" }] },
                ],
              },
              {
                name: "dashboard",
                type: "folder",
                desc: "Client Private Dashboard",
                children: [
                  { name: "page.tsx", type: "file", desc: "Tinjauan sesi konseling & unduhan ebook" },
                  { name: "layout.tsx", type: "file", desc: "Sidebar bimbingan khusus klien" },
                ],
              },
              {
                name: "admin",
                type: "folder",
                desc: "Super Admin Management Panel",
                children: [
                  { name: "page.tsx", type: "file" },
                  { name: "layout.tsx", type: "file" },
                ],
              },
            ],
          },
          {
            name: "components",
            type: "folder",
            desc: "Atomic Reusable Components (Tanpa terikat fitur spesifik)",
            children: [
              { name: "Navbar.tsx", type: "file" },
              { name: "Footer.tsx", type: "file" },
              { name: "Breadcrumbs.tsx", type: "file" },
              { name: "SeoMeta.tsx", type: "file" },
            ],
          },
          {
            name: "features",
            type: "folder",
            desc: "Domain-Driven Modules (Bisnis Logik & UI Terisolasi)",
            children: [
              {
                name: "counseling",
                type: "folder",
                children: [
                  { name: "BookingForm.tsx", type: "file", desc: "Formulir booking slot Midtrans" },
                  { name: "SessionCard.tsx", type: "file" },
                ],
              },
              {
                name: "articles",
                type: "folder",
                children: [
                  { name: "ArticleList.tsx", type: "file" },
                  { name: "ArticleCard.tsx", type: "file" },
                ],
              },
              {
                name: "forum",
                type: "folder",
                children: [
                  { name: "ForumBoard.tsx", type: "file" },
                  { name: "PostThread.tsx", type: "file" },
                ],
              },
            ],
          },
          {
            name: "hooks",
            type: "folder",
            desc: "Custom React State Handlers",
            children: [
              { name: "useAuth.ts", type: "file" },
              { name: "useCounseling.ts", type: "file" },
            ],
          },
          {
            name: "services",
            type: "folder",
            desc: "Integrasi API Pihak Ketiga",
            children: [
              { name: "midtrans.ts", type: "file", desc: "Integrasi Token Snap Midtrans" },
              { name: "counseling.ts", type: "file" },
            ],
          },
          {
            name: "lib",
            type: "folder",
            desc: "Konfigurasi Inisialisasi Pustaka Utama",
            children: [
              { name: "supabase.ts", type: "file", desc: "Koneksi database & Auth Supabase" },
              { name: "utils.ts", type: "file", desc: "Kombinasi kelas Tailwind cn()" },
            ],
          },
          {
            name: "utils",
            type: "folder",
            desc: "Fungsi Bantu Murni (Pure helper functions)",
            children: [
              { name: "formatter.ts", type: "file", desc: "Konversi Rupiah & format tanggal" },
            ],
          },
          {
            name: "types",
            type: "folder",
            desc: "Model & Deklarasi Tipe TypeScript Global",
            children: [{ name: "index.ts", type: "file" }],
          },
          {
            name: "store",
            type: "folder",
            desc: "State Management System (Zustand / React Context)",
            children: [{ name: "index.ts", type: "file" }],
          },
          {
            name: "constants",
            type: "folder",
            desc: "Konfigurasi Statis & List Harga Layanan",
            children: [{ name: "index.ts", type: "file" }],
          },
          {
            name: "middleware",
            type: "folder",
            desc: "Keamanan Rute (Router Route Protection)",
            children: [{ name: "auth.ts", type: "file", desc: "Proteksi Admin & Dashboard" }],
          },
        ],
      },
      { name: "supabase-blueprint.json", type: "file", desc: "Skema tabel database PostgreSQL Supabase" },
      { name: "firestore.rules", type: "file" },
      { name: "package.json", type: "file" },
      { name: "tsconfig.json", type: "file" },
      { name: ".env.example", type: "file", desc: "Dokumentasi rahasia API & Keys" },
    ],
  },
];

const RenderNode: React.FC<{ node: TreeNodeProps; depth: number }> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(true);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="font-mono text-xs select-none">
      <div 
        className="flex items-start gap-1 py-1 px-2 hover:bg-sage-50 rounded-md transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        <span className="text-neutral-warm-400 shrink-0 mt-0.5">
          {hasChildren ? (
            isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <span className="w-3.5" />
          )}
        </span>
        
        {node.type === "folder" ? (
          <Folder className="w-4 h-4 text-sage-500 fill-sage-100 shrink-0 mt-0.5" />
        ) : (
          <File className="w-4 h-4 text-neutral-warm-400 shrink-0 mt-0.5" />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className={`font-semibold ${node.type === "folder" ? "text-neutral-warm-800" : "text-sage-700"}`}>
            {node.name}
          </span>
          {node.desc && (
            <span className="text-[10px] text-neutral-warm-400 italic">
              — {node.desc}
            </span>
          )}
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className="border-l border-sage-100/60 ml-[10px] my-0.5">
          {node.children!.map((child, i) => (
            <RenderNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FolderTreeVisualizer: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-sage-100 shadow-soft-md">
      <div className="flex items-center gap-2.5 mb-4 border-b border-sage-100 pb-4">
        <div className="w-5 h-5 rounded-md bg-sage-500 flex items-center justify-center">
          <Folder className="w-3 h-3 text-white fill-white/10" />
        </div>
        <div>
          <h3 className="font-serif text-lg text-neutral-warm-900">Arsitektur Folder Profesional</h3>
          <p className="text-[10px] font-sans text-neutral-warm-500">Struktur modular skalabel & best-practice Next.js App Router</p>
        </div>
      </div>
      
      <div className="bg-neutral-warm-50/50 p-4 rounded-2xl border border-neutral-warm-100/50 max-h-[500px] overflow-y-auto">
        {NEXT_JS_ARCHITECTURE.map((node, i) => (
          <RenderNode key={i} node={node} depth={0} />
        ))}
      </div>

      <div className="mt-4 bg-sage-50 p-4 rounded-xl border border-sage-100 flex gap-2 text-xs text-sage-800">
        <Info className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-sans">
          Arsitektur di atas memisahkan <strong>Atomic UI Components</strong> di folder <code>/src/components</code> dari <strong>Domain-Driven Modules</strong> di folder <code>/src/features</code>. Desain ini menjaga modularitas tinggi saat platform "Solusi Mr Bi" berkembang pesat dengan tim developer besar.
        </p>
      </div>
    </div>
  );
};
