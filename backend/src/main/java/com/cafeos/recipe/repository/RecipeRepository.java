package com.cafeos.recipe.repository;

import com.cafeos.menu.entity.Menu;
import com.cafeos.recipe.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    Optional<Recipe> findByMenu(Menu menu);

    boolean existsByMenu(Menu menu);
}