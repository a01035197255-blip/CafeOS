package com.cafeos.profitability.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.profitability.dto.MenuProfitabilityResponse;
import com.cafeos.profitability.service.ProfitabilityAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/profitability")
public class ProfitabilityAnalysisController {

    private final ProfitabilityAnalysisService profitabilityAnalysisService;

    /**
     * 전체 메뉴 수익성 분석
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuProfitabilityResponse>>> getProfitability(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        profitabilityAnalysisService.analyze(
                                userDetails.getUsername()
                        )
                )
        );
    }

    /**
     * 특정 메뉴 수익성 분석
     */
    @GetMapping("/{menuId}")
    public ResponseEntity<ApiResponse<MenuProfitabilityResponse>> getMenuProfitability(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long menuId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        profitabilityAnalysisService.analyzeMenu(
                                userDetails.getUsername(),
                                menuId
                        )
                )
        );
    }
}