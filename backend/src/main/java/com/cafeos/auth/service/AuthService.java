package com.cafeos.auth.service;

import com.cafeos.auth.dto.LoginRequest;
import com.cafeos.auth.dto.LoginResponse;
import com.cafeos.auth.dto.SignupRequest;
import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.common.jwt.JwtUtil;
import com.cafeos.common.service.EmailService;
import com.cafeos.common.service.RefreshTokenService;
import com.cafeos.user.entity.User;
import com.cafeos.user.entity.UserRole;
import com.cafeos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;

    @Transactional
    public void signup(SignupRequest request) {

        emailService.verify(request.getEmail(), request.getCode());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BusinessException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        UserRole role;

        if (!userRepository.existsByRole(UserRole.OWNER)) {
            role = UserRole.OWNER;
        } else {
            throw new BusinessException(ErrorCode.OWNER_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .role(role)
                .build();

        userRepository.save(user);
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INVALID_EMAIL_OR_PASSWORD));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_EMAIL_OR_PASSWORD);
        }

        if (!user.getEnabled()) {
            throw new BusinessException(ErrorCode.USER_DISABLED);
        }

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        refreshTokenService.save(user.getId(), refreshToken, jwtUtil.getRefreshTokenExpire());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public LoginResponse reissue(String refreshToken) {

        // Refresh Token 유효성 검사
        jwtUtil.validateToken(refreshToken);

        // Refresh Token에서 이메일 추출
        String email = jwtUtil.getEmail(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        // Redis에 저장된 Refresh Token 조회
        String savedRefreshToken = refreshTokenService.find(user.getId());

        if (savedRefreshToken == null) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        if (!savedRefreshToken.equals(refreshToken)) {
            throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        // 새 Access Token 발급
        String newAccessToken = jwtUtil.generateAccessToken(user);

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .build();
    }
}