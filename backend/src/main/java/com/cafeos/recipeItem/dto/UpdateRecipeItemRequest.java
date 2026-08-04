package com.cafeos.recipeItem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UpdateRecipeItemRequest {

    @NotNull
    private Integer quantity;
}