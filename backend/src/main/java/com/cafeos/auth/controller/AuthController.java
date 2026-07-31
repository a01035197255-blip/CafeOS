package com.cafeos.auth.controller;

import com.cafeos.auth.dto.*;
import com.cafeos.auth.service.AuthService;
import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;

    @PostMapping("/email/send")
    public ResponseEntity<ApiResponse<Void>> sendEmailCode(
            @RequestBody @Valid EmailSendRequest request
    ) {

        emailService.sendCode(request.getEmail());

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 회원가입
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(
            @RequestBody @Valid SignupRequest request
    ) {

        authService.signup(request);

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @RequestBody @Valid LoginRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(authService.login(request))
        );
    }

    /**
     * 토큰 재발급
     */
    @PostMapping("/reissue")
    public ResponseEntity<ApiResponse<LoginResponse>> reissue(
            @RequestBody @Valid RefreshRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(authService.reissue(request.getRefreshToken()))
        );
    }

    /**
     * 비밀번호 찾기 인증번호 발송
     */
    @PostMapping("/password/send")
    public ResponseEntity<ApiResponse<Void>> sendPasswordResetCode(
            @RequestBody @Valid PasswordResetSmsRequest request
    ) {

        authService.sendPasswordResetCode(request);

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 인증번호 확인
     */
    @PostMapping("/password/verify")
    public ResponseEntity<ApiResponse<Void>> verifyPasswordResetCode(
            @RequestBody @Valid PasswordVerifyRequest request
    ) {

        authService.verifyPasswordResetCode(request);

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 비밀번호 변경
     */
    @PatchMapping("/password/reset")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @RequestBody @Valid PasswordResetRequest request
    ) {

        authService.resetPassword(request);

        return ResponseEntity.ok(ApiResponse.ok());
    }
}