import React, { useState, useEffect } from 'react';
import { Search, Sparkles, AlertCircle, ArrowRight, X, RefreshCw, Layers } from 'lucide-react';
import { SourceType } from '../types';

interface SearchHeroProps {
  query: string;
  setQuery: (q: string) => void;
  selectedSource: SourceType;
  setSelectedSource: (s: SourceType) => void;
  onSearch: () => void;
  loading: boolean;
  detectedType: string;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  query,
  setQuery,
  selectedSource,
  setSelectedSource,
  onSearch,
  loading,
  detectedType,
}) => {
  const [autoSourceNote, setAutoSourceNote] = useState<string>('');

  // Live query detection logic
  useEffect(() => {
    const clean = query.trim().toUpperCase().replace(/[\s\-_]/g, '');
    if (!query.trim()) {
      setAutoSourceNote('');
      return;
    }

    if (/^(VN|VN4|4202|4201|4200)/.test(clean) || /^VN-?4-?/i.test(query.trim())) {
      setAutoSourceNote('Đã nhận diện: SỐ ĐƠN ĐĂNG KÝ (VN) ➔ Ưu tiên tra cứu trên WIPO Publish IP Vietnam (wipopublish.ipvietnam.gov.vn)');
    } else if (/^4-\d{7}-\d{3}$/.test(query.trim()) || /^404\d{5}/.test(clean) || /^WO\d+/.test(clean)) {
      setAutoSourceNote('Đã nhận diện: SỐ VĂN BẰNG BẢO HỘ ➔ Ưu tiên tra cứu trên WIPO Global Brand Database (branddb.wipo.int)');
    } else if (/^\d{5,8}$/.test(clean) || clean.startsWith('ITB')) {
      setAutoSourceNote('Đã nhận diện: SỐ ĐƠN/BẰNG INTERBRA ➔ Ưu tiên tra cứu trên Interbra Database (interbra.vn)');
    } else {
      setAutoSourceNote('Đã nhận diện: TÊN NHÃN HIỆU / TỪ KHÓA ➔ Tự động tổng hợp dữ liệu từ tất cả các nguồn Cục SHTT & WIPO');
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const sampleQueries = [
    { label: 'VN4202625506', desc: 'Số đơn WIPO Publish' },
    { label: 'VN-4-2019-46858', desc: 'Số đơn Cục SHTT' },
    { label: '4-0423797-000', desc: 'Số văn bằng WIPO' },
    { label: 'B BOONGTEE HOME', desc: 'Tên nhãn hiệu' },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
            TRA CỨU THÔNG TIN NHÃN HIỆU TOÀN DIỆN
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans">
            Tự động tra cứu số đơn, số văn bằng bảo hộ và tên nhãn hiệu từ Cục SHTT Việt Nam (WIPO Publish), WIPO Global BrandDB & Interbra.
          </p>
        </div>

        {/* Source Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Nguồn dữ liệu:
          </span>
          {[
            { id: 'All', name: 'Tất cả nguồn' },
            { id: 'WIPO Publish', name: '1. Cục SHTT (WIPO Publish)' },
            { id: 'WIPO BrandDB', name: '2. WIPO BrandDB' },
            { id: 'Interbra', name: '3. Interbra' },
          ].map((src) => (
            <button
              key={src.id}
              onClick={() => setSelectedSource(src.id as SourceType)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedSource === src.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md ring-2 ring-amber-400/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {src.name}
            </button>
          ))}
        </div>

        {/* Search Input Box */}
        <div className="bg-slate-800/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80 shadow-2xl focus-within:border-amber-500/80 focus-within:ring-4 focus-within:ring-amber-500/20 transition-all">
          <div className="flex items-center space-x-2">
            <div className="pl-3 text-slate-400">
              <Search className="w-6 h-6 text-amber-500" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập số đơn (VN4202625506), số văn bằng (4-0423797-000) hoặc tên nhãn hiệu..."
              className="w-full bg-transparent py-3 px-2 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-white rounded-full transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onSearch}
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 sm:px-7 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 text-sm sm:text-base shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Đang tìm...</span>
                </>
              ) : (
                <>
                  <span>TÌM KIẾM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Auto-Detection Badge */}
        {autoSourceNote && (
          <div className="mt-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium leading-relaxed">{autoSourceNote}</span>
          </div>
        )}

        {/* Sample Inputs */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Mẫu tra cứu nhanh:</span>
          {sampleQueries.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(sample.label);
              }}
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/50 px-2.5 py-1 rounded-lg font-mono transition-all flex items-center space-x-1"
            >
              <span className="text-amber-400 font-semibold">{sample.label}</span>
              <span className="text-[10px] text-slate-400">({sample.desc})</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
