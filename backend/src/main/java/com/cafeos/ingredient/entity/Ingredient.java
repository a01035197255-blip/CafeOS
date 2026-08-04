package com.cafeos.ingredient.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ingredients")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_id")
    private Long id;

    // 재료명
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    // 단위
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IngredientUnit unit;

    // 최소 재고
    @Column(nullable = false)
    private Integer minimumStock;

    // 사용 여부
    @Builder.Default
    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void update(
            String name,
            IngredientUnit unit,
            Integer minimumStock,
            Boolean enabled
    ) {
        this.name = name;
        this.unit = unit;
        this.minimumStock = minimumStock;
        this.enabled = enabled;
    }

    public void changeEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}