import axiosInstance from "./axios";
import { AuthResponse, LoginCredentials, RegisterPayload } from "../types";

export const loginRequest = async (
  payload: LoginCredentials
): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>("/auth/login", payload);
  return data;
};

export const registerRequest = async (
  payload: RegisterPayload
): Promise<{ message: string }> => {
  const { data } = await axiosInstance.post<{ message: string }>(
    "/auth/register",
    payload
  );
  return data;
};
