package com.cafeos.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DailySalesResponse {

    private String date;
    private Integer orderCount;
    private Integer sales;
    private Double changeRate;
}