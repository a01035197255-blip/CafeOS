package com.cafeos.notice.dto;

import com.cafeos.notice.entity.Notice;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NoticeResponse {

    private Long id;

    private String title;

    private String content;

    private Boolean pinned;

    private LocalDateTime createdAt;

    public static NoticeResponse from(Notice notice){

        return NoticeResponse.builder()
                .id(notice.getId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .pinned(notice.getPinned())
                .createdAt(notice.getCreatedAt())
                .build();
    }
}