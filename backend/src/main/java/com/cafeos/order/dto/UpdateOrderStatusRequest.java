package com.cafeos.order.dto;

import com.cafeos.order.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UpdateOrderStatusRequest {

    @NotNull
    private OrderStatus status;
}