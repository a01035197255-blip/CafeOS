package com.cafeos.order.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.ingredient.entity.Ingredient;
import com.cafeos.inventory.entity.Inventory;
import com.cafeos.inventory.repository.InventoryRepository;
import com.cafeos.menu.entity.Menu;
import com.cafeos.menu.repository.MenuRepository;
import com.cafeos.order.dto.CreateOrderItemRequest;
import com.cafeos.order.dto.CreateOrderRequest;
import com.cafeos.order.dto.OrderResponse;
import com.cafeos.order.dto.UpdateOrderStatusRequest;
import com.cafeos.order.entity.Order;
import com.cafeos.order.entity.OrderItem;
import com.cafeos.order.entity.OrderStatus;
import com.cafeos.order.repository.OrderItemRepository;
import com.cafeos.order.repository.OrderRepository;
import com.cafeos.recipe.entity.Recipe;
import com.cafeos.recipeItem.entity.RecipeItem;
import com.cafeos.recipeItem.repository.RecipeItemRepository;
import com.cafeos.recipe.repository.RecipeRepository;
import com.cafeos.user.entity.User;

import com.cafeos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuRepository menuRepository;
    private final RecipeRepository recipeRepository;
    private final RecipeItemRepository recipeItemRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    /**
     * 주문 생성
     */
    @Transactional
    public void createOrder(String email,
                            CreateOrderRequest request){

        User user = userRepository.findByEmail(email)
                .orElseThrow(()->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.RECEIVED)
                .totalPrice(0)
                .build();

        orderRepository.save(order);

        int totalPrice = 0;

        for(CreateOrderItemRequest item : request.getItems()){

            Menu menu = menuRepository.findById(item.getMenuId())
                    .orElseThrow(()->
                            new BusinessException(ErrorCode.MENU_NOT_FOUND));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menu(menu)
                    .quantity(item.getQuantity())
                    .price(menu.getPrice())
                    .build();

            orderItemRepository.save(orderItem);

            totalPrice += menu.getPrice() * item.getQuantity();

            Recipe recipe = recipeRepository.findByMenu(menu)
                    .orElseThrow(()->
                            new BusinessException(ErrorCode.RECIPE_NOT_FOUND));

            List<RecipeItem> recipeItems =
                    recipeItemRepository.findByRecipe(recipe);

            for(RecipeItem recipeItem : recipeItems){

                Ingredient ingredient = recipeItem.getIngredient();

                Inventory inventory =
                        inventoryRepository.findByIngredientId(ingredient.getId())
                                .orElseThrow(()->
                                        new BusinessException(ErrorCode.INVENTORY_NOT_FOUND));

                int remain =
                        inventory.getQuantity()
                                - recipeItem.getQuantity() * item.getQuantity();

                if(remain < 0){
                    throw new BusinessException(
                            ErrorCode.INSUFFICIENT_STOCK);
                }

                inventory.stockOut(
                        recipeItem.getQuantity()
                                * item.getQuantity());
            }
        }

        order.changeTotalPrice(totalPrice);
    }

    /**
     * 주문 목록
     */
    public List<OrderResponse> getOrderList(){

        return orderRepository.findAll()
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    /**
     * 주문 상세조회
     */
    public OrderResponse getOrder(Long orderId){

        Order order = orderRepository.findById(orderId)
                .orElseThrow(()->
                        new BusinessException(ErrorCode.ORDER_NOT_FOUND));

        return OrderResponse.from(order);
    }

    /**
     * 주문 상태 변경
     */
    @Transactional
    public void changeStatus(Long orderId,
                             UpdateOrderStatusRequest request) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.ORDER_NOT_FOUND));

        order.changeStatus(request.getStatus());
    }

    /**
     * 주문 취소
     */
    @Transactional
    public void cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BusinessException(ErrorCode.ORDER_ALREADY_CANCELLED);
        }

        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new BusinessException(ErrorCode.ORDER_ALREADY_COMPLETED);
        }

        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);

        for (OrderItem orderItem : orderItems) {

            Menu menu = orderItem.getMenu();

            Recipe recipe = recipeRepository.findByMenu(menu)
                    .orElseThrow(() ->
                            new BusinessException(ErrorCode.RECIPE_NOT_FOUND));

            List<RecipeItem> recipeItems =
                    recipeItemRepository.findByRecipe(recipe);

            for (RecipeItem recipeItem : recipeItems) {

                Inventory inventory =
                        inventoryRepository.findByIngredientId(
                                        recipeItem.getIngredient().getId())
                                .orElseThrow(() ->
                                        new BusinessException(
                                                ErrorCode.INVENTORY_NOT_FOUND));

                inventory.stockIn(
                        recipeItem.getQuantity()
                                * orderItem.getQuantity());
            }
        }

        order.changeStatus(OrderStatus.CANCELLED);
    }
}