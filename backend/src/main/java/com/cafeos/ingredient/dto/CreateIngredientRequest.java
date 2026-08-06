package com.cafeos.ingredient.dto;

import com.cafeos.ingredient.entity.IngredientUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class CreateIngredientRequest {

    @NotBlank
    private String name;

    @NotNull
    private IngredientUnit unit;

}