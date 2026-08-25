package com.cafeos.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategorySalesResponse {

    private String category;
    private Integer sales;
    private Integer quantity;
}