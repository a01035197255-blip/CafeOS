package com.cafeos.inventory.dto;

import com.cafeos.ingredient.entity.IngredientUnit;
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

    private Integer minimumStock;

    private IngredientUnit unit;

    public static InventoryResponse from(Inventory inventory) {

        return InventoryResponse.builder()
                .id(inventory.getId())
                .ingredientId(inventory.getIngredient().getId())
                .ingredientName(inventory.getIngredient().getName())
                .quantity(inventory.getQuantity())
                .minimumStock(inventory.getMinimumStock())
                .unit(inventory.getIngredient().getUnit())
                .build();
    }
}