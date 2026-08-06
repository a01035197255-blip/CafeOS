package com.cafeos.ingredient.dto;

import com.cafeos.ingredient.entity.Ingredient;
import com.cafeos.ingredient.entity.IngredientUnit;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class IngredientResponse {

    private Long id;

    private String name;

    private IngredientUnit unit;


    private Boolean enabled;

    public static IngredientResponse from(Ingredient ingredient) {

        return IngredientResponse.builder()
                .id(ingredient.getId())
                .name(ingredient.getName())
                .unit(ingredient.getUnit())
                .enabled(ingredient.getEnabled())
                .build();
    }
}