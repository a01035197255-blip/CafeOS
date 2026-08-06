import { Gender } from "./user";

export interface EmailSendRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  code: string;
}

export interface PasswordResetSmsRequest {
  email: string;
  phone: string;
}

export interface PasswordVerifyRequest {
  email: string;
  code: string;
}

export interface PasswordResetRequest {
  email: string;
  newPassword: string;
}