package com.cafeos.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SalesAnalysisResponse {

    private Integer todaySales;
    private Integer monthlySales;
    private Integer totalOrders;
    private Integer averageOrderPrice;

    private List<SalesChartResponse> salesChart;

    private List<MonthlySalesResponse> monthlySalesChart;

    private List<PopularMenuResponse> popularMenus;

    private List<CategorySalesResponse> categorySales;

    private List<DailySalesResponse> dailySales;
}