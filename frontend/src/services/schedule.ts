import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type {
  CreateScheduleRequest,
  ScheduleResponse,
  UpdateScheduleRequest,
} from "@/types/schedule";

/**
 * 전체 스케줄 조회
 */
export const getScheduleList = async (): Promise<
  ScheduleResponse[]
> => {
  const { data } = await api.get<
    ApiResponse<ScheduleResponse[]>
  >("/schedules");

  return data.data;
};

/**
 * 날짜별 스케줄 조회
 */
export const getScheduleListByDate = async (
  workDate: string
): Promise<ScheduleResponse[]> => {
  const { data } = await api.get<
    ApiResponse<ScheduleResponse[]>
  >("/schedules/date", {
    params: {
      workDate,
    },
  });

  return data.data;
};

/**
 * 직원별 스케줄 조회
 */
export const getStaffSchedule = async (
  staffId: number
): Promise<ScheduleResponse[]> => {
  const { data } = await api.get<
    ApiResponse<ScheduleResponse[]>
  >(`/schedules/staff/${staffId}`);

  return data.data;
};

/**
 * 내 스케줄 조회
 */
export const getMySchedule = async (): Promise<
  ScheduleResponse[]
> => {
  const { data } = await api.get<
    ApiResponse<ScheduleResponse[]>
  >("/schedules/me");

  return data.data;
};

/**
 * 스케줄 등록
 */
export const createSchedule = async (
  request: CreateScheduleRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>(
    "/schedules",
    request
  );
};

/**
 * 스케줄 수정
 */
export const updateSchedule = async (
  scheduleId: number,
  request: UpdateScheduleRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/schedules/${scheduleId}`,
    request
  );
};

/**
 * 스케줄 삭제
 */
export const deleteSchedule = async (
  scheduleId: number
): Promise<void> => {
  await api.delete<ApiResponse<void>>(
    `/schedules/${scheduleId}`
  );
};