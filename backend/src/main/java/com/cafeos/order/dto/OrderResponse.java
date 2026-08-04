package com.cafeos.order.dto;

import com.cafeos.order.entity.Order;
import com.cafeos.order.entity.OrderStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class OrderResponse {

    private Long id;

    private String employeeName;

    private Integer totalPrice;

    private OrderStatus status;

    private LocalDateTime createdAt;

    public static OrderResponse from(Order order){

        return OrderResponse.builder()
                .id(order.getId())
                .employeeName(order.getUser().getName())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}