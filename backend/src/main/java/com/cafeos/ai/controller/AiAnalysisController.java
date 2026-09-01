package com.cafeos.ai.controller;

import com.cafeos.ai.dto.AiAnalysisResponse;
import com.cafeos.ai.service.AiAnalysisService;
import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.dashboard.dto.SalesAnalysisResponse;
import com.cafeos.dashboard.service.SalesService;
import com.cafeos.user.entity.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiAnalysisController {

    private final AiAnalysisService aiAnalysisService;
    private final SalesService salesService;

    /**
     * AI 매출 및 운영 분석
     */
    @GetMapping("/analysis")
    public ResponseEntity<ApiResponse<AiAnalysisResponse>> analyze(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        SalesAnalysisResponse salesData =
                salesService.getSalesAnalysis();

        AiAnalysisResponse response =
                aiAnalysisService.analyze(
                        salesData,
                        userDetails.getRole()
                );

        return ResponseEntity.ok(
                ApiResponse.ok(response)
        );
    }
}