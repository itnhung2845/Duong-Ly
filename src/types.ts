export type SourceType = 'WIPO Publish' | 'WIPO BrandDB' | 'Interbra' | 'All';

export type TrademarkStatus = 
  | 'Đang xử lý' 
  | 'Đã cấp' 
  | 'Hết hiệu lực' 
  | 'Chờ nộp phí' 
  | 'Từ chối'
  | 'Đã rút đơn';

export type MarkType = 
  | 'Nhãn hiệu kết hợp' 
  | 'Nhãn hiệu chữ' 
  | 'Nhãn hiệu hình' 
  | 'Nhãn hiệu 3D' 
  | 'Nhãn hiệu âm thanh';

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

export interface Trademark {
  id: string;
  application_number: string;
  national_application_number?: string;
  registration_number: string;
  brand_name: string;
  brand_image: string;
  mark_type: MarkType;
  owner: string;
  owner_address?: string;
  representative?: string;
  country: string;
  nice_class: number[];
  goods_services_description?: Record<number, string>;
  status: TrademarkStatus;
  application_date: string;
  registration_date?: string;
  expiration_date?: string;
  publication_date?: string;
  source: SourceType;
  detail_url: string;
  pdf_url?: string;
  disclaimer?: string;
  vienna_codes?: string[];
  notes?: string;
}

export interface SearchQuery {
  q: string;
  nice_class?: number;
  status?: string;
  source?: SourceType;
  country?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  total: number;
  detected_type: 'application_number' | 'registration_number' | 'brand_name' | 'unknown';
  primary_source: SourceType;
  trademarks: Trademark[];
  search_time_ms: number;
}

export interface SimilarSearchRequest {
  target_id?: string;
  brand_name?: string;
  logo_base64?: string;
  nice_classes?: number[];
  search_type: 'text' | 'phonetic' | 'logo' | 'all';
}

export interface SimilarMatchItem {
  trademark: Trademark;
  similarity_score: number; // 0 to 100
  similarity_reasons: string[];
  match_type: 'text' | 'phonetic' | 'logo';
}

export interface SimilarSearchResponse {
  target_name?: string;
  matches: SimilarMatchItem[];
  ai_analysis_summary?: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  detected_type: string;
  source: SourceType;
  results_count: number;
  timestamp: string;
}

export interface SystemStats {
  total_trademarks: number;
  vn_count: number;
  wipo_count: number;
  interbra_count: number;
  status_breakdown: Record<string, number>;
  top_nice_classes: { class_num: number; count: number; name: string }[];
}
