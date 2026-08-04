package com.cafeos.recipeItem.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.ingredient.entity.Ingredient;
import com.cafeos.ingredient.repository.IngredientRepository;
import com.cafeos.recipeItem.dto.CreateRecipeItemRequest;
import com.cafeos.recipeItem.dto.UpdateRecipeItemRequest;
import com.cafeos.recipeItem.dto.RecipeItemResponse;
import com.cafeos.recipe.entity.Recipe;
import com.cafeos.recipeItem.entity.RecipeItem;
import com.cafeos.recipeItem.repository.RecipeItemRepository;
import com.cafeos.recipe.repository.RecipeRepository;
import com.cafeos.user.entity.User;
import com.cafeos.user.entity.UserRole;
import com.cafeos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecipeItemService {

    private final RecipeItemRepository recipeItemRepository;
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final UserRepository userRepository;

    /**
     * 레시피 재료 등록
     */
    @Transactional
    public void createRecipeItem(String email,
                                 CreateRecipeItemRequest request) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Recipe recipe = recipeRepository.findById(request.getRecipeId())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.RECIPE_NOT_FOUND));

        Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INGREDIENT_NOT_FOUND));

        if (recipeItemRepository.existsByRecipeAndIngredient(recipe, ingredient)) {
            throw new BusinessException(ErrorCode.RECIPE_ITEM_ALREADY_EXISTS);
        }

        RecipeItem recipeItem = RecipeItem.builder()
                .recipe(recipe)
                .ingredient(ingredient)
                .quantity(request.getQuantity())
                .build();

        recipeItemRepository.save(recipeItem);
    }

    /**
     * 레시피 재료 목록
     */
    public List<RecipeItemResponse> getRecipeItemList(Long recipeId) {

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.RECIPE_NOT_FOUND));

        return recipeItemRepository.findByRecipe(recipe)
                .stream()
                .map(RecipeItemResponse::from)
                .toList();
    }

    /**
     * 레시피 재료 상세조회
     */
    public RecipeItemResponse getRecipeItem(Long recipeItemId) {

        RecipeItem recipeItem = recipeItemRepository.findById(recipeItemId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.RECIPE_ITEM_NOT_FOUND));

        return RecipeItemResponse.from(recipeItem);
    }

    /**
     * 레시피 재료 수정
     */
    @Transactional
    public void updateRecipeItem(String email,
                                 Long recipeItemId,
                                 UpdateRecipeItemRequest request) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        RecipeItem recipeItem = recipeItemRepository.findById(recipeItemId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.RECIPE_ITEM_NOT_FOUND));

        recipeItem.update(
                request.getQuantity()
        );
    }

    /**
     * 레시피 재료 삭제
     */
    @Transactional
    public void deleteRecipeItem(String email,
                                 Long recipeItemId) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        RecipeItem recipeItem = recipeItemRepository.findById(recipeItemId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.RECIPE_ITEM_NOT_FOUND));

        recipeItemRepository.delete(recipeItem);
    }
}