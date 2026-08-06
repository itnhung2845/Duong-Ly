import React, { useState } from 'react';
import { X, Sparkles, Upload, Eye, ShieldAlert, ArrowRight, RefreshCw, Image as ImageIcon, CheckCircle, Scale } from 'lucide-react';
import { Trademark, SimilarMatchItem, SimilarSearchResponse } from '../types';

interface SimilarTrademarkModalProps {
  initialTrademark?: Trademark | null;
  onClose: () => void;
  onSelectTrademark: (tm: Trademark) => void;
}

export const SimilarTrademarkModal: React.FC<SimilarTrademarkModalProps> = ({
  initialTrademark,
  onClose,
  onSelectTrademark,
}) => {
  const [brandNameInput, setBrandNameInput] = useState(initialTrademark?.brand_name || '');
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(initialTrademark?.brand_image || null);
  const [activeTab, setActiveTab] = useState<'text' | 'phonetic' | 'logo'>('text');
  const [loading, setLoading] = useState(false);
  const [similarResults, setSimilarResults] = useState<SimilarSearchResponse | null>(null);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Similarity Search API
  const handleRunSearch = async () => {
    if (!brandNameInput && !uploadedLogo) return;

    setLoading(true);
    try {
      const res = await fetch('/api/similar-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_id: initialTrademark?.id,
          brand_name: brandNameInput,
          logo_base64: uploadedLogo,
          nice_classes: initialTrademark?.nice_class || [35, 20],
          search_type: activeTab,
        }),
      });

      const data = await res.json();
      setSimilarResults(data);
    } catch (err) {
      console.error('Similar search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-bold flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider block font-mono">
                CÔNG CỤ AI NÂNG CAO
              </span>
              <h2 className="font-bold text-lg sm:text-xl font-serif leading-tight">
                TÌM NHÃN HIỆU TƯƠNG TỰ (SIMILARITY SEARCH)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Input & Criteria Box */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Input Brand Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tên nhãn hiệu đối chứng
              </label>
              <input
                type="text"
                value={brandNameInput}
                onChange={(e) => setBrandNameInput(e.target.value)}
                placeholder="Nhập tên nhãn hiệu cần so sánh..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Logo Upload Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hình ảnh Logo (Tuỳ chọn)
              </label>
              <div className="flex items-center space-x-2">
                {uploadedLogo ? (
                  <div className="w-12 h-12 bg-white rounded-lg border border-slate-300 p-1 flex items-center justify-center shrink-0">
                    <img src={uploadedLogo} alt="Logo target" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-slate-200 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}

                <label className="cursor-pointer bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1 transition-colors w-full justify-center">
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tải logo lên</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

          </div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
            <div className="flex space-x-2 text-xs font-bold">
              {[
                { id: 'text', name: '1. Tương tự Tên chữ' },
                { id: 'phonetic', name: '2. Tương tự Phát âm' },
                { id: 'logo', name: '3. Tương tự Hình Logo (AI Vision)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleRunSearch}
              disabled={loading || (!brandNameInput && !uploadedLogo)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Đang đối soát AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>THỰC HIỆN ĐỐI SOÁT</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Results Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-800">
          
          {!similarResults && !loading && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Sparkles className="w-12 h-12 mx-auto text-amber-500/40" />
              <p className="font-semibold text-sm text-slate-600">
                Nhấn "THỰC HIỆN ĐỐI SOÁT" để AI phân tích đối chứng với cơ sở dữ liệu nhãn hiệu.
              </p>
              <p className="text-xs text-slate-400">
                Hệ thống áp dụng thuật toán tìm kiếm tương tự tên chữ, phát âm tiếng Việt và Gemini Vision AI.
              </p>
            </div>
          )}

          {loading && (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-slate-700 font-bold text-sm">
                Đang quét dữ liệu trùng/tương tự trên WIPO Publish IP Vietnam & WIPO BrandDB...
              </p>
            </div>
          )}

          {similarResults && (
            <div className="space-y-6">
              
              {/* AI Summary Banner */}
              {similarResults.ai_analysis_summary && (
                <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-serif">
                    <Scale className="w-4 h-4" /> BÁO CÁO NHẬN XÉT CỦA CHUYÊN GIA SHTT AI (GEMINI VISION)
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {similarResults.ai_analysis_summary}
                  </p>
                </div>
              )}

              {/* Match List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase font-serif text-sm flex items-center justify-between">
                  <span>Danh sách Nhãn hiệu Đối chứng Tương tự ({similarResults.matches.length})</span>
                  <span className="text-xs font-normal text-slate-500 font-sans">Sắp xếp theo % Tương tự giảm dần</span>
                </h4>

                {similarResults.matches.length === 0 ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-xs text-center font-semibold">
                    ✓ Không tìm thấy nhãn hiệu đối chứng trùng hoặc tương tự gây nhầm lẫn cao trong cơ sở dữ liệu.
                  </div>
                ) : (
                  similarResults.matches.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-amber-500/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3">
                        {/* Logo */}
                        <div className="w-16 h-16 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={item.trademark.brand_image}
                            alt={item.trademark.brand_name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Text details */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-bold text-slate-900 text-sm font-serif uppercase">
                              {item.trademark.brand_name}
                            </h5>
                            <span className="text-[10px] font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">
                              {item.trademark.application_number}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 font-medium">
                            Chủ sở hữu: {item.trademark.owner}
                          </p>

                          <div className="flex flex-wrap gap-1 text-[10px]">
                            <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                              Nhóm Nice: {item.trademark.nice_class.join(', ')}
                            </span>
                            <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                              Nguồn: {item.trademark.source}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 pt-1">
                            {item.similarity_reasons.map((r, i) => (
                              <span key={i} className="inline-block mr-2 text-rose-700 font-medium">
                                • {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Similarity Score Badge & Action */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mức độ tương tự</span>
                          <span className={`text-lg font-extrabold font-serif ${
                            item.similarity_score >= 80 ? 'text-rose-600' : item.similarity_score >= 50 ? 'text-amber-600' : 'text-slate-700'
                          }`}>
                            {item.similarity_score}%
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onSelectTrademark(item.trademark);
                          }}
                          className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem chi tiết</span>
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
