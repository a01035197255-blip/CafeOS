package com.cafeos.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetSmsRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phone;
}