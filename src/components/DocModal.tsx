import React, { useState } from 'react';
import { X, Server, Database, Code2, Terminal, Cloud, ShieldCheck, CheckCircle2, Copy, Check } from 'lucide-react';

interface DocModalProps {
  onClose: () => void;
}

export const DocModal: React.FC<DocModalProps> = ({ onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlSchema = `-- DATABASE SCHEMA FOR VIETNAM & WIPO TRADEMARK SEARCH SYSTEM
CREATE TABLE IF NOT EXISTS trademarks (
    id VARCHAR(64) PRIMARY KEY,
    application_number VARCHAR(64) NOT NULL UNIQUE,
    registration_number VARCHAR(64),
    brand_name VARCHAR(255) NOT NULL,
    brand_image TEXT,
    mark_type VARCHAR(64) DEFAULT 'Nhãn hiệu kết hợp',
    owner VARCHAR(255) NOT NULL,
    owner_address TEXT,
    representative VARCHAR(255),
    country VARCHAR(10) DEFAULT 'VN',
    nice_class INT[] NOT NULL,
    goods_services_description JSONB,
    status VARCHAR(64) DEFAULT 'Đang xử lý',
    application_date DATE NOT NULL,
    registration_date DATE,
    expiration_date DATE,
    publication_date DATE,
    source VARCHAR(64) NOT NULL, -- 'WIPO Publish', 'WIPO BrandDB', 'Interbra'
    detail_url TEXT NOT NULL,
    pdf_url TEXT,
    disclaimer TEXT,
    vienna_codes VARCHAR(32)[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Full-text search index for Vietnamese Brand Names and Owners
CREATE INDEX idx_trademarks_app_num ON trademarks(application_number);
CREATE INDEX idx_trademarks_reg_num ON trademarks(registration_number);
CREATE INDEX idx_trademarks_brand_name ON trademarks USING gin(to_tsvector('vietnamese', brand_name));
CREATE INDEX idx_trademarks_nice_class ON trademarks USING gin(nice_class);`;

  const localRunSteps = `# HƯỚNG DẪN CHẠY LOCAL

1. Clone source code và cài đặt dependencies:
   npm install

2. Thiết lập biến môi trường (.env):
   GEMINI_API_KEY="AI_STUDIO_GEMINI_API_KEY"
   PORT=3000

3. Chạy dev server (Express + Vite HMR):
   npm run dev

4. Mở trình duyệt tại địa chỉ:
   http://localhost:3000`;

  const cloudRunSteps = `# HƯỚNG DẪN DEPLOY GOOGLE CLOUD RUN & CLOUD SQL

# 1. Đóng gói Docker Image:
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/trademark-search-app:v1

# 2. Tạo PostgreSQL Cloud SQL instance:
gcloud sql instances create trademark-db --database-version=POSTGRES_15 --tier=db-f1-micro --region=asia-east1

# 3. Deploy lên Google Cloud Run:
gcloud run deploy trademark-search-app \\
  --image gcr.io/YOUR_PROJECT_ID/trademark-search-app:v1 \\
  --platform managed \\
  --region asia-east1 \\
  --allow-unauthenticated \\
  --set-env-vars GEMINI_API_KEY="YOUR_KEY"`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider block font-mono">
                KIẾN TRÚC HỆ THỐNG & API DOCUMENTATION
              </span>
              <h2 className="font-bold text-lg sm:text-xl font-serif leading-tight">
                TÀI LIỆU KỸ THUẬT VÀ DEPLOYMENT
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 text-xs sm:text-sm">
          
          {/* Architecture overview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 uppercase font-serif text-sm flex items-center gap-1.5">
              <Server className="w-4 h-4 text-amber-700" />
              1. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hệ thống tra cứu nhãn hiệu được thiết kế theo kiến trúc Full-stack High Performance có khả năng mở rộng hàng triệu bản ghi:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
              <li><b>Frontend:</b> React 19 + TailwindCSS + Lucide Icons + Motion Layouts.</li>
              <li><b>Backend API Server:</b> Express.js (Node.js) chạy trên Port 3000 với cơ chế Proxying & Parallel Scraping.</li>
              <li><b>Database:</b> PostgreSQL + GIN Indexing cho tìm kiếm văn bản tiếng Việt & mảng nhóm Nice.</li>
              <li><b>AI Vision Engine:</b> Google Gemini API (gemini-3.6-flash) xử lý so sánh tương tự logo và thẩm định pháp lý SHTT.</li>
            </ul>
          </div>

          {/* Database Schema */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 uppercase font-serif text-sm flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-700" />
                2. DATABASE SCHEMA (POSTGRESQL)
              </h3>
              <button
                onClick={() => copyCode(sqlSchema, 'sql')}
                className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'sql' ? 'Đã sao chép SQL' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-amber-300 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
              {sqlSchema}
            </pre>
          </div>

          {/* Local Run */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 uppercase font-serif text-sm flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-amber-700" />
                3. HƯỚNG DẪN CHẠY LOCAL
              </h3>
              <button
                onClick={() => copyCode(localRunSteps, 'local')}
                className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'local' ? 'Đã sao chép' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-300 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
              {localRunSteps}
            </pre>
          </div>

          {/* Cloud Run Deployment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 uppercase font-serif text-sm flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-amber-700" />
                4. DEPLOY GOOGLE CLOUD RUN
              </h3>
              <button
                onClick={() => copyCode(cloudRunSteps, 'cloud')}
                className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'cloud' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'cloud' ? 'Đã sao chép' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-cyan-300 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
              {cloudRunSteps}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="bg-slate-900 text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
          >
            ĐÓNG TÀI LIỆU
          </button>
        </div>

      </div>
    </div>
  );
};
