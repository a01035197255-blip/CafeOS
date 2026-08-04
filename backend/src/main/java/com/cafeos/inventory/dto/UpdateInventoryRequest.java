package com.cafeos.inventory.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UpdateInventoryRequest {

    @NotNull
    private Integer quantity;
}