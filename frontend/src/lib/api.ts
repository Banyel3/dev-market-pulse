const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface KPIData {
  jobs_last_24h: number;
  jobs_last_7d: number;
  unique_companies: number;
  unique_locations: number;
  total_skills: number;
  new_skills_this_week: number;
  median_salary: number | null;
}

export interface TrendDataPoint {
  date: string;
  jobs: number;
  skills?: number;
}

export interface TrendData {
  data: TrendDataPoint[];
  time_range: string;
}

export interface SkillItem {
  id: number;
  name: string;
  category: string;
  demand_count: number;
  growth_rate: number;
  median_salary: number | null;
}

export interface SkillsResponse {
  skills: SkillItem[];
  total: number;
}

export interface CompanyItem {
  id: number;
  name: string;
  industry: string;
  logo_url: string | null;
  active_jobs: number;
  top_skill: string | null;
}

export interface CompaniesResponse {
  companies: CompanyItem[];
  total: number;
}

export interface LocationItem {
  id: number;
  city: string;
  country: string;
  job_count: number;
  growth_rate: number;
  avg_salary: number;
}

export interface LocationsResponse {
  locations: LocationItem[];
  total: number;
}

export interface SalaryItem {
  role: string;
  min_salary: number;
  median_salary: number;
  max_salary: number;
  job_count: number;
}

export interface SalariesResponse {
  salaries: SalaryItem[];
  period: string;
  growth_yoy: number | null;
  top_paying_location: string | null;
  top_location_salary: number | null;
  top_paying_role: string | null;
  top_role_salary: number | null;
}

export interface JobStream {
  id: number;
  name: string;
  status: string;
  last_run: string | null;
  jobs_fetched: number;
  success_rate: number | null;
}

export interface JobStreamsResponse {
  streams: JobStream[];
}

export interface ExportItem {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  status: string;
  endpoint: string;
}

export interface ExportSummaryResponse {
  exports: ExportItem[];
  generated_at: string;
}

export interface JobsExportResponse {
  jobs: Array<{
    id: number;
    title: string;
    company_id: number | null;
    location_id: number | null;
    source: string;
    salary_min: number | null;
    salary_max: number | null;
    employment_type: string | null;
    seniority: string | null;
    remote_type: string | null;
    created_at: string | null;
  }>;
  total: number;
  exported_at: string;
}

export interface SkillsExportResponse {
  skills: Array<{
    id: number;
    name: string;
    category: string;
    demand_count: number;
  }>;
  total: number;
  exported_at: string;
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Dashboard KPIs
  getKPIs: () => fetchAPI<KPIData>("/api/dashboard/kpis"),

  // Trends
  getTrends: (timeRange: string = "7d") =>
    fetchAPI<TrendData>(`/api/dashboard/trends?time_range=${timeRange}`),

  // Skills
  getSkills: (params?: {
    search?: string;
    category?: string;
    time_range?: string;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.category) searchParams.set("category", params.category);
    if (params?.time_range) searchParams.set("time_range", params.time_range);
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());

    const query = searchParams.toString();
    return fetchAPI<SkillsResponse>(
      `/api/dashboard/skills${query ? `?${query}` : ""}`
    );
  },

  // Companies
  getCompanies: (params?: { limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    const query = searchParams.toString();
    return fetchAPI<CompaniesResponse>(
      `/api/dashboard/companies${query ? `?${query}` : ""}`
    );
  },

  // Locations
  getLocations: (params?: { region_group?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.region_group)
      searchParams.set("region_group", params.region_group);
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const query = searchParams.toString();
    return fetchAPI<LocationsResponse>(
      `/api/dashboard/locations${query ? `?${query}` : ""}`
    );
  },

  // Salaries
  getSalaries: (params?: { period?: "annual" | "monthly"; role?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set("period", params.period);
    if (params?.role) searchParams.set("role", params.role);
    const query = searchParams.toString();
    return fetchAPI<SalariesResponse>(
      `/api/dashboard/salaries${query ? `?${query}` : ""}`
    );
  },

  // Job Streams
  getJobStreams: () => fetchAPI<JobStreamsResponse>("/api/dashboard/streams"),

  // Exports
  getExportSummary: () => fetchAPI<ExportSummaryResponse>("/api/dashboard/exports/summary"),
  
  exportJobs: (format: "json" | "csv" = "json") => 
    fetchAPI<JobsExportResponse>(`/api/dashboard/exports/jobs?format=${format}`),
  
  exportSkills: () => fetchAPI<SkillsExportResponse>("/api/dashboard/exports/skills"),

  // Health check
  healthCheck: () => fetchAPI<{ status: string; version: string }>("/health"),
};
