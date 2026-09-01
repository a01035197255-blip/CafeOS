import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { AttendanceResponse } from "@/types/attendance";

/**
 * 출근
 */
export const checkIn = async (): Promise<void> => {
  await api.post<ApiResponse<void>>("/attendances/check-in");
};

/**
 * 퇴근
 */
export const checkOut = async (): Promise<void> => {
  await api.patch<ApiResponse<void>>("/attendances/check-out");
};

/**
 * 내 근태 목록 조회
 */
export const getMyAttendance = async (): Promise<
  AttendanceResponse[]
> => {
  const { data } = await api.get<
    ApiResponse<AttendanceResponse[]>
  >("/attendances/me");

  return data.data;
};

/**
 * 전체 근태 조회
 */
export const getAttendanceList =
  async (): Promise<AttendanceResponse[]> => {
    const { data } = await api.get<ApiResponse<AttendanceResponse[]>>(
      "/attendances"
    );

    return data.data;
  };