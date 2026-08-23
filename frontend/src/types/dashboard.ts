import { AttendanceResponse } from "./attendance";
import { NoticeResponse } from "./notice";
import { OrderResponse } from "./order";
import { TaskResponse } from "./task";

/**
 * 매출 그래프 데이터
 */
export interface SalesChartResponse {
  label: string;
  sales: number;
}


export interface DashboardResponse {
  // 카드
  todaySales: number;
  todayOrderCount: number;
  workingEmployeeCount: number;
  lowStockCount: number;

  // 매출 그래프
  salesChart: SalesChartResponse[];

  // 공지사항
  notices: NoticeResponse[];

  // 오늘 할 일
  tasks: TaskResponse[];

  // 오늘 출근 직원
  workingEmployees: AttendanceResponse[];

  // 최근 주문
  recentOrders: OrderResponse[];

  // 오늘 날짜
  today: string;
}