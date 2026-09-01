package com.cafeos.schedule.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.schedule.dto.CreateScheduleRequest;
import com.cafeos.schedule.dto.ScheduleResponse;
import com.cafeos.schedule.dto.UpdateScheduleRequest;
import com.cafeos.schedule.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    /**
     * 스케줄 등록
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createSchedule(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CreateScheduleRequest request
    ) {

        scheduleService.createSchedule(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 전체 스케줄 조회
     * OWNER / MANAGER
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getScheduleList(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        scheduleService.getScheduleList(
                                userDetails.getUsername()
                        )
                )
        );
    }

    /**
     * 날짜별 전체 스케줄 조회
     * OWNER / MANAGER
     *
     * 예:
     * GET /api/schedules/date?workDate=2026-09-01
     */
    @GetMapping("/date")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getScheduleListByDate(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam LocalDate workDate
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        scheduleService.getScheduleListByDate(
                                userDetails.getUsername(),
                                workDate
                        )
                )
        );
    }

    /**
     * 직원별 스케줄 조회
     * OWNER / MANAGER
     */
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getStaffSchedule(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long staffId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        scheduleService.getStaffSchedule(
                                userDetails.getUsername(),
                                staffId
                        )
                )
        );
    }

    /**
     * 내 스케줄 조회
     * STAFF
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getMySchedule(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        scheduleService.getMySchedule(
                                userDetails.getUsername()
                        )
                )
        );
    }

    /**
     * 스케줄 수정
     * OWNER / MANAGER
     */
    @PatchMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<Void>> updateSchedule(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long scheduleId,
            @RequestBody @Valid UpdateScheduleRequest request
    ) {

        scheduleService.updateSchedule(
                userDetails.getUsername(),
                scheduleId,
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 스케줄 삭제
     * OWNER / MANAGER
     */
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long scheduleId
    ) {

        scheduleService.deleteSchedule(
                userDetails.getUsername(),
                scheduleId
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }
}