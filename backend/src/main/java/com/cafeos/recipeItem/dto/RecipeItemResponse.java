package com.cafeos.recipeItem.dto;

import com.cafeos.recipeItem.entity.RecipeItem;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecipeItemResponse {

    private Long id;

    private Long recipeId;

    private Long ingredientId;

    private String ingredientName;

    private Integer quantity;

    public static RecipeItemResponse from(RecipeItem recipeItem) {

        return RecipeItemResponse.builder()
                .id(recipeItem.getId())
                .recipeId(recipeItem.getRecipe().getId())
                .ingredientId(recipeItem.getIngredient().getId())
                .ingredientName(recipeItem.getIngredient().getName())
                .quantity(recipeItem.getQuantity())
                .build();
    }
}