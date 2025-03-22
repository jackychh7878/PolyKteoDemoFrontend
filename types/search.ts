export interface SearchResult {
  title: string;
  description: string;
  url?: string;
  image?: string;
  official_title?: string;
  sys_id?: number;
  query?: string;
  ai_summary?: string;
  country_region?: string;
  department?: string;
  google_patent_link?: string;
  inventor?: string;
  similarity?: number;
  tech_sector?: string;
}
