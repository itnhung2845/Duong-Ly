import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { FilterBar } from './components/FilterBar';
import { TrademarkCard } from './components/TrademarkCard';
import { TrademarkDetailModal } from './components/TrademarkDetailModal';
import { SimilarTrademarkModal } from './components/SimilarTrademarkModal';
import { DocModal } from './components/DocModal';
import { Trademark, SourceType, SearchHistoryItem, SystemStats } from './types';
import { ShieldCheck, Database, Search, History, Bookmark, Sparkles, ExternalLink, Eye, Trash2, ArrowUpRight, BarChart2, Tag } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<SourceType>('All');
  const [niceClassFilter, setNiceClassFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeTab, setActiveTab] = useState<'search' | 'history' | 'bookmarks' | 'stats'>('search');

  const [trademarks, setTrademarks] = useState<Trademark[]>([]);
  const [loading, setLoading] = useState(false);
  const [detectedType, setDetectedType] = useState<string>('unknown');

  const [savedBookmarks, setSavedBookmarks] = useState<Trademark[]>(() => {
    try {
      const saved = localStorage.getItem('saved_trademarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);

  const [selectedTrademark, setSelectedTrademark] = useState<Trademark | null>(null);
  const [similarModalTrademark, setSimilarModalTrademark] = useState<Trademark | null>(null);
  const [showSimilarModal, setShowSimilarModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  // Initial data load on mount
  useEffect(() => {
    fetchSearch();
    fetchHistory();
    fetchStats();
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('saved_trademarks', JSON.stringify(savedBookmarks));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [savedBookmarks]);

  // Main search API caller
  const fetchSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (niceClassFilter) params.append('niceClass', niceClassFilter.toString());
      if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);
      if (selectedSource && selectedSource !== 'All') params.append('source', selectedSource);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();

      setTrademarks(data.trademarks || []);
      setDetectedType(data.detected_type || 'unknown');
      fetchHistory();
    } catch (err) {
      console.error('Search fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistoryItems(data || []);
    } catch (err) {
      console.warn('History error:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.warn('Stats error:', err);
    }
  };

  const handleToggleSave = (tm: Trademark) => {
    setSavedBookmarks((prev) => {
      const exists = prev.some((item) => item.id === tm.id);
      if (exists) {
        return prev.filter((item) => item.id !== tm.id);
      } else {
        return [tm, ...prev];
      }
    });
  };

  const handleResetFilters = () => {
    setNiceClassFilter(null);
    setStatusFilter('All');
    setSelectedSource('All');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDoc={() => setShowDocModal(true)}
        savedCount={savedBookmarks.length}
      />

      {/* Hero Search Area (When activeTab is 'search') */}
      {activeTab === 'search' && (
        <SearchHero
          query={query}
          setQuery={setQuery}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          onSearch={fetchSearch}
          loading={loading}
          detectedType={detectedType}
        />
      )}

      {/* Main Body View Switching */}
      <main className="flex-1 max-w-7xl w-full mx-auto pb-16">
        
        {/* TAB 1: SEARCH RESULTS VIEW */}
        {activeTab === 'search' && (
          <div>
            {/* Filter Bar */}
            <FilterBar
              niceClassFilter={niceClassFilter}
              setNiceClassFilter={setNiceClassFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalResults={trademarks.length}
              onOpenSimilarModal={() => {
                setSimilarModalTrademark(null);
                setShowSimilarModal(true);
              }}
              onResetFilters={handleResetFilters}
            />

            {/* Results Section */}
            <div className="p-4 sm:p-6 lg:p-8">
              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-600 font-bold text-sm">
                    Đang kết nối dữ liệu Cục SHTT & WIPO Global Brand Database...
                  </p>
                </div>
              ) : trademarks.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 text-center max-w-2xl mx-auto shadow-sm space-y-4">
                  <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-serif text-slate-900">
                      Không tìm thấy dữ liệu nhãn hiệu phù hợp
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Vui lòng kiểm tra lại số đơn (ví dụ: VN4202625506), số văn bằng (4-0423797-000) hoặc thử chọn "Tất cả nguồn" tra cứu.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setQuery('');
                      handleResetFilters();
                      fetchSearch();
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow cursor-pointer transition-colors"
                  >
                    XÓA BỘ LỌC VÀ HIỂN THỊ TẤT CẢ
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                /* GRID VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {trademarks.map((tm) => (
                    <TrademarkCard
                      key={tm.id}
                      trademark={tm}
                      onSelect={(item) => setSelectedTrademark(item)}
                      onFindSimilar={(item) => {
                        setSimilarModalTrademark(item);
                        setShowSimilarModal(true);
                      }}
                      isSaved={savedBookmarks.some((b) => b.id === tm.id)}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              ) : (
                /* TABLE VIEW (WIPO Brand Database Style) */
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-serif uppercase tracking-wider text-[11px] border-b border-slate-800">
                          <th className="py-3 px-4">Logo</th>
                          <th className="py-3 px-4">Tên nhãn hiệu</th>
                          <th className="py-3 px-4">Số đơn</th>
                          <th className="py-3 px-4">Số bằng</th>
                          <th className="py-3 px-4">Chủ sở hữu</th>
                          <th className="py-3 px-4">Nhóm Nice</th>
                          <th className="py-3 px-4">Trạng thái</th>
                          <th className="py-3 px-4 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                        {trademarks.map((tm) => (
                          <tr key={tm.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-2">
                              <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200 p-0.5 flex items-center justify-center">
                                <img
                                  src={tm.brand_image}
                                  alt={tm.brand_name}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 font-serif uppercase">
                              {tm.brand_name}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-800">
                              {tm.application_number}
                            </td>
                            <td className="py-3 px-4 font-mono text-amber-800 font-bold">
                              {tm.registration_number || 'Chờ cấp'}
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate" title={tm.owner}>
                              {tm.owner}
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
                                {tm.nice_class.join(', ')}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {tm.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => setSelectedTrademark(tm)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1 rounded text-[11px] shadow-sm cursor-pointer"
                              >
                                Xem
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HISTORY LOGS */}
        {activeTab === 'history' && (
          <div className="p-4 sm:p-6 lg:p-8 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold font-serif text-slate-900 uppercase flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-amber-600" />
                Lịch sử tra cứu nhãn hiệu ({historyItems.length})
              </h3>

              {historyItems.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">Chưa có nhật ký tra cứu nào.</p>
              ) : (
                <div className="space-y-2">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-sm bg-white px-2 py-0.5 rounded border border-slate-200 mr-2">
                          {item.query}
                        </span>
                        <span className="text-slate-500">
                          Nguồn: <b className="text-slate-800">{item.source}</b> • Kết quả: <b className="text-amber-700">{item.results_count}</b>
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                        <span>{new Date(item.timestamp).toLocaleString('vi-VN')}</span>
                        <button
                          onClick={() => {
                            setQuery(item.query);
                            setActiveTab('search');
                            fetchSearch();
                          }}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Tra cứu lại</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SAVED BOOKMARKS */}
        {activeTab === 'bookmarks' && (
          <div className="p-4 sm:p-6 lg:p-8 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-serif text-slate-900 uppercase flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-amber-600" />
                  Danh mục Nhãn hiệu Đã lưu ({savedBookmarks.length})
                </h3>

                {savedBookmarks.length > 0 && (
                  <button
                    onClick={() => setSavedBookmarks([])}
                    className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa toàn bộ</span>
                  </button>
                )}
              </div>

              {savedBookmarks.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Bookmark className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">Chưa có nhãn hiệu nào được lưu trữ.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedBookmarks.map((tm) => (
                    <TrademarkCard
                      key={tm.id}
                      trademark={tm}
                      onSelect={(item) => setSelectedTrademark(item)}
                      onFindSimilar={(item) => {
                        setSimilarModalTrademark(item);
                        setShowSimilarModal(true);
                      }}
                      isSaved={true}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="font-semibold text-slate-300 font-serif">
            HỆ THỐNG TRA CỨU NHÃN HIỆU VIỆT NAM & QUỐC TẾ (VIETNAM & INTERNATIONAL TRADEMARK SYSTEM)
          </p>
          <p className="text-slate-500">
            Kết nối dữ liệu WIPO Publish IP Vietnam, WIPO Global Brand Database & Interbra • Phát triển chuyên sâu cho Luật sư & Đại diện Sở hữu Trí tuệ.
          </p>
        </div>
      </footer>

      {/* MODALS */}
      {selectedTrademark && (
        <TrademarkDetailModal
          trademark={selectedTrademark}
          onClose={() => setSelectedTrademark(null)}
          onFindSimilar={(item) => {
            setSimilarModalTrademark(item);
            setShowSimilarModal(true);
          }}
        />
      )}

      {showSimilarModal && (
        <SimilarTrademarkModal
          initialTrademark={similarModalTrademark}
          onClose={() => {
            setShowSimilarModal(false);
            setSimilarModalTrademark(null);
          }}
          onSelectTrademark={(item) => setSelectedTrademark(item)}
        />
      )}

      {showDocModal && (
        <DocModal onClose={() => setShowDocModal(false)} />
      )}

    </div>
  );
}
