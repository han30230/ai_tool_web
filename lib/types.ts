export type PricingType = "무료" | "유료" | "무료+유료";

export interface PricingPlanItem {
  name: string;
  price: string;
  desc?: string;
  /** Optional plan notes, e.g. "연간 결제" / "좌석당" */
  note?: string;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  pricing: PricingType;
  korean_support: boolean;
  website_url: string;
  logo_url?: string;
  featured: boolean;
  features?: string[];
  short_description?: string;
  use_cases?: string[];
  pros?: string[];
  cons?: string[];
  screenshots?: string[];
  last_updated_at?: string;
  pricing_plans?: PricingPlanItem[];
  /** Official pricing page (preferred over homepage for pricing). */
  pricing_url?: string;
  /** Pricing info last verified date (YYYY-MM-DD). */
  pricing_last_updated_at?: string;
  /** Extra pricing disclaimer (tax/region/limited promo). */
  pricing_note?: string;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
}
