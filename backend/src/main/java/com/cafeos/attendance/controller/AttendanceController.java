package com.cafeos.attendance.controller;

import com.cafeos.attendance.dto.AttendanceResponse;
import com.cafeos.attendance.service.AttendanceService;
import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    /**
     * 출근
     */
    @PostMapping("/check-in")
    public ResponseEntity<ApiResponse<Void>> checkIn(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        attendanceService.checkIn(
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 퇴근
     */
    @PatchMapping("/check-out")
    public ResponseEntity<ApiResponse<Void>> checkOut(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        attendanceService.checkOut(
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 내 근태 조회
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AttendanceResponse>> getMyAttendance(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        attendanceService.getMyAttendance(
                                userDetails.getUsername()
                        )
                )
        );
    }

    /**
     * 전체 근태 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAttendanceList(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        attendanceService.getAttendanceList(
                                userDetails.getUsername()
                        )
                )
        );
    }
}