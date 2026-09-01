package com.cafeos.profitability.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MenuProfitabilityResponse {

    private Long menuId;

    private String menuName;

    private Integer sellingPrice;

    private Integer salesQuantity;

    private Integer salesAmount;

    private Integer ingredientCost;

    private Integer profit;

    private Double costRate;

    private Double profitRate;
}