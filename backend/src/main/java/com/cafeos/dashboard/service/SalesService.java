package com.cafeos.dashboard.service;

import com.cafeos.dashboard.dto.CategorySalesResponse;
import com.cafeos.dashboard.dto.DailySalesResponse;
import com.cafeos.dashboard.dto.MonthlySalesResponse;
import com.cafeos.dashboard.dto.PopularMenuResponse;
import com.cafeos.dashboard.dto.SalesAnalysisResponse;
import com.cafeos.dashboard.dto.SalesChartResponse;
import com.cafeos.order.entity.Order;
import com.cafeos.order.entity.OrderItem;
import com.cafeos.order.entity.OrderStatus;
import com.cafeos.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalesService {

    private final OrderRepository orderRepository;

    /**
     * 매출 분석에 필요한 전체 데이터를 조회하여 반환
     */
    public SalesAnalysisResponse getSalesAnalysis() {

        // 현재 날짜와 현재 월을 가져옴
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);

        // 오늘의 시작 시간과 내일의 시작 시간을 구함
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime tomorrowStart = today.plusDays(1).atStartOfDay();

        // 오늘 발생한 주문 전체 조회
        List<Order> todayOrders = orderRepository.findByCreatedAtBetween(
                todayStart, tomorrowStart
        );

        // 오늘 주문 중 완료된 주문만 필터링
        List<Order> completedTodayOrders = todayOrders.stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .toList();

        // 오늘 완료된 주문의 총 매출 계산
        int todaySales = completedTodayOrders.stream()
                .mapToInt(Order::getTotalPrice)
                .sum();

        // 이번 달의 시작 시간과 다음 달의 시작 시간을 구함
        LocalDateTime monthStart = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime nextMonthStart = currentMonth.plusMonths(1).atDay(1).atStartOfDay();

        // 이번 달에 발생한 주문 전체 조회
        List<Order> monthOrders = orderRepository.findByCreatedAtBetween(
                monthStart, nextMonthStart
        );

        // 이번 달 주문 중 완료된 주문만 필터링
        List<Order> completedMonthOrders = monthOrders.stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .toList();

        // 이번 달 완료 주문의 총 매출 계산
        int monthlySales = completedMonthOrders.stream()
                .mapToInt(Order::getTotalPrice)
                .sum();

        // 이번 달 완료 주문 건수 계산
        int totalOrders = completedMonthOrders.size();

        // 평균 주문 금액 계산
        // 주문 건수가 0이면 0, 그렇지 않으면 이번 달 매출을 주문 건수로 나눔
        int averageOrderPrice = totalOrders == 0
                ? 0
                : monthlySales / totalOrders;

        // 최근 7일간의 매출 데이터를 생성
        List<SalesChartResponse> salesChart = IntStream.rangeClosed(0, 6)
                .mapToObj(daysAgo -> {

                    // 오늘을 기준으로 최근 7일의 날짜를 계산
                    LocalDate date = today.minusDays(6 - daysAgo);

                    // 해당 날짜의 시작 시간과 다음 날의 시작 시간을 구함
                    LocalDateTime start = date.atStartOfDay();
                    LocalDateTime end = date.plusDays(1).atStartOfDay();

                    // 해당 날짜의 주문 전체 조회
                    List<Order> orders = orderRepository.findByCreatedAtBetween(
                            start, end
                    );

                    // 해당 날짜의 완료된 주문만 대상으로 매출 계산
                    int sales = orders.stream()
                            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                            .mapToInt(Order::getTotalPrice)
                            .sum();

                    // 그래프에 사용할 날짜와 매출 데이터를 생성
                    return SalesChartResponse.builder()
                            .label(date.getMonthValue() + "/" + date.getDayOfMonth())
                            .sales(sales)
                            .build();

                })
                .toList();

        // 최근 12개월간의 월별 매출 데이터를 생성
        List<MonthlySalesResponse> monthlySalesChart = IntStream.rangeClosed(0, 11)
                .mapToObj(monthsAgo -> {

                    // 현재 월을 기준으로 최근 12개월의 월을 계산
                    YearMonth month = currentMonth.minusMonths(11 - monthsAgo);

                    // 해당 월의 시작 시간과 다음 달의 시작 시간을 구함
                    LocalDateTime start = month.atDay(1).atStartOfDay();
                    LocalDateTime end = month.plusMonths(1).atDay(1).atStartOfDay();

                    // 해당 월의 주문 전체 조회
                    List<Order> orders = orderRepository.findByCreatedAtBetween(
                            start, end
                    );

                    // 해당 월의 완료된 주문만 필터링
                    List<Order> completedOrders = orders.stream()
                            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                            .toList();

                    // 해당 월의 총 매출 계산
                    int sales = completedOrders.stream()
                            .mapToInt(Order::getTotalPrice)
                            .sum();

                    // 월, 매출, 주문 건수를 DTO로 생성
                    return MonthlySalesResponse.builder()
                            .month(month.getYear() + "-" + String.format("%02d", month.getMonthValue()))
                            .sales(sales)
                            .orderCount(completedOrders.size())
                            .build();

                })
                .toList();

        // 이번 달 완료된 주문에서 주문 상품만 추출
        List<OrderItem> completedItems = completedMonthOrders.stream()
                .flatMap(order -> order.getItems().stream())
                .toList();

        // 판매량 기준 인기 메뉴 TOP 5 계산
        List<PopularMenuResponse> popularMenus = completedItems.stream()
                // 메뉴 ID를 기준으로 주문 상품을 그룹화
                .collect(Collectors.groupingBy(item -> item.getMenu().getId()))
                .entrySet()
                .stream()
                .map(entry -> {

                    // 같은 메뉴에 해당하는 주문 상품 목록
                    List<OrderItem> items = entry.getValue();

                    // 해당 메뉴의 기본 정보로 사용할 첫 번째 주문 상품
                    OrderItem first = items.get(0);

                    // 해당 메뉴의 총 판매 수량 계산
                    int quantity = items.stream()
                            .mapToInt(OrderItem::getQuantity)
                            .sum();

                    // 해당 메뉴의 총 매출 계산
                    int sales = items.stream()
                            .mapToInt(item -> item.getPrice() * item.getQuantity())
                            .sum();

                    // 인기 메뉴 정보를 DTO로 생성
                    return PopularMenuResponse.builder()
                            .menuId(first.getMenu().getId())
                            .menuName(first.getMenu().getName())
                            .imageUrl(first.getMenu().getImageUrl())
                            .quantity(quantity)
                            .sales(sales)
                            .build();

                })
                // 판매 수량이 많은 순서대로 정렬
                .sorted(Comparator.comparing(PopularMenuResponse::getQuantity).reversed())
                // 상위 5개 메뉴만 선택
                .limit(5)
                .toList();

        // 이번 달 메뉴를 카테고리별로 묶어서 매출 계산
        List<CategorySalesResponse> categorySales = completedItems.stream()
                // 메뉴의 카테고리를 기준으로 주문 상품을 그룹화
                .collect(Collectors.groupingBy(item -> item.getMenu().getCategory().name()))
                .entrySet()
                .stream()
                .map(entry -> {

                    // 같은 카테고리에 해당하는 주문 상품 목록
                    List<OrderItem> items = entry.getValue();

                    // 해당 카테고리의 총 판매 수량 계산
                    int quantity = items.stream()
                            .mapToInt(OrderItem::getQuantity)
                            .sum();

                    // 해당 카테고리의 총 매출 계산
                    int sales = items.stream()
                            .mapToInt(item -> item.getPrice() * item.getQuantity())
                            .sum();

                    // 카테고리별 매출 정보를 DTO로 생성
                    return CategorySalesResponse.builder()
                            .category(entry.getKey())
                            .sales(sales)
                            .quantity(quantity)
                            .build();

                })
                // 매출이 높은 카테고리부터 정렬
                .sorted(Comparator.comparing(CategorySalesResponse::getSales).reversed())
                .toList();

        // 최근 7일의 일별 매출 상세 데이터를 생성
        List<DailySalesResponse> dailySales = IntStream.rangeClosed(0, 6)
                .mapToObj(daysAgo -> {

                    // 최근 7일 중 해당 날짜를 계산
                    LocalDate date = today.minusDays(6 - daysAgo);

                    // 해당 날짜의 시작 시간과 다음 날의 시작 시간을 구함
                    LocalDateTime start = date.atStartOfDay();
                    LocalDateTime end = date.plusDays(1).atStartOfDay();

                    // 해당 날짜의 주문 전체 조회
                    List<Order> orders = orderRepository.findByCreatedAtBetween(
                            start, end
                    );

                    // 해당 날짜의 완료된 주문만 필터링
                    List<Order> completedOrders = orders.stream()
                            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                            .toList();

                    // 해당 날짜의 총 매출 계산
                    int sales = completedOrders.stream()
                            .mapToInt(Order::getTotalPrice)
                            .sum();

                    // 전날 날짜 계산
                    LocalDate previousDate = date.minusDays(1);

                    // 전날의 주문 전체 조회
                    List<Order> previousOrders = orderRepository.findByCreatedAtBetween(
                            previousDate.atStartOfDay(), date.atStartOfDay()
                    );

                    // 전날 완료된 주문의 총 매출 계산
                    int previousSales = previousOrders.stream()
                            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                            .mapToInt(Order::getTotalPrice)
                            .sum();

                    // 전날 대비 매출 증감률 계산
                    // 전날 매출이 0이면 0으로 처리
                    double changeRate = previousSales == 0
                            ? 0
                            : ((double) (sales - previousSales) / previousSales) * 100;

                    // 일별 매출 상세 정보를 DTO로 생성
                    return DailySalesResponse.builder()
                            .date(date.getMonthValue() + "/" + date.getDayOfMonth())
                            .orderCount(completedOrders.size())
                            .sales(sales)
                            .changeRate(Math.round(changeRate * 10) / 10.0)
                            .build();

                })
                .toList();

        // 지금까지 계산한 모든 매출 데이터를 하나의 응답 DTO로 묶어서 반환
        return SalesAnalysisResponse.builder()
                .todaySales(todaySales)
                .monthlySales(monthlySales)
                .totalOrders(totalOrders)
                .averageOrderPrice(averageOrderPrice)
                .salesChart(salesChart)
                .monthlySalesChart(monthlySalesChart)
                .popularMenus(popularMenus)
                .categorySales(categorySales)
                .dailySales(dailySales)
                .build();
    }
}