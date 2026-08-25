package com.cafeos.dashboard.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.dashboard.dto.SalesAnalysisResponse;
import com.cafeos.dashboard.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sales")
public class SalesController {

    private final SalesService salesService;

    /**
     * 매출 분석 조회
     */
    @GetMapping("/analysis")
    public ResponseEntity<ApiResponse<SalesAnalysisResponse>> getSalesAnalysis() {

        SalesAnalysisResponse response =
                salesService.getSalesAnalysis();

        return ResponseEntity.ok(
                ApiResponse.ok(response)
        );
    }
}