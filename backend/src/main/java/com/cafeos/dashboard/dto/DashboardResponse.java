package com.cafeos.dashboard.dto;

import com.cafeos.attendance.dto.AttendanceResponse;
import com.cafeos.notice.dto.NoticeResponse;
import com.cafeos.order.dto.OrderResponse;
import com.cafeos.task.dto.TaskResponse;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class DashboardResponse {

    // 카드
    private Integer todaySales;

    private Long todayOrderCount;

    private Long workingEmployeeCount;

    private Long lowStockCount;

    // 공지
    private List<NoticeResponse> notices;

    // 업무
    private List<TaskResponse> tasks;

    // 오늘 출근 직원
    private List<AttendanceResponse> workingEmployees;

    // 최근 주문
    private List<OrderResponse> recentOrders;

    private LocalDate today;
}