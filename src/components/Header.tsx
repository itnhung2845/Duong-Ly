import React from 'react';
import { ShieldCheck, Database, History, Bookmark, FileText, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'search' | 'history' | 'bookmarks' | 'stats';
  setActiveTab: (tab: 'search' | 'history' | 'bookmarks' | 'stats') => void;
  onOpenDoc: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDoc,
  savedCount,
}) => {
  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('search')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-900/30">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white font-serif">
                  TRA CỨU NHÃN HIỆU
                </h1>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Việt Nam & Quốc Tế
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans hidden sm:block">
                Hệ thống tra cứu chuyên sâu IP Vietnam, WIPO BrandDB & Interbra
              </p>
            </div>
          </div>

          {/* Sources live status indicator badges */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              Nguồn kết nối:
            </span>
            <span className="flex items-center text-emerald-400 font-medium gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> WIPO Publish
            </span>
            <span className="flex items-center text-emerald-400 font-medium gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> WIPO BrandDB
            </span>
            <span className="flex items-center text-emerald-400 font-medium gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Interbra
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                activeTab === 'search'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Tra cứu</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Lịch sử</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-colors relative ${
                activeTab === 'bookmarks'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Đã lưu</span>
              {savedCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center -ml-1">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenDoc}
              className="px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 flex items-center space-x-1.5 transition-colors"
              title="Kiến trúc hệ thống, DB Schema & API Docs"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Tài liệu API/DB</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
