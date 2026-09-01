package com.cafeos.ai.service;

import com.cafeos.ai.dto.AiAnalysisResponse;
import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.dashboard.dto.SalesAnalysisResponse;
import com.cafeos.inventory.dto.InventoryPredictionResponse;
import com.cafeos.inventory.service.InventoryPredictionService;
import com.cafeos.user.entity.UserRole;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    private final ChatClient.Builder chatClientBuilder;

    private final InventoryPredictionService inventoryPredictionService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * AI 매장 운영 분석
     */
    public AiAnalysisResponse analyze(
            SalesAnalysisResponse salesData,
            UserRole userRole
    ) {

        try {

            // =========================================================
            // 매출 데이터 JSON 변환
            // =========================================================

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


            // =========================================================
            // 전체 재고 예측 데이터 생성
            // =========================================================
            //
            // 기존에는 최소 재고 이하인 재고만 AI에게 전달했지만,
            // 이제는 모든 재고의 사용량/소진일/발주량을 전달한다.
            //
            // AI가 단순 "재고 부족"이 아니라
            // 실제 사용량과 예상 소진 시점을 기준으로 판단하도록 한다.
            // =========================================================

            List<String> inventoryPredictionData =
                    inventoryPredictionService
                            .predictAll()
                            .stream()
                            .map(this::formatInventoryPrediction)
                            .toList();

            String inventoryPredictionJson =
                    String.join(
                            "\n\n",
                            inventoryPredictionData
                    );


            // =========================================================
            // AI Prompt
            // =========================================================

            String prompt = """
                    당신은 CafeOS 카페 매장 운영 전문 AI 분석가입니다.

                    당신의 목적은 단순히 매출, 주문, 인기 메뉴, 재고 데이터를
                    다시 나열하는 것이 아닙니다.

                    실제 매장 데이터를 종합적으로 분석하여
                    현재 매장에서 의미 있는 변화나 문제를 발견하고,
                    그 원인과 운영에 미칠 영향을 판단한 뒤,
                    현재 사용자의 역할에 맞는 구체적인 운영 행동을 추천하세요.


                    ==============================
                    [사용자 역할]
                    ==============================

                    %s

                    사용자 역할은 다음과 같습니다.

                    OWNER:
                    매장 전체 운영과 매출, 재고, 메뉴, 직원 관리에 대한
                    의사결정을 담당합니다.

                    MANAGER:
                    매장 운영과 재고, 메뉴, 직원 운영 등
                    일상적인 매장 관리를 담당합니다.

                    STAFF:
                    주문 처리, 메뉴 제조, 재고 확인 등
                    실제 매장 현장 업무를 담당합니다.

                    역할에 따라 같은 데이터를 보더라도
                    서로 다른 관점에서 필요한 업무를 판단하세요.


                    ==============================
                    [실제 매장 데이터]
                    ==============================

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


                    ==============================
                    [재고 예측 데이터]
                    ==============================

                    아래 데이터는 최근 7일 완료 주문과
                    메뉴별 레시피 사용량을 기준으로 계산된 재고 예측 데이터입니다.

                    각 재료에 대해 다음 정보를 제공합니다.

                    - 현재 재고
                    - 최소 재고
                    - 최근 7일 총 사용량
                    - 일 평균 사용량
                    - 예상 소진까지 남은 일수
                    - 예상 일일 소진량
                    - 권장 발주량
                    - 발주 필요 여부

                    %s


                    ==============================
                    [재고 분석 규칙]
                    ==============================

                    재고 예측 데이터의 숫자를 단순히 나열하지 말고
                    운영 관점에서 판단하세요.

                    예상 소진일이 3일 이하인 재료는
                    단기적인 재고 위험이 있는지 우선 검토하세요.

                    권장 발주량이 0보다 큰 경우
                    현재 재고와 예상 사용량을 고려하여
                    발주가 필요한지 판단하세요.

                    단, 숫자만으로 실제 발주를 확정하지 마세요.

                    다음과 같은 운영 판단으로 표현하세요.

                    - "발주를 검토하세요."
                    - "발주를 권장합니다."
                    - "재고 확보가 필요합니다."
                    - "현재 재고로 당분간 운영이 가능합니다."

                    현재 재고가 충분하고 예상 소진일까지 여유가 있다면
                    불필요하게 발주를 권고하지 마세요.

                    재고 상태가 정상인 경우에도
                    예상 소진일이 매우 짧거나 사용량이 급증한 경우에만
                    향후 재고 부족 가능성을 언급하세요.

                    재고 데이터와 인기 메뉴 데이터를 연결할 수 있다면
                    반드시 연결해서 분석하세요.

                    예를 들어 특정 인기 메뉴의 판매량이 높고
                    해당 메뉴에 사용되는 재료의 예상 소진일이 짧다면
                    단순 재고 부족보다 높은 운영 우선순위를 부여하세요.

                    반대로 특정 재료의 권장 발주량이 높더라도
                    실제 사용량이 매우 낮고 현재 재고가 충분하다면
                    불필요한 발주를 권고하지 마세요.


                    ==============================
                    [전체 분석 규칙]
                    ==============================

                    1. 단순히 숫자를 반복해서 설명하지 마세요.

                    2. 서로 다른 데이터를 연결해서
                    의미 있는 상황을 찾아내세요.

                    예:
                    - 매출 증가 + 특정 메뉴 판매 증가
                    - 인기 메뉴 증가 + 해당 메뉴 관련 재고 부족
                    - 매출 감소 + 주문 수 감소
                    - 특정 날짜의 매출 급증 또는 급감
                    - 특정 메뉴의 판매량이 다른 메뉴보다 높은 상황
                    - 인기 메뉴 판매 증가 + 원재료 예상 소진일 감소

                    3. 실제 데이터에서 확인할 수 있는
                    변화와 패턴을 우선적으로 분석하세요.

                    4. 데이터에 명확한 근거가 없는 원인을
                    사실처럼 단정하지 마세요.

                    5. 실제 재고 예측 데이터를 활용하여
                    재고 운영 판단을 내리세요.

                    6. 인기 메뉴와 재고 데이터를 연결할 수 있다면
                    해당 관계를 분석하세요.

                    7. 단순히
                    "재고를 관리하세요",
                    "매출을 확인하세요"
                    와 같은 일반적인 조언을 하지 마세요.

                    반드시 현재 데이터에서 발견된 상황을 근거로
                    사용자가 실제로 수행할 수 있는 행동을 추천하세요.

                    8. 모든 분석 결과에 억지로 문제를 만들지 마세요.

                    특별한 문제가 발견되지 않는 경우

                    "현재 데이터에서 특별한 운영 문제가 발견되지 않았습니다."

                    와 같이 판단하세요.

                    9. 추천사항은 중요도가 높은 순서대로 작성하세요.

                    10. 추천사항은 현재 로그인한 사용자의 역할에 맞는
                    실제 매장 업무가 되도록 작성하세요.


                    ==============================
                    [AI가 수행해야 할 분석]
                    ==============================

                    ① 매출 분석

                    최근 매출 흐름에서 의미 있는 변화가 있는지 판단하세요.

                    단순히 매출 금액을 읽어주지 말고,
                    증가/감소 또는 특이한 패턴이 있다면
                    그 의미를 설명하세요.


                    ② 메뉴 분석

                    인기 메뉴와 카테고리별 판매 데이터를 분석하세요.

                    특정 메뉴가 실제로 두드러지는 경우
                    다른 데이터와 연결하여 그 의미를 판단하세요.


                    ③ 재고 분석

                    재고 현황과 재고 예측 데이터를 함께 분석하세요.

                    현재 재고,
                    최소 재고,
                    최근 7일 총 사용량,
                    일 평균 사용량,
                    예상 소진일,
                    예상 소진량,
                    권장 발주량을 종합적으로 판단하세요.

                    특히 예상 소진일이 3일 이하인 재료는
                    단기적인 운영 위험이 있는지 우선 검토하세요.

                    인기 메뉴의 판매량과 해당 메뉴에 사용되는 재료의
                    재고 부족 또는 단기 소진 가능성이 연결되는 경우
                    이를 우선적으로 분석하세요.


                    ④ 운영 위험 분석

                    현재 데이터를 기준으로
                    매장 운영에 영향을 줄 가능성이 있는 문제를 찾아보세요.

                    단순히 재고가 적다는 이유만으로
                    운영 위험이라고 판단하지 말고,

                    실제 사용량,
                    예상 소진일,
                    인기 메뉴 판매량,
                    매출 흐름 등을 종합하여 판단하세요.


                    ⑤ 오늘의 운영 우선순위

                    현재 사용자가 오늘 가장 먼저 확인하거나
                    처리해야 할 일을 최대 3개까지 선정하세요.

                    각 업무는 반드시

                    "무엇을 해야 하는지"

                    뿐만 아니라

                    "왜 지금 해야 하는지"

                    를 실제 데이터에 근거하여 설명하세요.


                    ==============================
                    [중요한 판단 원칙]
                    ==============================

                    AI는 실제 발주를 실행하거나 확정하는 시스템이 아닙니다.

                    숫자를 근거로 운영 판단과 권고만 제시하세요.

                    예:

                    좋은 표현:
                    "우유의 예상 소진일이 2일이고
                    현재 재고가 최소 재고보다 낮으므로
                    재고 확보를 위해 발주를 권장합니다."

                    나쁜 표현:
                    "우유 8,206ml를 반드시 발주하세요."

                    또한 숫자가 충분한 경우에는
                    억지로 발주를 추천하지 마세요.


                    ==============================
                    [응답 형식]
                    ==============================

                    다음 JSON 형식으로만 응답하세요.

                    {
                      "summary": "현재 매장 상황에 대한 핵심 판단",

                      "salesAnalysis": "매출 데이터에서 발견된 의미 있는 변화와 그 의미",

                      "menuAnalysis": "인기 메뉴 및 카테고리 데이터를 종합한 분석",

                      "inventoryAnalysis": "재고 예측 데이터와 매출/메뉴 데이터를 연결한 분석",

                      "recommendations": [
                        "우선순위가 가장 높은 실제 운영 행동과 그 이유",
                        "두 번째로 중요한 실제 운영 행동과 그 이유",
                        "세 번째로 중요한 실제 운영 행동과 그 이유"
                      ]
                    }

                    반드시 실제로 제공된 데이터만 사용하세요.

                    존재하지 않는 메뉴,
                    재고,
                    매출,
                    직원 상태 등을 만들어내지 마세요.
                    """.formatted(
                    userRole.name(),
                    salesData.getTodaySales(),
                    salesData.getMonthlySales(),
                    salesData.getTotalOrders(),
                    salesData.getAverageOrderPrice(),
                    salesChartJson,
                    monthlySalesJson,
                    popularMenusJson,
                    categorySalesJson,
                    dailySalesJson,
                    inventoryPredictionJson
            );


            // =========================================================
            // AI 호출
            // =========================================================

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


    // =========================================================
    // 재고 예측 데이터 포맷
    // =========================================================

    private String formatInventoryPrediction(
            InventoryPredictionResponse data
    ) {

        return """
                재료명: %s
                현재 재고: %s%s
                최소 재고: %s%s
                최근 7일 총 사용량: %s%s
                일 평균 사용량: %s%s
                예상 소진까지: %s일
                예상 일일 소진량: %s%s
                권장 발주량: %s%s
                발주 필요 여부: %s
                """.formatted(
                data.getIngredientName(),

                data.getCurrentStock(),
                data.getUnit(),

                data.getMinimumStock(),
                data.getUnit(),

                data.getTotalUsage(),
                data.getUnit(),

                data.getAverageDailyUsage(),
                data.getUnit(),

                data.getExpectedDaysUntilEmpty(),

                data.getExpectedUsage(),
                data.getUnit(),

                data.getRecommendedOrderQuantity(),
                data.getUnit(),

                data.isOrderRequired()
                        ? "발주 검토 필요"
                        : "현재 발주 불필요"
        );
    }


    // =========================================================
    // AI JSON 파싱
    // =========================================================

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