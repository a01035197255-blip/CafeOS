package com.cafeos.ingredient.dto;

import com.cafeos.ingredient.entity.IngredientUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UpdateIngredientRequest {

    @NotBlank
    private String name;

    @NotNull
    private IngredientUnit unit;

    @NotNull
    private Integer minimumStock;

    @NotNull
    private Boolean enabled;
}