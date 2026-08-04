package com.cafeos.ingredient.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.ingredient.dto.CreateIngredientRequest;
import com.cafeos.ingredient.dto.UpdateIngredientRequest;
import com.cafeos.ingredient.dto.IngredientResponse;
import com.cafeos.ingredient.entity.Ingredient;
import com.cafeos.ingredient.repository.IngredientRepository;
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
public class IngredientService {

    private final IngredientRepository ingredientRepository;
    private final UserRepository userRepository;

    /**
     * 재료 등록
     */
    @Transactional
    public void createIngredient(String email,
                                 CreateIngredientRequest request) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        if (ingredientRepository.existsByName(request.getName())) {
            throw new BusinessException(ErrorCode.INGREDIENT_ALREADY_EXISTS);
        }

        Ingredient ingredient = Ingredient.builder()
                .name(request.getName())
                .unit(request.getUnit())
                .minimumStock(request.getMinimumStock())
                .enabled(true)
                .build();

        ingredientRepository.save(ingredient);
    }

    /**
     * 재료 목록
     */
    public List<IngredientResponse> getIngredientList() {

        return ingredientRepository.findAll()
                .stream()
                .map(IngredientResponse::from)
                .toList();
    }

    /**
     * 재료 상세조회
     */
    public IngredientResponse getIngredient(Long ingredientId) {

        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INGREDIENT_NOT_FOUND));

        return IngredientResponse.from(ingredient);
    }

    /**
     * 재료 수정
     */
    @Transactional
    public void updateIngredient(String email,
                                 Long ingredientId,
                                 UpdateIngredientRequest request) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INGREDIENT_NOT_FOUND));

        ingredient.update(
                request.getName(),
                request.getUnit(),
                request.getMinimumStock(),
                request.getEnabled()
        );
    }

    /**
     * 재료 삭제(비활성화)
     */
    @Transactional
    public void disableIngredient(String email,
                                  Long ingredientId) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INGREDIENT_NOT_FOUND));

        ingredient.changeEnabled(false);
    }
}