package com.cafeos.inventory.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class CreateInventoryRequest {

    @NotNull
    private Long ingredientId;

    @NotNull
    private Integer quantity;
}