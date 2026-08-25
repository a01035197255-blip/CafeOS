package com.cafeos.order.dto;

import com.cafeos.order.entity.OrderItem;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderItemResponse {

    private Long id;

    private Long menuId;

    private String menuName;

    private String menuImageUrl;

    private Integer quantity;

    private Integer price;

    public static OrderItemResponse from(OrderItem orderItem) {

        return OrderItemResponse.builder()
                .id(orderItem.getId())
                .menuId(orderItem.getMenu().getId())
                .menuName(orderItem.getMenu().getName())
                .menuImageUrl(orderItem.getMenu().getImageUrl())
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .build();
    }
}