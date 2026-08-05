package com.cafeos.task.dto;

import com.cafeos.user.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UpdateTaskRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private UserRole role;
}