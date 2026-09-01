package com.cafeos.attendance.scheduler;

import com.cafeos.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AttendanceScheduler {

    private final AttendanceService attendanceService;

    /**
     * 매일 자정에 전날 미퇴근 근태 자동 종료
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void autoCheckOut() {

        attendanceService.autoCheckOut();
    }
}