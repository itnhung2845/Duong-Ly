import React from 'react';
import { Filter, Grid, List, Sparkles, RefreshCw, CheckCircle, Clock, AlertTriangle, HelpCircle } from 'lucide-react';
import { NICE_CLASSES } from '../data/niceClasses';
import { SourceType } from '../types';

interface FilterBarProps {
  niceClassFilter: number | null;
  setNiceClassFilter: (code: number | null) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  totalResults: number;
  onOpenSimilarModal: () => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  niceClassFilter,
  setNiceClassFilter,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  totalResults,
  onOpenSimilarModal,
  onResetFilters,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Result Count & Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-1.5 font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>Tìm thấy:</span>
            <span className="text-amber-700 font-extrabold text-sm">{totalResults}</span>
            <span className="text-slate-500 font-normal">kết quả</span>
          </div>

          {/* Filter Nice Class */}
          <div className="relative">
            <select
              value={niceClassFilter || ''}
              onChange={(e) => setNiceClassFilter(e.target.value ? parseInt(e.target.value) : null)}
              className="bg-slate-50 text-slate-800 border border-slate-300 rounded-lg py-1.5 px-3 pr-8 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả Nhóm Nice (1 - 45)</option>
              <optgroup label="Hàng hóa (Nhóm 1 - 34)">
                {NICE_CLASSES.filter(c => c.category === 'goods').map((nc) => (
                  <option key={nc.code} value={nc.code}>
                    Nhóm {nc.code}: {nc.title_vi.slice(0, 38)}...
                  </option>
                ))}
              </optgroup>
              <optgroup label="Dịch vụ (Nhóm 35 - 45)">
                {NICE_CLASSES.filter(c => c.category === 'services').map((nc) => (
                  <option key={nc.code} value={nc.code}>
                    Nhóm {nc.code}: {nc.title_vi.slice(0, 38)}...
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 text-slate-800 border border-slate-300 rounded-lg py-1.5 px-3 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Đang xử lý">🟡 Đang xử lý</option>
              <option value="Đã cấp">🟢 Đã cấp văn bằng</option>
              <option value="Hết hiệu lực">🔴 Hết hiệu lực</option>
              <option value="Chờ nộp phí">🔵 Chờ nộp phí</option>
            </select>
          </div>

          {(niceClassFilter || statusFilter !== 'All') && (
            <button
              onClick={onResetFilters}
              className="text-amber-700 hover:text-amber-800 font-semibold text-xs underline cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>

        {/* Right: AI Similar Search Button & View Mode */}
        <div className="flex items-center space-x-2">
          
          <button
            onClick={onOpenSimilarModal}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>TÌM NHÃN HIỆU TƯƠNG TỰ (AI)</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Chế độ thẻ Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Chế độ bảng Báo cáo"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
