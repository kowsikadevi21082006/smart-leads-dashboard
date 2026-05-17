import axiosInstance from "./axios";
import {
  Lead,
  LeadFilters,
  LeadFormValues,
  PaginatedLeadsResponse,
} from "../types";

export const buildQueryParams = (filters: LeadFilters) => {
  const params = new URLSearchParams();

  params.set("page", String(filters.page));

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.source) {
    params.set("source", filters.source);
  }

  if (filters.search) {
    params.set("search", filters.search);
  }

  return params.toString();
};

export const getLeadsRequest = async (
  filters: LeadFilters
): Promise<PaginatedLeadsResponse> => {
  const query = buildQueryParams(filters);
  const { data } = await axiosInstance.get<PaginatedLeadsResponse>(`/leads?${query}`);
  return data;
};

export const createLeadRequest = async (
  payload: LeadFormValues
): Promise<Lead> => {
  const { data } = await axiosInstance.post<Lead>("/leads", payload);
  return data;
};

export const updateLeadRequest = async (
  id: string,
  payload: LeadFormValues
): Promise<Lead> => {
  const { data } = await axiosInstance.put<Lead>(`/leads/${id}`, payload);
  return data;
};

export const deleteLeadRequest = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/leads/${id}`);
};

export const exportLeadsRequest = async (
  filters: LeadFilters
): Promise<{ blob: Blob; fileName: string }> => {
  const query = buildQueryParams(filters);
  const response = await axiosInstance.get(`/leads/export?${query}`, {
    responseType: "blob",
  });

  const disposition = response.headers["content-disposition"];
  const matchedFileName = disposition?.match(/filename="?([^"]+)"?/i)?.[1];

  return {
    blob: response.data as Blob,
    fileName: matchedFileName || "leads-export.csv",
  };
};
