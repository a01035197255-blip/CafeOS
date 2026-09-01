package com.cafeos.schedule.dto;

import com.cafeos.schedule.entity.Schedule;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
public class ScheduleResponse {

    private Long id;
    private Long userId;
    private String userName;
    private LocalDate workDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String memo;

    public static ScheduleResponse from(Schedule schedule) {

        return ScheduleResponse.builder()
                .id(schedule.getId())
                .userId(schedule.getUser().getId())
                .userName(schedule.getUser().getName())
                .workDate(schedule.getWorkDate())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .memo(schedule.getMemo())
                .build();
    }
}