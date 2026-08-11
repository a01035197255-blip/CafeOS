export interface CheckInRequest {}

export interface AttendanceResponse {
  id: number;
  employee: string;
  checkInTime: string;
  checkOutTime: string | null;
  workMinutes: number | null;
}