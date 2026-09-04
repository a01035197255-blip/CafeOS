package com.cafeos.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysisResponse {

    // 전체 요약
    private String summary;

    // 매출 분석
    private String salesAnalysis;

    // 인기 메뉴 분석
    private String menuAnalysis;

    private String workforceAnalysis;

    // 재고 / 운영 분석
    private String inventoryAnalysis;

    // 개선 제안
    private List<String> recommendations;
}