package com.cafeos.menu.dto;

import com.cafeos.menu.entity.MenuCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class CreateMenuRequest {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Integer price;

    @NotNull
    private MenuCategory category;

    private Boolean season;

    private String imageUrl;
}