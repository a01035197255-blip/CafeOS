export type AttendanceStatus =
  | "WORKING"
  | "OFF_WORK";

export interface CheckInRequest {}

export interface AttendanceResponse {
  id: number;
  employee: string;
  userId: number;

  checkInTime: string | null;
  checkOutTime: string | null;

  workMinutes: number | null;

  late: boolean;

  status: AttendanceStatus;
}