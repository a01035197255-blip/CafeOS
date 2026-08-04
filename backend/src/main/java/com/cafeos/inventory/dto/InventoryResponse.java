package com.cafeos.inventory.dto;

import com.cafeos.inventory.entity.Inventory;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InventoryResponse {

    private Long id;

    private Long ingredientId;

    private String ingredientName;

    private Integer quantity;

    public static InventoryResponse from(Inventory inventory) {

        return InventoryResponse.builder()
                .id(inventory.getId())
                .ingredientId(inventory.getIngredient().getId())
                .ingredientName(inventory.getIngredient().getName())
                .quantity(inventory.getQuantity())
                .build();
    }
}