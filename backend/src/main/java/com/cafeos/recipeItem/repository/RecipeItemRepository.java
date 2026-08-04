package com.cafeos.recipeItem.repository;

import com.cafeos.ingredient.entity.Ingredient;
import com.cafeos.recipe.entity.Recipe;
import com.cafeos.recipeItem.entity.RecipeItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeItemRepository extends JpaRepository<RecipeItem, Long> {

    List<RecipeItem> findByRecipe(Recipe recipe);

    boolean existsByRecipeAndIngredient(Recipe recipe, Ingredient ingredient);

}