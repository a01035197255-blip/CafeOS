package com.cafeos.recipe.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.menu.entity.Menu;
import com.cafeos.menu.repository.MenuRepository;
import com.cafeos.recipe.dto.CreateRecipeRequest;
import com.cafeos.recipe.dto.UpdateRecipeRequest;
import com.cafeos.recipe.dto.RecipeResponse;
import com.cafeos.recipe.entity.Recipe;
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
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final MenuRepository menuRepository;
    private final UserRepository userRepository;

    /**
     * 레시피 등록
     */
    @Transactional
    public void createRecipe(String email,
                             CreateRecipeRequest request) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Menu menu = menuRepository.findById(request.getMenuId())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.MENU_NOT_FOUND));

        if (recipeRepository.existsByMenu(menu)) {
            throw new BusinessException(ErrorCode.RECIPE_ALREADY_EXISTS);
        }

        Recipe recipe = Recipe.builder()
                .menu(menu)
                .description(request.getDescription())
                .build();

        recipeRepository.save(recipe);
    }

    /**
     * 레시피 목록
     */
    public List<RecipeResponse> getRecipeList() {

        return recipeRepository.findAll()
                .stream()
                .map(RecipeResponse::from)
                .toList();
    }

    /**
     * 레시피 상세조회
     */
    public RecipeResponse getRecipe(Long recipeId) {

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.RECIPE_NOT_FOUND));

        return RecipeResponse.from(recipe);
    }

    /**
     * 레시피 수정
     */
    @Transactional
    public void updateRecipe(String email,
                             Long recipeId,
                             UpdateRecipeRequest request) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.RECIPE_NOT_FOUND));

        recipe.update(
                request.getDescription()
        );
    }

    /**
     * 레시피 삭제
     */
    @Transactional
    public void deleteRecipe(String email,
                             Long recipeId) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.RECIPE_NOT_FOUND));

        recipeRepository.delete(recipe);
    }
}