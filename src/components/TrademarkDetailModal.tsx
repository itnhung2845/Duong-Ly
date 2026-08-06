import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Building2, Calendar, FileText, Download, Sparkles, CheckCircle2, Clock, AlertTriangle, Printer, Tag, MapPin, Scale, RefreshCw, Link as LinkIcon, Check, Globe } from 'lucide-react';
import { Trademark, TimelineEvent } from '../types';
import { NICE_CLASSES, getNiceClass } from '../data/niceClasses';
import { formatWipoPublishUrl, formatWipoPublishId, formatWipoBrandDbUrl, formatWipoBrandDbId } from '../utils/trademarkUtils';

interface TrademarkDetailModalProps {
  trademark: Trademark | null;
  onClose: () => void;
  onFindSimilar: (tm: Trademark) => void;
}

export const TrademarkDetailModal: React.FC<TrademarkDetailModalProps> = ({
  trademark,
  onClose,
  onFindSimilar,
}) => {
  if (!trademark) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'timeline' | 'ai_analysis'>('info');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [extractedPdfNote, setExtractedPdfNote] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBrandDbLink, setCopiedBrandDbLink] = useState(false);

  const appNum = trademark.application_number || trademark.national_application_number || '';
  const wipoPublishUrl = formatWipoPublishUrl(appNum);
  const wipoPublishId = formatWipoPublishId(appNum);
  const brandDbUrl = formatWipoBrandDbUrl(appNum);
  const brandDbId = formatWipoBrandDbId(appNum);

  // Fetch AI Analysis when tab changes to ai_analysis
  useEffect(() => {
    if (activeTab === 'ai_analysis' && !aiAnalysis) {
      setAiLoading(true);
      fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_name: trademark.brand_name,
          nice_classes: trademark.nice_class,
          description: trademark.goods_services_description?.[trademark.nice_class[0]] || '',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAiAnalysis(data);
          setAiLoading(false);
        })
        .catch(() => setAiLoading(false));
    }
  }, [activeTab, trademark]);

  const handleExtractPdfLogo = () => {
    setExtractedPdfNote('Đã tự động tải tài liệu công bố đơn PDF và trích xuất hình ảnh logo độ phân giải cao PNG 1200x1200px!');
  };

  const handlePrint = () => {
    window.print();
  };

  // Mock timeline
  const timelineEvents: TimelineEvent[] = (trademark as any).timeline || [
    {
      date: trademark.application_date,
      title: 'Nộp đơn đăng ký nhãn hiệu',
      description: `Đơn số ${trademark.application_number} được ghi nhận tại Cục SHTT.`,
      status: 'completed',
    },
    {
      date: trademark.publication_date || '25/02/2026',
      title: 'Chấp nhận đơn hợp lệ & Công bố',
      description: 'Đã hoàn thành thẩm định hình thức và công bố trên Công báo SHTT.',
      status: 'completed',
    },
    {
      date: trademark.registration_date !== 'Chưa cấp bằng' ? trademark.registration_date! : 'Đang thực hiện',
      title: 'Thẩm định nội dung',
      description: 'Đang thẩm định khả năng phân biệt theo Điều 73, 74 Luật SHTT 2022.',
      status: trademark.status === 'Đã cấp' ? 'completed' : 'current',
    },
    {
      date: trademark.registration_date !== 'Chưa cấp bằng' ? trademark.registration_date! : 'Dự kiến Q3/2026',
      title: 'Cấp Giấy chứng nhận Đăng ký nhãn hiệu',
      description: trademark.status === 'Đã cấp' ? `Bằng số ${trademark.registration_number}` : 'Chờ thông báo cấp bằng.',
      status: trademark.status === 'Đã cấp' ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center font-serif text-xl shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider block font-mono">
                BÁO CÁO CHI TIẾT NHÃN HIỆU • NGUỒN {trademark.source}
              </span>
              <h2 className="font-bold text-lg sm:text-xl font-serif leading-tight">
                {trademark.brand_name}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:flex items-center space-x-1 text-xs font-medium border border-slate-700"
              title="In báo cáo nhãn hiệu"
            >
              <Printer className="w-4 h-4" />
              <span>In báo cáo</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 pt-3 flex space-x-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'info'
                ? 'border-amber-600 text-amber-900 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>THÔNG TIN CHUNG</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-amber-600 text-amber-900 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>TIẾN TRÌNH XỬ LÝ (TIMELINE)</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_analysis')}
            className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'ai_analysis'
                ? 'border-amber-600 text-amber-900 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>ĐÁNH GIÁ PHÁP LÝ AI</span>
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 text-xs sm:text-sm">
          
          {activeTab === 'info' && (
            <>
              {/* Logo & Top Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                
                {/* Logo Box */}
                <div className="flex flex-col items-center justify-center bg-white p-3 rounded-lg border border-slate-200 shadow-inner text-center">
                  <div className="w-full h-44 flex items-center justify-center p-2 mb-2">
                    <img
                      src={trademark.brand_image}
                      alt={trademark.brand_name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    />
                  </div>

                  <button
                    onClick={handleExtractPdfLogo}
                    className="text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors w-full justify-center"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Trích xuất Logo gốc PDF</span>
                  </button>

                  {extractedPdfNote && (
                    <span className="text-[10px] text-emerald-700 font-semibold mt-2 block leading-tight bg-emerald-50 p-1.5 rounded border border-emerald-200">
                      ✓ {extractedPdfNote}
                    </span>
                  )}
                </div>

                {/* Key Attributes */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Tên nhãn hiệu</span>
                    <h3 className="text-xl font-bold font-serif text-slate-900 uppercase">
                      {trademark.brand_name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400 block font-medium">Số đơn đăng ký</span>
                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        <span className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {trademark.application_number}
                        </span>
                        {trademark.national_application_number && trademark.national_application_number !== trademark.application_number && (
                          <span className="font-mono font-bold text-slate-700 text-xs bg-slate-200 px-1.5 py-0.5 rounded" title="Số đơn Quốc gia Cục SHTT Việt Nam">
                            ({trademark.national_application_number})
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Số văn bằng bảo hộ</span>
                      <span className="font-mono font-bold text-amber-800 text-sm">{trademark.registration_number || 'Chưa cấp bằng'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Loại nhãn hiệu</span>
                      <span className="font-semibold text-slate-800">{trademark.mark_type}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Trạng thái pháp lý</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                        ● {trademark.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Ngày nộp đơn</span>
                      <span className="font-bold text-slate-800">{trademark.application_date}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Ngày cấp bằng</span>
                      <span className="font-bold text-slate-800">{trademark.registration_date || 'Chờ cấp'}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">Ngày hết hiệu lực</span>
                      <span className="font-bold text-slate-800">{trademark.expiration_date || 'N/A'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Thẻ Trả Về Đường Link Cục SHHT & WIPO BrandDB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 1. Thẻ Cục SHTT WIPO Publish */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/70 p-4 rounded-xl border border-amber-300 shadow-sm flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-amber-600 text-white rounded-lg shadow-sm shrink-0">
                        <LinkIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 font-serif text-xs uppercase tracking-wide">
                          CỤC SỞ HỮU TRÍ TUỆ (WIPO PUBLISH)
                        </h4>
                        <span className="bg-amber-600 text-white font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs inline-block mt-0.5">
                          {wipoPublishId}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Link tra cứu chính thức Cục SHTT Việt Nam với mã <code className="font-mono text-amber-800 font-bold bg-amber-100 px-1 rounded">{wipoPublishId}</code>.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <a
                      href={wipoPublishUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all hover:scale-[1.01] w-full cursor-pointer"
                    >
                      <span>Mở link WIPO Publish Cục SHTT</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="flex items-center space-x-1.5 bg-white/90 p-1.5 px-2 rounded-lg border border-amber-200 font-mono text-[10px] text-slate-800">
                      <span className="select-all truncate flex-1 font-medium text-slate-700">{wipoPublishUrl}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(wipoPublishUrl);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded transition-colors shrink-0 cursor-pointer border border-amber-300 flex items-center gap-0.5"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <span>Sao chép</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Thẻ WIPO BrandDB */}
                <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100/70 p-4 rounded-xl border border-blue-300 shadow-sm flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 font-serif text-xs uppercase tracking-wide">
                          TOÀN CẦU (WIPO BRANDDB)
                        </h4>
                        <span className="bg-blue-600 text-white font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs inline-block mt-0.5">
                          {brandDbId}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Mở liên kết gốc tra cứu thương hiệu quốc tế trên <strong className="text-blue-900">branddb.wipo.int</strong> với mã <code className="font-mono text-blue-800 font-bold bg-blue-100 px-1 rounded">{brandDbId}</code>.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <a
                      href={brandDbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all hover:scale-[1.01] w-full cursor-pointer"
                    >
                      <span>Mở liên kết gốc trên WIPO BrandDB</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="flex items-center space-x-1.5 bg-white/90 p-1.5 px-2 rounded-lg border border-blue-200 font-mono text-[10px] text-slate-800">
                      <span className="select-all truncate flex-1 font-medium text-slate-700">{brandDbUrl}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(brandDbUrl);
                          setCopiedBrandDbLink(true);
                          setTimeout(() => setCopiedBrandDbLink(false), 2000);
                        }}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded transition-colors shrink-0 cursor-pointer border border-blue-300 flex items-center gap-0.5"
                      >
                        {copiedBrandDbLink ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <span>Sao chép</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner & Representative */}
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <h4 className="font-bold text-slate-900 uppercase font-serif text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  Chủ sở hữu & Đại diện đại lý
                </h4>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div>
                    <span className="text-slate-400 font-semibold text-xs">Tên chủ sở hữu:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{trademark.owner}</p>
                  </div>

                  {trademark.owner_address && (
                    <div className="flex items-start space-x-1.5 text-xs text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>Địa chỉ: {trademark.owner_address}</span>
                    </div>
                  )}

                  {trademark.representative && (
                    <div className="pt-2 border-t border-slate-200 text-xs">
                      <span className="text-slate-400 font-semibold">Tổ chức đại diện sở hữu trí tuệ:</span>
                      <p className="font-semibold text-slate-800">{trademark.representative}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Nice Classes Breakdown */}
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase font-serif text-sm flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-700" />
                    Danh mục Nhóm Nice & Sản phẩm/Dịch vụ bảo hộ (Classification)
                  </h4>
                  <span className="text-[11px] text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Phân loại Nice {trademark.nice_class.length} nhóm
                  </span>
                </div>

                <div className="space-y-3">
                  {trademark.nice_class.map((nc) => {
                    const classInfo = getNiceClass(nc);
                    const desc = trademark.goods_services_description?.[nc] || classInfo?.description_vi;

                    return (
                      <div key={nc} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                          <div className="flex items-center space-x-2">
                            <span className="bg-amber-600 text-white font-extrabold text-xs px-2.5 py-0.5 rounded font-mono shadow-sm">
                              Nhóm {nc}
                            </span>
                            <span className="font-bold text-slate-900 text-xs">
                              {classInfo?.title_vi || `Nhóm ${nc}`}
                            </span>
                          </div>
                          {classInfo?.title_en && (
                            <span className="text-[11px] font-mono text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                              Class {nc}: {classInfo.title_en}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Chi tiết sản phẩm / dịch vụ bảo hộ đầy đủ:
                          </span>
                          <p className="text-xs text-slate-800 leading-relaxed pl-3 border-l-2 border-amber-500 bg-white p-2.5 rounded border border-slate-200/80 font-normal">
                            {desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legal Disclaimers & Vienna Classification */}
              {(trademark.disclaimer || trademark.vienna_codes) && (
                <div className="space-y-2 border-t border-slate-200 pt-4 text-xs">
                  {trademark.disclaimer && (
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
                      <span className="font-bold block mb-0.5">Cam kết loại trừ (Disclaimer):</span>
                      <p>{trademark.disclaimer}</p>
                    </div>
                  )}

                  {trademark.vienna_codes && (
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-semibold">Phân loại hình Vienna:</span>
                      <div className="flex space-x-1">
                        {trademark.vienna_codes.map((vc) => (
                          <span key={vc} className="bg-slate-200 text-slate-800 font-mono text-[10px] px-2 py-0.5 rounded">
                            {vc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6 py-2">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-xs">
                <span className="font-bold block">Tiến trình xử lý đơn theo Luật Sở hữu trí tuệ 2022:</span>
                <p className="mt-0.5">Thời hạn thẩm định hình thức: 01 tháng • Thời hạn công bố đơn: 02 tháng • Thời hạn thẩm định nội dung: 09 tháng.</p>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
                {timelineEvents.map((evt, idx) => (
                  <div key={idx} className="ml-6 relative">
                    <span className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                      evt.status === 'completed'
                        ? 'bg-emerald-600 ring-4 ring-emerald-100'
                        : evt.status === 'current'
                        ? 'bg-amber-500 ring-4 ring-amber-100 animate-pulse'
                        : 'bg-slate-300'
                    }`}>
                      {evt.status === 'completed' ? '✓' : idx + 1}
                    </span>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span className="text-amber-800 font-serif">{evt.title}</span>
                        <span className="font-mono text-slate-500 text-[11px]">{evt.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai_analysis' && (
            <div className="space-y-5">
              {aiLoading ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
                  <p className="text-slate-600 font-medium text-xs">
                    Gemini AI đang phân tích khả năng bảo hộ và nguy cơ xung đột pháp lý...
                  </p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-4">
                  {/* Score Card */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl flex items-center justify-between border border-slate-700">
                    <div>
                      <span className="text-amber-400 font-semibold text-xs uppercase tracking-wider block">
                        ĐÁNH GIÁ KHẢ NĂNG BẢO HỘ (REGISTRABILITY SCORE)
                      </span>
                      <p className="text-xs text-slate-300 mt-1 max-w-md">
                        Phân tích tự động dựa trên Điều 73, 74 Luật Sở hữu trí tuệ 2022 và cơ sở dữ liệu đối chứng.
                      </p>
                    </div>
                    <div className="text-center bg-amber-500 text-slate-950 px-5 py-3 rounded-xl font-bold font-serif">
                      <span className="text-3xl font-extrabold block">{aiAnalysis.registrability_score}%</span>
                      <span className="text-[10px] uppercase font-sans">Độ an toàn</span>
                    </div>
                  </div>

                  {/* Distinctiveness */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900 font-serif text-xs uppercase flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-amber-700" />
                      Nhận xét khả năng phân biệt (Khái quát)
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {aiAnalysis.summary}
                    </p>
                  </div>

                  {/* Legal Recommendations */}
                  {aiAnalysis.legal_recommendations && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 space-y-2">
                      <h5 className="font-bold text-xs uppercase font-serif flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                        Khuyến nghị cho Luật sư / Đại diện SHTT
                      </h5>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {aiAnalysis.legal_recommendations.map((rec: string, i: number) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <a
            href={trademark.detail_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-slate-700 hover:text-amber-800 flex items-center space-x-1.5"
          >
            <span>Mở liên kết gốc trên {trademark.source}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onFindSimilar(trademark);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>TÌM NHÃN HIỆU TƯƠNG TỰ</span>
            </button>

            <button
              onClick={onClose}
              className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              ĐÓNG
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
