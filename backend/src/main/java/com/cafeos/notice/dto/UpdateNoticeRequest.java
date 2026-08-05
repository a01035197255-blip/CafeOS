package com.cafeos.notice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UpdateNoticeRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private Boolean pinned;
}