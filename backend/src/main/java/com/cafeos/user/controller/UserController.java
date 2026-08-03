package com.cafeos.user.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.user.dto.ChangePasswordRequest;
import com.cafeos.user.dto.CreateStaffRequest;
import com.cafeos.user.dto.UpdateMyInfoRequest;
import com.cafeos.user.dto.UpdateStaffRequest;
import com.cafeos.user.dto.StaffResponse;
import com.cafeos.user.dto.UserResponse;
import com.cafeos.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 직원 생성
     */
    @PostMapping("/staff")
    public ResponseEntity<ApiResponse<Void>> createStaff(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CreateStaffRequest request
    ) {

        userService.createStaff(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 직원 목록 조회
     */
    @GetMapping("/staff")
    public ResponseEntity<ApiResponse<List<StaffResponse>>> getStaffList(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        userService.getStaffList(
                                userDetails.getUsername()
                        )
                )
        );
    }

    /**
     * 직원 상세 조회
     */
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<ApiResponse<StaffResponse>> getStaff(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long staffId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        userService.getStaff(
                                userDetails.getUsername(),
                                staffId
                        )
                )
        );
    }

    /**
     * 직원 수정
     */
    @PatchMapping("/staff/{staffId}")
    public ResponseEntity<ApiResponse<Void>> updateStaff(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long staffId,
            @RequestBody @Valid UpdateStaffRequest request
    ) {

        userService.updateStaff(
                userDetails.getUsername(),
                staffId,
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 직원 비활성화
     */
    @PatchMapping("/staff/{staffId}/disable")
    public ResponseEntity<ApiResponse<Void>> disableStaff(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long staffId
    ) {

        userService.disableStaff(
                userDetails.getUsername(),
                staffId
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 내 정보 조회
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        userService.getMyInfo(
                                userDetails.getUsername()
                        )
                )
        );
    }

    /**
     * 내 정보 수정
     */
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<Void>> updateMyInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid UpdateMyInfoRequest request
    ) {

        userService.updateMyInfo(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 비밀번호 변경
     */
    @PatchMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid ChangePasswordRequest request
    ) {

        userService.changePassword(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        userService.logout(
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 회원탈퇴
     */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> withdraw(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        userService.withdraw(
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }
}