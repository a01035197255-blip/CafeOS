package com.cafeos.attendance.dto;

import com.cafeos.attendance.entity.Attendance;
import com.cafeos.attendance.entity.AttendanceStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AttendanceResponse {

    private Long id;

    private Long userId;

    private String employee;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    private Long workMinutes;

    private Boolean late;

    private AttendanceStatus status;

    public static AttendanceResponse from(
            Attendance attendance){

        return AttendanceResponse.builder()
                .id(attendance.getId())
                .userId(attendance.getUser().getId())
                .employee(attendance.getUser().getName())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .workMinutes(attendance.getWorkMinutes())
                .late(attendance.getLate())
                .status(attendance.getStatus())
                .build();
    }
}