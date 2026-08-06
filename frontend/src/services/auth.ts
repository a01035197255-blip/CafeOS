import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  EmailSendRequest,
  LoginRequest,
  LoginResponse,
  PasswordResetRequest,
  PasswordResetSmsRequest,
  PasswordVerifyRequest,
  RefreshRequest,
  SignupRequest,
} from "@/types/auth";

export const sendEmailCode = async (
  request: EmailSendRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>("/auth/email/send", request);
};

export const signup = async (
  request: SignupRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>("/auth/signup", request);
};

export const login = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await api.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    request
  );

  return data.data;
};

export const reissue = async (
  request: RefreshRequest
): Promise<LoginResponse> => {
  const { data } = await api.post<ApiResponse<LoginResponse>>(
    "/auth/reissue",
    request
  );

  return data.data;
};

export const sendPasswordResetCode = async (
  request: PasswordResetSmsRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>(
    "/auth/password/send",
    request
  );
};

export const verifyPasswordResetCode = async (
  request: PasswordVerifyRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>(
    "/auth/password/verify",
    request
  );
};

export const resetPassword = async (
  request: PasswordResetRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    "/auth/password/reset",
    request
  );
};