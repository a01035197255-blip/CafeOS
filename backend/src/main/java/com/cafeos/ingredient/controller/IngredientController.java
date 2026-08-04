package com.cafeos.ingredient.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.ingredient.dto.CreateIngredientRequest;
import com.cafeos.ingredient.dto.UpdateIngredientRequest;
import com.cafeos.ingredient.dto.IngredientResponse;
import com.cafeos.ingredient.service.IngredientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ingredients")
public class IngredientController {

    private final IngredientService ingredientService;

    /**
     * 재료 등록
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createIngredient(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CreateIngredientRequest request
    ) {

        ingredientService.createIngredient(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 재료 목록
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<IngredientResponse>>> getIngredientList() {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        ingredientService.getIngredientList()
                )
        );
    }

    /**
     * 재료 상세조회
     */
    @GetMapping("/{ingredientId}")
    public ResponseEntity<ApiResponse<IngredientResponse>> getIngredient(
            @PathVariable Long ingredientId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        ingredientService.getIngredient(ingredientId)
                )
        );
    }

    /**
     * 재료 수정
     */
    @PatchMapping("/{ingredientId}")
    public ResponseEntity<ApiResponse<Void>> updateIngredient(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long ingredientId,
            @RequestBody @Valid UpdateIngredientRequest request
    ) {

        ingredientService.updateIngredient(
                userDetails.getUsername(),
                ingredientId,
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 재료 비활성화
     */
    @PatchMapping("/{ingredientId}/disable")
    public ResponseEntity<ApiResponse<Void>> disableIngredient(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long ingredientId
    ) {

        ingredientService.disableIngredient(
                userDetails.getUsername(),
                ingredientId
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }
}