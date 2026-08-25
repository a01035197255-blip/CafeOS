package com.cafeos.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PopularMenuResponse {

    private Long menuId;
    private String menuName;
    private String imageUrl;
    private Integer quantity;
    private Integer sales;
}