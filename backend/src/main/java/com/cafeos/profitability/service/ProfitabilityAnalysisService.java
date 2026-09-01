package com.cafeos.profitability.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.ingredient.entity.Ingredient;
import com.cafeos.order.entity.Order;
import com.cafeos.order.entity.OrderItem;
import com.cafeos.order.entity.OrderStatus;
import com.cafeos.order.repository.OrderRepository;
import com.cafeos.profitability.dto.MenuProfitabilityResponse;
import com.cafeos.recipe.entity.Recipe;
import com.cafeos.recipe.repository.RecipeRepository;
import com.cafeos.recipeItem.entity.RecipeItem;
import com.cafeos.recipeItem.repository.RecipeItemRepository;
import com.cafeos.user.entity.User;
import com.cafeos.user.entity.UserRole;
import com.cafeos.user.repository.UserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfitabilityAnalysisService {

    private final OrderRepository orderRepository;
    private final RecipeRepository recipeRepository;
    private final RecipeItemRepository recipeItemRepository;
    private final UserRepository userRepository;

    /**
     * 최근 30일 메뉴별 수익성 분석
     */
    public List<MenuProfitabilityResponse> analyze(String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        LocalDate today = LocalDate.now();

        LocalDateTime start =
                today.minusDays(30).atStartOfDay();

        LocalDateTime end =
                today.plusDays(1).atStartOfDay();

        // 최근 30일 완료 주문 조회
        List<Order> orders =
                orderRepository.findByStatusAndCreatedAtBetween(
                        OrderStatus.COMPLETED,
                        start,
                        end
                );

        /*
         * 메뉴별 수익성 데이터
         *
         * Key   : menuId
         * Value : 메뉴별 집계 데이터
         */
        Map<Long, MenuProfitData> profitDataMap =
                new HashMap<>();

        for (Order order : orders) {

            if (order.getItems() == null) {
                continue;
            }

            for (OrderItem orderItem : order.getItems()) {

                if (orderItem.getMenu() == null) {
                    continue;
                }

                Long menuId =
                        orderItem.getMenu().getId();

                /*
                 * 메뉴별 데이터 생성
                 */
                MenuProfitData data =
                        profitDataMap.computeIfAbsent(
                                menuId,
                                id -> new MenuProfitData(
                                        orderItem.getMenu().getId(),
                                        orderItem.getMenu().getName(),
                                        orderItem.getMenu().getPrice()
                                )
                        );

                /*
                 * 판매 수량
                 */
                data.addSalesQuantity(
                        orderItem.getQuantity()
                );

                /*
                 * 판매 금액
                 *
                 * 실제 주문에 저장된 가격 기준
                 */
                int salesAmount =
                        orderItem.getMenu().getPrice()
                                * orderItem.getQuantity();

                data.addSalesAmount(salesAmount);

                /*
                 * 메뉴 레시피 조회
                 */
                Recipe recipe =
                        recipeRepository
                                .findByMenu(orderItem.getMenu())
                                .orElseThrow(() ->
                                        new BusinessException(
                                                ErrorCode.RECIPE_NOT_FOUND
                                        )
                                );

                /*
                 * 레시피 재료 조회
                 */
                List<RecipeItem> recipeItems =
                        recipeItemRepository.findByRecipe(recipe);

                /*
                 * 메뉴 1개 제조에 필요한 원재료 원가
                 */
                int menuIngredientCost = 0;

                for (RecipeItem recipeItem : recipeItems) {

                    Ingredient ingredient =
                            recipeItem.getIngredient();

                    /*
                     * 재료 사용량 × 재료 1단위 원가
                     */
                    int ingredientCost =
                            recipeItem.getQuantity()
                                    * ingredient.getUnitCost();

                    menuIngredientCost += ingredientCost;
                }

                /*
                 * 실제 판매 수량만큼 총 원재료비 계산
                 */
                int totalIngredientCost =
                        menuIngredientCost
                                * orderItem.getQuantity();

                data.addIngredientCost(
                        totalIngredientCost
                );
            }
        }

        /*
         * 최종 수익성 계산
         */
        return profitDataMap.values()
                .stream()
                .map(data -> {

                    int profit =
                            data.getSalesAmount()
                                    - data.getIngredientCost();

                    double costRate = 0.0;
                    double profitRate = 0.0;

                    if (data.getSalesAmount() > 0) {

                        costRate =
                                (data.getIngredientCost() * 100.0)
                                        / data.getSalesAmount();

                        profitRate =
                                (profit * 100.0)
                                        / data.getSalesAmount();
                    }

                    return MenuProfitabilityResponse.builder()
                            .menuId(
                                    data.getMenuId()
                            )
                            .menuName(
                                    data.getMenuName()
                            )
                            .sellingPrice(
                                    data.getSellingPrice()
                            )
                            .salesQuantity(
                                    data.getSalesQuantity()
                            )
                            .salesAmount(
                                    data.getSalesAmount()
                            )
                            .ingredientCost(
                                    data.getIngredientCost()
                            )
                            .profit(
                                    profit
                            )
                            .costRate(
                                    Math.round(
                                            costRate * 100
                                    ) / 100.0
                            )
                            .profitRate(
                                    Math.round(
                                            profitRate * 100
                                    ) / 100.0
                            )
                            .build();
                })
                /*
                 * 이익률 높은 메뉴부터 정렬
                 */
                .sorted(
                        Comparator.comparing(
                                MenuProfitabilityResponse::getProfitRate
                        ).reversed()
                )
                .toList();
    }

    /**
     * 특정 메뉴 수익성 조회
     */
    public MenuProfitabilityResponse analyzeMenu(
            String email,
            Long menuId
    ) {

        return analyze(email)
                .stream()
                .filter(
                        result ->
                                result.getMenuId()
                                        .equals(menuId)
                )
                .findFirst()
                .orElseThrow(() ->
                        new BusinessException(
                                ErrorCode.MENU_NOT_FOUND
                        )
                );
    }

    /**
     * 메뉴별 수익성 계산용 내부 클래스
     */
    @Getter
    private static class MenuProfitData {

        private final Long menuId;

        private final String menuName;

        private final Integer sellingPrice;

        private int salesQuantity;

        private int salesAmount;

        private int ingredientCost;

        public MenuProfitData(
                Long menuId,
                String menuName,
                Integer sellingPrice
        ) {
            this.menuId = menuId;
            this.menuName = menuName;
            this.sellingPrice = sellingPrice;
        }

        /**
         * 판매 수량 누적
         */
        public void addSalesQuantity(
                int quantity
        ) {
            this.salesQuantity += quantity;
        }

        /**
         * 매출 누적
         */
        public void addSalesAmount(
                int amount
        ) {
            this.salesAmount += amount;
        }

        /**
         * 원재료비 누적
         */
        public void addIngredientCost(
                int cost
        ) {
            this.ingredientCost += cost;
        }
    }
}