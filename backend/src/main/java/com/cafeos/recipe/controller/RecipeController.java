package com.cafeos.recipe.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.recipe.dto.CreateRecipeRequest;
import com.cafeos.recipe.dto.UpdateRecipeRequest;
import com.cafeos.recipe.dto.RecipeResponse;
import com.cafeos.recipe.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    /**
     * 레시피 등록
     */
    @PostMapping
    public ResponseEntity<ApiResponse<RecipeResponse>> createRecipe(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CreateRecipeRequest request
    ) {

        RecipeResponse response =
                recipeService.createRecipe(
                        userDetails.getUsername(),
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.ok(response)
        );
    }

    /**
     * 레시피 목록
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<RecipeResponse>>> getRecipeList() {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        recipeService.getRecipeList()
                )
        );
    }

    /**
     * 레시피 상세조회
     */
    @GetMapping("/{recipeId}")
    public ResponseEntity<ApiResponse<RecipeResponse>> getRecipe(
            @PathVariable Long recipeId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        recipeService.getRecipe(recipeId)
                )
        );
    }

    /**
     * 레시피 수정
     */
    @PatchMapping("/{recipeId}")
    public ResponseEntity<ApiResponse<Void>> updateRecipe(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recipeId,
            @RequestBody @Valid UpdateRecipeRequest request
    ) {

        recipeService.updateRecipe(
                userDetails.getUsername(),
                recipeId,
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 레시피 삭제
     */
    @DeleteMapping("/{recipeId}")
    public ResponseEntity<ApiResponse<Void>> deleteRecipe(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recipeId
    ) {

        recipeService.deleteRecipe(
                userDetails.getUsername(),
                recipeId
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }
}