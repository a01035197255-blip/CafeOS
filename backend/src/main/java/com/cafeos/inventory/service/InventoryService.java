package com.cafeos.inventory.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.ingredient.entity.Ingredient;
import com.cafeos.ingredient.repository.IngredientRepository;
import com.cafeos.inventory.dto.CreateInventoryRequest;
import com.cafeos.inventory.dto.UpdateInventoryRequest;
import com.cafeos.inventory.dto.InventoryResponse;
import com.cafeos.inventory.entity.Inventory;
import com.cafeos.inventory.repository.InventoryRepository;
import com.cafeos.user.entity.User;
import com.cafeos.user.entity.UserRole;
import com.cafeos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final IngredientRepository ingredientRepository;
    private final UserRepository userRepository;

    /**
     * 재고 등록
     */
    @Transactional
    public void createInventory(String email,
                                CreateInventoryRequest request) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INGREDIENT_NOT_FOUND));

        if (inventoryRepository.findByIngredientId(ingredient.getId()).isPresent()) {
            throw new BusinessException(ErrorCode.INVENTORY_ALREADY_EXISTS);
        }

        Inventory inventory = Inventory.builder()
                .ingredient(ingredient)
                .quantity(request.getQuantity())
                .build();

        inventoryRepository.save(inventory);
    }

    /**
     * 재고 목록
     */
    public List<InventoryResponse> getInventoryList() {

        return inventoryRepository.findAllByOrderByIdAsc()
                .stream()
                .map(InventoryResponse::from)
                .toList();
    }

    /**
     * 재고 상세조회
     */
    public InventoryResponse getInventory(Long inventoryId) {

        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INVENTORY_NOT_FOUND));

        return InventoryResponse.from(inventory);
    }

    /**
     * 재고 수정
     */
    @Transactional
    public void updateInventory(String email,
                                Long inventoryId,
                                UpdateInventoryRequest request) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INVENTORY_NOT_FOUND));

        inventory.update(request.getQuantity());
    }

    /**
     * 재고 입고
     */
    @Transactional
    public void stockIn(String email,
                        Long inventoryId,
                        Integer quantity) {

        User manager = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (manager.getRole() == UserRole.STAFF) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INVENTORY_NOT_FOUND));

        inventory.stockIn(quantity);
    }

    /**
     * 재고 출고
     */
    @Transactional
    public void stockOut(String email,
                         Long inventoryId,
                         Integer quantity) {

        User manager = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (manager.getRole() == UserRole.STAFF) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INVENTORY_NOT_FOUND));

        if (inventory.getQuantity() < quantity) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
        }

        inventory.stockOut(quantity);
    }
}