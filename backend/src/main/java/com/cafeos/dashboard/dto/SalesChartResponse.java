package com.cafeos.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SalesChartResponse {

    private String label;
    private Integer sales;
}