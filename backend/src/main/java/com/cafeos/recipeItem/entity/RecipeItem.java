package com.cafeos.recipeItem.entity;

import com.cafeos.ingredient.entity.Ingredient;
import com.cafeos.recipe.entity.Recipe;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recipe_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RecipeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_item_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    // 사용량
    @Column(nullable = false)
    private Integer quantity;

    public void update(Integer quantity) {
        this.quantity = quantity;
    }
}