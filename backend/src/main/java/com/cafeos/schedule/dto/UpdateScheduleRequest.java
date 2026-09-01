package com.cafeos.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateScheduleRequest {

    /**
     * 근무 날짜
     */
    private LocalDate workDate;

    /**
     * 출근 예정 시간
     */
    private LocalTime startTime;

    /**
     * 퇴근 예정 시간
     */
    private LocalTime endTime;

    /**
     * 메모
     */
    private String memo;
}