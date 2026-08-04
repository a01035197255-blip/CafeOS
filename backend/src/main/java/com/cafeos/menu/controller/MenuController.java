package com.cafeos.menu.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.menu.dto.CreateMenuRequest;
import com.cafeos.menu.dto.UpdateMenuRequest;
import com.cafeos.menu.dto.MenuResponse;
import com.cafeos.menu.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menus")
public class MenuController {

    private final MenuService menuService;

    /**
     * 메뉴 등록
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createMenu(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CreateMenuRequest request
    ) {

        menuService.createMenu(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 메뉴 목록
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuResponse>>> getMenuList() {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        menuService.getMenuList()
                )
        );
    }

    /**
     * 메뉴 상세조회
     */
    @GetMapping("/{menuId}")
    public ResponseEntity<ApiResponse<MenuResponse>> getMenu(
            @PathVariable Long menuId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        menuService.getMenu(menuId)
                )
        );
    }

    /**
     * 메뉴 수정
     */
    @PatchMapping("/{menuId}")
    public ResponseEntity<ApiResponse<Void>> updateMenu(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long menuId,
            @RequestBody @Valid UpdateMenuRequest request
    ) {

        menuService.updateMenu(
                userDetails.getUsername(),
                menuId,
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 메뉴 삭제
     */
    @DeleteMapping("/{menuId}")
    public ResponseEntity<ApiResponse<Void>> deleteMenu(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long menuId
    ) {

        menuService.deleteMenu(
                userDetails.getUsername(),
                menuId
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 메뉴 판매여부 변경
     */
    @PatchMapping("/{menuId}/sale")
    public ResponseEntity<ApiResponse<Void>> changeSale(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long menuId,
            @RequestParam Boolean sale
    ) {

        menuService.changeSale(
                userDetails.getUsername(),
                menuId,
                sale
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }
}