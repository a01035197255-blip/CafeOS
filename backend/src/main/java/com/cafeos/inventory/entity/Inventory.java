package com.cafeos.inventory.entity;

import com.cafeos.ingredient.entity.Ingredient;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventories")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long id;

    // 재료
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false, unique = true)
    private Ingredient ingredient;

    // 현재 재고
    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer minimumStock;

    // 마지막 입고일
    private LocalDateTime lastStockedAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void stockIn(Integer quantity) {
        this.quantity += quantity;
        this.lastStockedAt = LocalDateTime.now();
    }

    public void stockOut(Integer quantity) {
        this.quantity -= quantity;
    }

    public void update(Integer quantity) {
        this.quantity = quantity;
    }
}