package com.cafeos.attendance.dto;

import com.cafeos.attendance.entity.Attendance;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AttendanceResponse {

    private Long id;

    private String employee;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    private Long workMinutes;

    public static AttendanceResponse from(
            Attendance attendance){

        return AttendanceResponse.builder()
                .id(attendance.getId())
                .employee(attendance.getUser().getName())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .workMinutes(attendance.getWorkMinutes())
                .build();
    }
}