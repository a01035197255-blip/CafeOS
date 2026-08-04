package com.cafeos.menu.dto;

import com.cafeos.menu.entity.Menu;
import com.cafeos.menu.entity.MenuCategory;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MenuResponse {

    private Long id;

    private String name;

    private String description;

    private Integer price;

    private MenuCategory category;

    private Boolean sale;

    private String imageUrl;

    public static MenuResponse from(Menu menu) {

        return MenuResponse.builder()
                .id(menu.getId())
                .name(menu.getName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .category(menu.getCategory())
                .sale(menu.getSale())
                .imageUrl(menu.getImageUrl())
                .build();
    }
}