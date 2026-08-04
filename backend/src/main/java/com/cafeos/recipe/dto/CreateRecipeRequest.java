package com.cafeos.recipe.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class CreateRecipeRequest {

    @NotNull
    private Long menuId;

    private String description;
}