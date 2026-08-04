package com.cafeos.recipe.dto;

import com.cafeos.recipe.entity.Recipe;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecipeResponse {

    private Long id;

    private Long menuId;

    private String menuName;

    private String description;

    public static RecipeResponse from(Recipe recipe) {

        return RecipeResponse.builder()
                .id(recipe.getId())
                .menuId(recipe.getMenu().getId())
                .menuName(recipe.getMenu().getName())
                .description(recipe.getDescription())
                .build();
    }
}