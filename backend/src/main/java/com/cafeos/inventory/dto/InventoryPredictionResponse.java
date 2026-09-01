package com.cafeos.inventory.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InventoryPredictionResponse {

    // 재료명
    private String ingredientName;

    // 현재 재고
    private Integer currentStock;

    // 최소 재고
    private Integer minimumStock;

    // 단위
    private String unit;

    // 최근 7일 총 사용량
    private Integer totalUsage;

    // 일 평균 사용량
    private Double averageDailyUsage;

    // 예상 소진까지 남은 일수
    private Double expectedDaysUntilEmpty;

    // 예상 소진량
    private Integer expectedUsage;

    // 권장 발주량
    private Integer recommendedOrderQuantity;

    // 발주 필요 여부
    private Boolean orderRequired;

    public boolean isOrderRequired() {
        return Boolean.TRUE.equals(orderRequired);
    }
}