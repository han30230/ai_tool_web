export type PricingType = "무료" | "유료" | "무료+유료";

export interface PricingPlanItem {
  name: string;
  price: string;
  desc?: string;
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
}

export interface CategoryInfo {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
}
