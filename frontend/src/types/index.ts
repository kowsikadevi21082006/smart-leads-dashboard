export const leadStatuses = ["New", "Contacted", "Qualified", "Lost"] as const;
export const leadSources = ["Website", "Instagram", "Referral"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];
export type UserRole = "admin" | "sales";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: Pick<User, "id" | "name" | "email" | "role">;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LeadFormValues {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface LeadFilters {
  page: number;
  status: "" | LeadStatus;
  source: "" | LeadSource;
  search: string;
}

export interface PaginatedLeadsResponse {
  data: Lead[];
  total: number;
  page: number;
  totalPages: number;
}
