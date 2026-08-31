package com.cafeos.ai.service;

import com.cafeos.ai.dto.AiAnalysisResponse;
import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.dashboard.dto.SalesAnalysisResponse;
import com.cafeos.inventory.entity.Inventory;
import com.cafeos.inventory.repository.InventoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    private final ChatClient.Builder chatClientBuilder;
    private final InventoryRepository inventoryRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiAnalysisResponse analyze(
            SalesAnalysisResponse salesData
    ) {

        try {

            // =========================
            // 매출 데이터 JSON 변환
            // =========================

            String salesChartJson =
                    objectMapper.writeValueAsString(
                            salesData.getSalesChart()
                    );

            String monthlySalesJson =
                    objectMapper.writeValueAsString(
                            salesData.getMonthlySalesChart()
                    );

            String popularMenusJson =
                    objectMapper.writeValueAsString(
                            salesData.getPopularMenus()
                    );

            String categorySalesJson =
                    objectMapper.writeValueAsString(
                            salesData.getCategorySales()
                    );

            String dailySalesJson =
                    objectMapper.writeValueAsString(
                            salesData.getDailySales()
                    );

            // =========================
            // 부족 재고 조회
            // =========================

            List<Inventory> lowStockInventories =
                    inventoryRepository.findAll()
                            .stream()
                            .filter(inventory ->
                                    inventory.getQuantity()
                                            <= inventory.getMinimumStock()
                            )
                            .toList();

            // =========================
            // 부족 재고 데이터 생성
            // =========================

            String inventoryData =
                    lowStockInventories.stream()
                            .map(inventory -> {

                                String unit = switch (
                                        inventory.getIngredient().getUnit()
                                        ) {
                                    case G -> "g";
                                    case KG -> "kg";
                                    case ML -> "ml";
                                    case L -> "L";
                                    case EA -> "개";
                                    case SHOT -> "샷";
                                };

                                return """
                            재료명: %s
                            현재 재고: %d%s
                            최소 재고: %d%s
                            부족 수량: %d%s
                            """.formatted(
                                        inventory.getIngredient().getName(),
                                        inventory.getQuantity(),
                                        unit,
                                        inventory.getMinimumStock(),
                                        unit,
                                        inventory.getMinimumStock()
                                                - inventory.getQuantity(),
                                        unit
                                );
                            })
                            .toList()
                            .toString();

            // =========================
            // AI Prompt
            // =========================

            String prompt = """
                    당신은 CafeOS 카페 매장 운영 전문 AI 분석가입니다.

                    아래는 실제 CafeOS 매장 데이터입니다.

                    [오늘 매출]
                    %d원

                    [이번 달 매출]
                    %d원

                    [이번 달 완료 주문 수]
                    %d건

                    [평균 주문 금액]
                    %d원

                    [최근 7일 매출]
                    %s

                    [최근 12개월 월별 매출]
                    %s

                    [인기 메뉴 TOP 5]
                    %s

                    [카테고리별 매출]
                    %s

                    [최근 7일 일별 매출]
                    %s

                    [현재 부족 재고]
                    %s

                    반드시 위에 제공된 실제 데이터만 사용해서 분석하세요.

                    재고 분석에서는 실제로 제공된 재료명을 반드시 사용하세요.
                    부족한 재고가 있다면 재료명과 현재 재고 수량을 구체적으로 언급하세요.

                    부족 재고가 없다면 재고 부족 문제가 없다고 명확하게 작성하세요.

                    데이터에 없는 내용은 추측하지 마세요.

                    다음 JSON 형식으로만 응답하세요.

                    {
                      "summary": "전체 매장 운영 요약",
                      "salesAnalysis": "매출 흐름과 주요 매출 데이터 분석",
                      "menuAnalysis": "인기 메뉴 및 카테고리별 판매 분석",
                      "inventoryAnalysis": "부족 재고 품목과 현재 재고 상태 분석",
                      "recommendations": [
                        "실제 데이터에 근거한 개선사항 1",
                        "실제 데이터에 근거한 개선사항 2",
                        "실제 데이터에 근거한 개선사항 3"
                      ]
                    }
                    """.formatted(
                    salesData.getTodaySales(),
                    salesData.getMonthlySales(),
                    salesData.getTotalOrders(),
                    salesData.getAverageOrderPrice(),
                    salesChartJson,
                    monthlySalesJson,
                    popularMenusJson,
                    categorySalesJson,
                    dailySalesJson,
                    inventoryData
            );

            // =========================
            // AI 호출
            // =========================

            String response = chatClientBuilder
                    .build()
                    .prompt()
                    .user(prompt)
                    .call()
                    .content();

            return parseResponse(response);

        } catch (Exception e) {

            e.printStackTrace();

            throw new BusinessException(
                    ErrorCode.AI_ANALYSIS_FAILED
            );
        }
    }

    // =========================
    // AI JSON 파싱
    // =========================

    private AiAnalysisResponse parseResponse(
            String response
    ) {

        try {

            return objectMapper.readValue(
                    response,
                    AiAnalysisResponse.class
            );

        } catch (Exception e) {

            e.printStackTrace();

            throw new BusinessException(
                    ErrorCode.AI_ANALYSIS_FAILED
            );
        }
    }
}