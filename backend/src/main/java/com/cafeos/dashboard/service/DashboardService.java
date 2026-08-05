package com.cafeos.dashboard.service;

import com.cafeos.attendance.dto.AttendanceResponse;
import com.cafeos.attendance.entity.AttendanceStatus;
import com.cafeos.attendance.repository.AttendanceRepository;
import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.dashboard.dto.DashboardResponse;
import com.cafeos.notice.dto.NoticeResponse;
import com.cafeos.notice.repository.NoticeRepository;
import com.cafeos.inventory.repository.InventoryRepository;
import com.cafeos.order.dto.OrderResponse;
import com.cafeos.order.entity.Order;
import com.cafeos.order.entity.OrderStatus;
import com.cafeos.order.repository.OrderRepository;
import com.cafeos.task.dto.TaskResponse;
import com.cafeos.task.repository.TaskRepository;
import com.cafeos.user.entity.User;
import com.cafeos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final AttendanceRepository attendanceRepository;
    private final NoticeRepository noticeRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboard(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 오늘 매출
        Integer todaySales = orderRepository.findAll()
                .stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .mapToInt(Order::getTotalPrice)
                .sum();

        // 오늘 주문 수
        Long todayOrderCount =
                (long) orderRepository.findAll().size();

        // 현재 출근 직원 수
        Long workingEmployeeCount =
                attendanceRepository.findAll()
                        .stream()
                        .filter(attendance ->
                                attendance.getStatus() == AttendanceStatus.WORKING)
                        .count();

        // 재고 부족 개수
        Long lowStockCount =
                inventoryRepository.findAll()
                        .stream()
                        .filter(inventory ->
                                inventory.getQuantity() <=
                                        inventory.getIngredient().getMinimumStock())
                        .count();

        // 공지사항
        List<NoticeResponse> notices =
                noticeRepository.findAll()
                        .stream()
                        .limit(5)
                        .map(NoticeResponse::from)
                        .toList();

        // 역할별 업무
        List<TaskResponse> tasks =
                taskRepository.findByRole(user.getRole())
                        .stream()
                        .map(TaskResponse::from)
                        .toList();

        // 현재 출근 직원 목록
        List<AttendanceResponse> workingEmployees =
                attendanceRepository.findAll()
                        .stream()
                        .filter(attendance ->
                                attendance.getStatus() == AttendanceStatus.WORKING)
                        .map(AttendanceResponse::from)
                        .toList();

        // 최근 주문
        List<OrderResponse> recentOrders =
                orderRepository.findAll()
                        .stream()
                        .sorted((o1, o2) ->
                                o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                        .limit(5)
                        .map(OrderResponse::from)
                        .toList();

        return DashboardResponse.builder()
                .todaySales(todaySales)
                .todayOrderCount(todayOrderCount)
                .workingEmployeeCount(workingEmployeeCount)
                .lowStockCount(lowStockCount)
                .notices(notices)
                .tasks(tasks)
                .workingEmployees(workingEmployees)
                .recentOrders(recentOrders)
                .build();
    }
}