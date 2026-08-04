package com.cafeos.order.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.order.dto.CreateOrderRequest;
import com.cafeos.order.dto.OrderResponse;
import com.cafeos.order.dto.UpdateOrderStatusRequest;
import com.cafeos.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    /**
     * 주문 생성
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CreateOrderRequest request
    ) {

        orderService.createOrder(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 주문 목록
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrderList() {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        orderService.getOrderList()
                )
        );
    }

    /**
     * 주문 상세조회
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @PathVariable Long orderId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        orderService.getOrder(orderId)
                )
        );
    }

    /**
     * 주문 상태 변경
     */
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<Void>> changeStatus(
            @PathVariable Long orderId,
            @RequestBody @Valid UpdateOrderStatusRequest request
    ) {

        orderService.changeStatus(
                orderId,
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 주문 취소
     */
    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(
            @PathVariable Long orderId
    ) {

        orderService.cancelOrder(orderId);

        return ResponseEntity.ok(ApiResponse.ok());
    }
}