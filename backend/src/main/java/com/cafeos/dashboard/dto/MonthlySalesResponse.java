package com.cafeos.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MonthlySalesResponse {

    private String month;
    private Integer sales;
    private Integer orderCount;
}