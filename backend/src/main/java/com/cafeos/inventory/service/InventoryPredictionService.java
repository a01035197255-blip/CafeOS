package com.cafeos.inventory.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.inventory.dto.InventoryPredictionResponse;
import com.cafeos.inventory.entity.Inventory;
import com.cafeos.inventory.repository.InventoryRepository;
import com.cafeos.order.entity.Order;
import com.cafeos.order.entity.OrderItem;
import com.cafeos.order.entity.OrderStatus;
import com.cafeos.order.repository.OrderRepository;
import com.cafeos.recipe.entity.Recipe;
import com.cafeos.recipe.repository.RecipeRepository;
import com.cafeos.recipeItem.entity.RecipeItem;
import com.cafeos.recipeItem.repository.RecipeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryPredictionService {

    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final RecipeRepository recipeRepository;
    private final RecipeItemRepository recipeItemRepository;

    /**
     * 전체 재고 AI 발주 예측
     *
     * 최근 7일 완료 주문을 한 번만 조회하고
     * 재료별 사용량을 계산하여 전체 재고의
     * 평균 사용량 / 예상 소진일 / 권장 발주량을 계산한다.
     */
    public List<InventoryPredictionResponse> predictAll() {

        LocalDate today = LocalDate.now();

        LocalDateTime start =
                today.minusDays(7).atStartOfDay();

        LocalDateTime end =
                today.plusDays(1).atStartOfDay();

        // ==========================================
        // 최근 7일 완료 주문
        // ==========================================

        List<Order> orders =
                orderRepository.findByStatusAndCreatedAtBetween(
                        OrderStatus.COMPLETED,
                        start,
                        end
                );

        // ==========================================
        // 재료 ID별 최근 7일 총 사용량
        // ==========================================

        Map<Long, Integer> usageMap =
                new HashMap<>();

        for (Order order : orders) {

            if (order.getItems() == null) {
                continue;
            }

            for (OrderItem orderItem : order.getItems()) {

                Recipe recipe =
                        recipeRepository.findByMenu(
                                orderItem.getMenu()
                        ).orElseThrow(() ->
                                new BusinessException(
                                        ErrorCode.RECIPE_NOT_FOUND
                                )
                        );

                List<RecipeItem> recipeItems =
                        recipeItemRepository.findByRecipe(
                                recipe
                        );

                for (RecipeItem recipeItem : recipeItems) {

                    Long ingredientId =
                            recipeItem
                                    .getIngredient()
                                    .getId();

                    int usage =
                            recipeItem.getQuantity()
                                    * orderItem.getQuantity();

                    usageMap.merge(
                            ingredientId,
                            usage,
                            Integer::sum
                    );
                }
            }
        }

        // ==========================================
        // 전체 재고 예측
        // ==========================================

        return inventoryRepository.findAll()
                .stream()
                .map(inventory -> {

                    Long ingredientId =
                            inventory
                                    .getIngredient()
                                    .getId();

                    int totalUsage =
                            usageMap.getOrDefault(
                                    ingredientId,
                                    0
                            );

                    return calculatePrediction(
                            inventory,
                            totalUsage
                    );
                })
                .toList();
    }

    /**
     * 특정 재고 AI 예측
     */
    public InventoryPredictionResponse predict(
            Long inventoryId
    ) {

        Inventory inventory =
                inventoryRepository.findById(inventoryId)
                        .orElseThrow(() ->
                                new BusinessException(
                                        ErrorCode.INVENTORY_NOT_FOUND
                                )
                        );

        LocalDate today =
                LocalDate.now();

        LocalDateTime start =
                today.minusDays(7)
                        .atStartOfDay();

        LocalDateTime end =
                today.plusDays(1)
                        .atStartOfDay();

        // 최근 7일 완료 주문
        List<Order> orders =
                orderRepository.findByStatusAndCreatedAtBetween(
                        OrderStatus.COMPLETED,
                        start,
                        end
                );

        int totalUsage = 0;

        // 해당 재료가 사용된 총량 계산
        for (Order order : orders) {

            if (order.getItems() == null) {
                continue;
            }

            for (OrderItem orderItem :
                    order.getItems()) {

                Recipe recipe =
                        recipeRepository.findByMenu(
                                orderItem.getMenu()
                        ).orElseThrow(() ->
                                new BusinessException(
                                        ErrorCode.RECIPE_NOT_FOUND
                                )
                        );

                List<RecipeItem> recipeItems =
                        recipeItemRepository.findByRecipe(
                                recipe
                        );

                for (RecipeItem recipeItem :
                        recipeItems) {

                    if (!recipeItem
                            .getIngredient()
                            .getId()
                            .equals(
                                    inventory
                                            .getIngredient()
                                            .getId()
                            )) {
                        continue;
                    }

                    totalUsage +=
                            recipeItem.getQuantity()
                                    * orderItem.getQuantity();
                }
            }
        }

        return calculatePrediction(
                inventory,
                totalUsage
        );
    }

    /**
     * 재고 하나의 사용량 및 발주량 계산
     */
    private InventoryPredictionResponse calculatePrediction(
            Inventory inventory,
            int totalUsage
    ) {

        // ==========================================
        // 최근 7일 일 평균 사용량
        // ==========================================

        double averageDailyUsage =
                totalUsage / 7.0;

        // ==========================================
        // 예상 소진까지 남은 일수
        // ==========================================

        double expectedDaysUntilEmpty = 0;

        if (averageDailyUsage > 0) {

            expectedDaysUntilEmpty =
                    inventory.getQuantity()
                            / averageDailyUsage;
        }

        // ==========================================
        // 목표 재고
        //
        // 일 평균 사용량 3일치
        // +
        // 최소 재고
        // ==========================================

        int targetStock =
                (int) Math.ceil(
                        averageDailyUsage * 3
                )
                        + inventory.getMinimumStock();

        // ==========================================
        // 권장 발주량
        // ==========================================

        int recommendedOrderQuantity =
                Math.max(
                        0,
                        targetStock
                                - inventory.getQuantity()
                );

        // ==========================================
        // 발주 필요 여부
        // ==========================================

        boolean orderRequired =
                inventory.getQuantity()
                        <= inventory.getMinimumStock();

        // ==========================================
        // 1일 예상 사용량
        // ==========================================

        int expectedUsage =
                (int) Math.ceil(
                        averageDailyUsage
                );

        // ==========================================
        // 응답
        // ==========================================

        return InventoryPredictionResponse.builder()

                .ingredientName(
                        inventory
                                .getIngredient()
                                .getName()
                )

                .currentStock(
                        inventory.getQuantity()
                )

                .minimumStock(
                        inventory.getMinimumStock()
                )

                .unit(
                        getUnit(inventory)
                )

                .totalUsage(
                        totalUsage
                )

                .averageDailyUsage(
                        Math.round(
                                averageDailyUsage * 100
                        ) / 100.0
                )

                .expectedDaysUntilEmpty(
                        (double) Math.ceil(
                                expectedDaysUntilEmpty
                        )
                )

                .expectedUsage(
                        expectedUsage
                )

                .recommendedOrderQuantity(
                        recommendedOrderQuantity
                )

                .orderRequired(
                        orderRequired
                )

                .build();
    }

    /**
     * 재료 단위
     */
    private String getUnit(
            Inventory inventory
    ) {

        return switch (
                inventory
                        .getIngredient()
                        .getUnit()
                ) {

            case G -> "g";

            case KG -> "kg";

            case ML -> "ml";

            case L -> "L";

            case EA -> "개";

            case SHOT -> "샷";
        };
    }
}