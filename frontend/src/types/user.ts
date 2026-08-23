import type {
  Gender,
  UserRole,
} from "@/types/user-role";

/**
 * 직원 정보
 */
export interface StaffResponse {
  id: number;
  email: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  role: UserRole;
  enabled: boolean;
}

/**
 * 직원 등록
 */
export interface CreateStaffRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  role: UserRole;
}

/**
 * 직원 수정
 */
export interface UpdateStaffRequest {
  name: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  role?: UserRole;
  enabled?: boolean;
}

/**
 * 내 정보
 */
export interface UserResponse {
  id: number;
  email: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  role: UserRole;
}

export interface UpdateMyInfoRequest {
  name: string;
  phone: string;
  birthDate: string;
  gender: Gender;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}