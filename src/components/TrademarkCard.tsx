import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, Calendar, Building2, Layers, Tag, Bookmark, Check, Sparkles, Image as ImageIcon, Eye, Link as LinkIcon, Globe } from 'lucide-react';
import { Trademark } from '../types';
import { formatWipoPublishUrl, formatWipoPublishId, formatWipoBrandDbUrl, formatWipoBrandDbId } from '../utils/trademarkUtils';

interface TrademarkCardProps {
  trademark: Trademark;
  onSelect: (tm: Trademark) => void;
  onFindSimilar: (tm: Trademark) => void;
  isSaved: boolean;
  onToggleSave: (tm: Trademark) => void;
}

export const TrademarkCard: React.FC<TrademarkCardProps> = ({
  trademark,
  onSelect,
  onFindSimilar,
  isSaved,
  onToggleSave,
}) => {
  const [imgError, setImgError] = useState(false);

  // Status Badge Colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã cấp':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'Đang xử lý':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
      case 'Chờ nộp phí':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20';
      case 'Hết hiệu lực':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Source Badge Colors
  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'WIPO Publish':
        return 'bg-slate-900 text-amber-400 border-slate-700';
      case 'WIPO BrandDB':
        return 'bg-blue-900 text-blue-200 border-blue-700';
      case 'Interbra':
        return 'bg-purple-900 text-purple-200 border-purple-700';
      default:
        return 'bg-slate-800 text-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-amber-500/60 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Banner & Source Badge */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${getSourceBadge(trademark.source)} flex items-center space-x-1`}>
          <ShieldCheck className="w-3 h-3 text-amber-400" />
          <span>Nguồn: {trademark.source}</span>
        </span>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onToggleSave(trademark)}
            className={`p-1.5 rounded-lg border transition-all ${
              isSaved
                ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                : 'bg-white text-slate-400 hover:text-amber-600 border-slate-200'
            }`}
            title={isSaved ? 'Đã lưu vào danh mục' : 'Lưu nhãn hiệu'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col sm:flex-row gap-4">
        
        {/* Logo Image Preview */}
        <div className="w-full sm:w-36 h-36 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center p-2 relative group/img overflow-hidden shrink-0">
          {!imgError && trademark.brand_image ? (
            <img
              src={trademark.brand_image}
              alt={trademark.brand_name}
              onError={() => setImgError(true)}
              className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover/img:scale-105 transition-transform"
            />
          ) : (
            <div className="text-center text-slate-400 p-2">
              <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-300" />
              <span className="text-[10px] font-medium block">Logo Reproduction</span>
            </div>
          )}

          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => onSelect(trademark)}
              className="bg-white/90 text-slate-900 p-2 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="flex-1 space-y-2 text-xs text-slate-700">
          
          {/* Brand Name Title */}
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Tên nhãn hiệu</span>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight font-serif uppercase tracking-tight hover:text-amber-700 transition-colors cursor-pointer" onClick={() => onSelect(trademark)}>
              {trademark.brand_name}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
            
            {/* Application Number */}
            <div>
              <span className="text-slate-400 font-medium">Số đơn:</span>
              <span className="ml-1.5 font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {trademark.application_number}
              </span>
              {trademark.national_application_number && trademark.national_application_number !== trademark.application_number && (
                <span className="ml-1 font-mono text-[10px] text-slate-600 font-semibold bg-slate-200/80 px-1 py-0.5 rounded" title="Số đơn quốc gia (Việt Nam)">
                  {trademark.national_application_number}
                </span>
              )}
            </div>

            {/* Registration Certificate Number */}
            <div>
              <span className="text-slate-400 font-medium">Số văn bằng:</span>
              <span className="ml-1.5 font-mono font-semibold text-slate-800">
                {trademark.registration_number || 'Chưa cấp'}
              </span>
            </div>

            {/* Mark Type */}
            <div>
              <span className="text-slate-400 font-medium">Loại nhãn hiệu:</span>
              <span className="ml-1.5 font-semibold text-slate-800">{trademark.mark_type}</span>
            </div>

            {/* Application Filing Date */}
            <div>
              <span className="text-slate-400 font-medium">Ngày nộp đơn:</span>
              <span className="ml-1.5 font-medium text-slate-800">{trademark.application_date}</span>
            </div>

          </div>

          {/* Owner Info */}
          <div className="pt-1 border-t border-slate-100">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Chủ sở hữu:
            </span>
            <p className="font-semibold text-slate-900 text-xs mt-0.5 line-clamp-1">
              {trademark.owner}
            </p>
          </div>

          {/* Nice Classes Pills & Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-600" /> Nhóm Nice:
              </span>
              <div className="flex flex-wrap gap-1">
                {trademark.nice_class.map((nc) => (
                  <span key={nc} className="bg-amber-100 text-amber-900 font-bold text-[10px] px-1.5 py-0.5 rounded border border-amber-200">
                    {nc}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusBadge(trademark.status)}`}>
                ● {trademark.status}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Card Footer Actions */}
      <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <a
            href={formatWipoPublishUrl(trademark.application_number || trademark.national_application_number || '')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-1 rounded-lg flex items-center space-x-1 transition-colors"
            title="Link Cục SHTT WIPO Publish"
          >
            <LinkIcon className="w-3 h-3 text-amber-700" />
            <span>Cục SHTT ({formatWipoPublishId(trademark.application_number || trademark.national_application_number || '')})</span>
            <ExternalLink className="w-3 h-3 text-amber-700" />
          </a>

          <a
            href={formatWipoBrandDbUrl(trademark.application_number || trademark.national_application_number || '')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 px-2 py-1 rounded-lg flex items-center space-x-1 transition-colors"
            title="Link WIPO BrandDB"
          >
            <Globe className="w-3 h-3 text-blue-700" />
            <span>WIPO BrandDB</span>
            <ExternalLink className="w-3 h-3 text-blue-700" />
          </a>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onFindSimilar(trademark)}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 border border-amber-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Tìm tương tự</span>
          </button>

          <button
            onClick={() => onSelect(trademark)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
          >
            XEM CHI TIẾT
          </button>
        </div>
      </div>

    </div>
  );
};
