package com.cafeos.recipeItem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class CreateRecipeItemRequest {

    @NotNull
    private Long recipeId;

    @NotNull
    private Long ingredientId;

    @NotNull
    private Integer quantity;
}