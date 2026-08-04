package com.cafeos.recipeItem.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.recipeItem.dto.CreateRecipeItemRequest;
import com.cafeos.recipeItem.dto.UpdateRecipeItemRequest;
import com.cafeos.recipeItem.dto.RecipeItemResponse;
import com.cafeos.recipeItem.service.RecipeItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recipe-items")
public class RecipeItemController {

    private final RecipeItemService recipeItemService;

    /**
     * 레시피 재료 등록
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createRecipeItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CreateRecipeItemRequest request
    ) {

        recipeItemService.createRecipeItem(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 레시피 재료 목록
     */
    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<ApiResponse<List<RecipeItemResponse>>> getRecipeItemList(
            @PathVariable Long recipeId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        recipeItemService.getRecipeItemList(recipeId)
                )
        );
    }

    /**
     * 레시피 재료 상세조회
     */
    @GetMapping("/{recipeItemId}")
    public ResponseEntity<ApiResponse<RecipeItemResponse>> getRecipeItem(
            @PathVariable Long recipeItemId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        recipeItemService.getRecipeItem(recipeItemId)
                )
        );
    }

    /**
     * 레시피 재료 수정
     */
    @PatchMapping("/{recipeItemId}")
    public ResponseEntity<ApiResponse<Void>> updateRecipeItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recipeItemId,
            @RequestBody @Valid UpdateRecipeItemRequest request
    ) {

        recipeItemService.updateRecipeItem(
                userDetails.getUsername(),
                recipeItemId,
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 레시피 재료 삭제
     */
    @DeleteMapping("/{recipeItemId}")
    public ResponseEntity<ApiResponse<Void>> deleteRecipeItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recipeItemId
    ) {

        recipeItemService.deleteRecipeItem(
                userDetails.getUsername(),
                recipeItemId
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }
}