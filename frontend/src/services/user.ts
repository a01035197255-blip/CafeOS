import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import {
  ChangePasswordRequest,
  CreateStaffRequest,
  StaffResponse,
  UpdateStaffRequest,
  UpdateMyInfoRequest,
  UserResponse,
} from "@/types/user";

/**
 * 직원 생성
 */
export const createStaff = async (
  request: CreateStaffRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>(
    "/users/staff",
    request
  );
};

/**
 * 직원 목록 조회
 */
export const getStaffList = async (): Promise<
  StaffResponse[]
> => {
  const { data } = await api.get<
    ApiResponse<StaffResponse[]>
  >("/users/staff");

  return data.data;
};

/**
 * 직원 상세 조회
 */
export const getStaff = async (
  staffId: number
): Promise<StaffResponse> => {
  const { data } = await api.get<
    ApiResponse<StaffResponse>
  >(`/users/staff/${staffId}`);

  return data.data;
};

/**
 * 직원 수정
 */
export const updateStaff = async (
  staffId: number,
  request: UpdateStaffRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/users/staff/${staffId}`,
    request
  );
};

/**
 * 직원 비활성화
 */
export const disableStaff = async (
  staffId: number
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/users/staff/${staffId}/disable`
  );
};

/**
 * 내 정보 조회
 */
export const getMyInfo = async (): Promise<UserResponse> => {
  const { data } = await api.get<
    ApiResponse<UserResponse>
  >("/users/me");

  return data.data;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  await api.post<ApiResponse<void>>(
    "/users/logout"
  );
};

/**
 * 내 정보 수정
 */
export const updateMyInfo = async (
  request: UpdateMyInfoRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    "/users/me",
    request
  );
};

/**
 * 비밀번호 변경
 */
export const changePassword = async (
  request: ChangePasswordRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    "/users/me/password",
    request
  );
};