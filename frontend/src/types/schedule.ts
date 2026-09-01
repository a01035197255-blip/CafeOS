/**
 * 스케줄 정보
 */
export interface ScheduleResponse {
  id: number;
  userId: number;
  userName: string;
  workDate: string;
  startTime: string;
  endTime: string;
  memo: string | null;
}

/**
 * 스케줄 등록
 */
export interface CreateScheduleRequest {
  userId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  memo?: string;
}

/**
 * 스케줄 수정
 */
export interface UpdateScheduleRequest {
  workDate: string;
  startTime: string;
  endTime: string;
  memo?: string;
}