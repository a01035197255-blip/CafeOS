package com.cafeos.user.dto;

import com.cafeos.user.entity.User;
import com.cafeos.user.entity.Gender;
import com.cafeos.user.entity.UserRole;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class StaffResponse {

    private Long id;
    private String email;
    private String name;
    private String phone;
    private LocalDate birthDate;
    private Gender gender;
    private UserRole role;
    private Boolean enabled;

    public static StaffResponse from(User user) {
        return StaffResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .birthDate(user.getBirthDate())
                .gender(user.getGender())
                .role(user.getRole())
                .enabled(user.getEnabled())
                .build();
    }
}