package com.cafeos.order.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class CreateOrderItemRequest {

    @NotNull
    private Long menuId;

    @NotNull
    private Integer quantity;
}