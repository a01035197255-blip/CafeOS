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
}