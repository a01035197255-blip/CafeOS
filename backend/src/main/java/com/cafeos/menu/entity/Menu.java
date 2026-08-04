package com.cafeos.menu.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "menus")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private Long id;

    // 메뉴명
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    // 메뉴 설명
    @Column(length = 500)
    private String description;

    // 가격
    @Column(nullable = false)
    private Integer price;

    // 카테고리
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MenuCategory category;

    // 판매 여부
    @Builder.Default
    @Column(nullable = false)
    private Boolean sale = true;

    // 시즌 메뉴 여부
    @Builder.Default
    @Column(nullable = false)
    private Boolean season = false;

    // 메뉴 이미지
    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void update(
            String name,
            String description,
            Integer price,
            MenuCategory category,
            Boolean sale,
            Boolean season,
            String imageUrl
    ) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.sale = sale;
        this.season = season;
        this.imageUrl = imageUrl;
    }

    public void changeSale(Boolean sale) {
        this.sale = sale;
    }
}