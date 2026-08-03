package com.cafeos.user.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.common.service.RefreshTokenService;
import com.cafeos.user.dto.CreateStaffRequest;
import com.cafeos.user.dto.UpdateStaffRequest;
import com.cafeos.user.dto.UpdateMyInfoRequest;
import com.cafeos.user.dto.ChangePasswordRequest;
import com.cafeos.user.dto.StaffResponse;
import com.cafeos.user.dto.UserResponse;
import com.cafeos.user.entity.Provider;
import com.cafeos.user.entity.User;
import com.cafeos.user.entity.UserRole;
import com.cafeos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

    /**
     * 직원 생성
     */
    @Transactional
    public void createStaff(String email, CreateStaffRequest request) {

        validateOwner(email);

        if (request.getRole() == UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BusinessException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        User staff = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .role(request.getRole())
                .provider(Provider.LOCAL)
                .enabled(true)
                .build();

        userRepository.save(staff);
    }

    /**
     * 직원 목록
     */
    public List<StaffResponse> getStaffList(String email) {

        validateOwner(email);

        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() != UserRole.OWNER)
                .map(StaffResponse::from)
                .toList();
    }

    /**
     * 직원 상세조회
     */
    public StaffResponse getStaff(String email, Long staffId) {

        validateOwner(email);

        User user = userRepository.findById(staffId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        return StaffResponse.from(user);
    }

    /**
     * 직원 수정
     */
    @Transactional
    public void updateStaff(String email,
                            Long staffId,
                            UpdateStaffRequest request) {

        validateOwner(email);

        User user = userRepository.findById(staffId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.getRole() == UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        user.update(
                request.getName(),
                request.getPhone(),
                request.getBirthDate(),
                request.getGender(),
                request.getRole(),
                request.getEnabled()
        );
    }

    /**
     * 직원 비활성화
     */
    @Transactional
    public void disableStaff(String email, Long staffId) {

        validateOwner(email);

        User user = userRepository.findById(staffId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.getRole() == UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        user.changeEnabled(false);
    }

    /**
     * 내 정보 조회
     */
    public UserResponse getMyInfo(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        return UserResponse.from(user);
    }

    /**
     * 내 정보 수정
     */
    @Transactional
    public void updateMyInfo(String email,
                             UpdateMyInfoRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.updateMyInfo(
                request.getName(),
                request.getPhone(),
                request.getBirthDate(),
                request.getGender()
        );
    }

    /**
     * 비밀번호 변경
     */
    @Transactional
    public void changePassword(String email,
                               ChangePasswordRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new BusinessException(ErrorCode.INVALID_PASSWORD);
        }

        user.changePassword(
                passwordEncoder.encode(request.getNewPassword())
        );
    }

    /**
     * 로그아웃
     */
    @Transactional
    public void logout(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        refreshTokenService.delete(user.getId());
    }

    /**
     * 회원탈퇴
     */
    @Transactional
    public void withdraw(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.changeEnabled(false);

        refreshTokenService.delete(user.getId());
    }

    private void validateOwner(String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}