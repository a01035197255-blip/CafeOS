package com.cafeos.notice.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.notice.dto.CreateNoticeRequest;
import com.cafeos.notice.dto.NoticeResponse;
import com.cafeos.notice.dto.UpdateNoticeRequest;
import com.cafeos.notice.service.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;

    /**
     * 공지 등록
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createNotice(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CreateNoticeRequest request
    ) {

        noticeService.createNotice(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 공지 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<NoticeResponse>>> getNoticeList() {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        noticeService.getNoticeList()
                )
        );
    }

    /**
     * 공지 상세 조회
     */
    @GetMapping("/{noticeId}")
    public ResponseEntity<ApiResponse<NoticeResponse>> getNotice(
            @PathVariable Long noticeId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        noticeService.getNotice(noticeId)
                )
        );
    }

    /**
     * 공지 수정
     */
    @PatchMapping("/{noticeId}")
    public ResponseEntity<ApiResponse<Void>> updateNotice(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long noticeId,
            @RequestBody @Valid UpdateNoticeRequest request
    ) {

        noticeService.updateNotice(
                userDetails.getUsername(),
                noticeId,
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 공지 삭제
     */
    @DeleteMapping("/{noticeId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotice(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long noticeId
    ) {

        noticeService.deleteNotice(
                userDetails.getUsername(),
                noticeId
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }
}