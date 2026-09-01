package com.cafeos.inventory.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.inventory.dto.CreateInventoryRequest;
import com.cafeos.inventory.dto.InventoryPredictionResponse;
import com.cafeos.inventory.dto.UpdateInventoryRequest;
import com.cafeos.inventory.dto.InventoryResponse;
import com.cafeos.inventory.service.InventoryPredictionService;
import com.cafeos.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inventories")
public class InventoryController {

    private final InventoryService inventoryService;
    private final InventoryPredictionService inventoryPredictionService;

    /**
     * 재고 등록
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createInventory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CreateInventoryRequest request
    ) {

        inventoryService.createInventory(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 재고 목록
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getInventoryList() {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        inventoryService.getInventoryList()
                )
        );
    }

    /**
     * 재고 상세조회
     */
    @GetMapping("/{inventoryId}")
    public ResponseEntity<ApiResponse<InventoryResponse>> getInventory(
            @PathVariable Long inventoryId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        inventoryService.getInventory(inventoryId)
                )
        );
    }

    /**
     * 재고 수정
     */
    @PatchMapping("/{inventoryId}")
    public ResponseEntity<ApiResponse<Void>> updateInventory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long inventoryId,
            @RequestBody @Valid UpdateInventoryRequest request
    ) {

        inventoryService.updateInventory(
                userDetails.getUsername(),
                inventoryId,
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 최소 재고 기준 수정
     * OWNER / MANAGER 가능
     */
    @PatchMapping("/{inventoryId}/minimum-stock")
    public ResponseEntity<ApiResponse<Void>> updateMinimumStock(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long inventoryId,
            @RequestParam Integer minimumStock
    ) {

        inventoryService.updateMinimumStock(
                userDetails.getUsername(),
                inventoryId,
                minimumStock
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 재고 입고
     */
    @PatchMapping("/{inventoryId}/stock-in")
    public ResponseEntity<ApiResponse<Void>> stockIn(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long inventoryId,
            @RequestParam Integer quantity
    ) {

        inventoryService.stockIn(
                userDetails.getUsername(),
                inventoryId,
                quantity
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 재고 출고
     */
    @PatchMapping("/{inventoryId}/stock-out")
    public ResponseEntity<ApiResponse<Void>> stockOut(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long inventoryId,
            @RequestParam Integer quantity
    ) {

        inventoryService.stockOut(
                userDetails.getUsername(),
                inventoryId,
                quantity
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    @GetMapping("/prediction")
    public ResponseEntity<ApiResponse<List<InventoryPredictionResponse>>> predictAll() {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        inventoryPredictionService.predictAll()
                )
        );
    }

    /**
     * 재고 사용량 및 발주 예측
     */
    @GetMapping("/{inventoryId}/prediction")
    public ResponseEntity<ApiResponse<InventoryPredictionResponse>> predictInventory(
            @PathVariable Long inventoryId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        inventoryPredictionService.predict(inventoryId)
                )
        );
    }
}