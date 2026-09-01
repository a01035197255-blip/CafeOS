package com.cafeos.attendance.service;

import com.cafeos.attendance.dto.AttendanceResponse;
import com.cafeos.attendance.entity.Attendance;
import com.cafeos.attendance.entity.AttendanceStatus;
import com.cafeos.attendance.repository.AttendanceRepository;
import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.schedule.entity.Schedule;
import com.cafeos.schedule.repository.ScheduleRepository;
import com.cafeos.user.entity.User;
import com.cafeos.user.entity.UserRole;
import com.cafeos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    /**
     * 출근
     */
    @Transactional
    public void checkIn(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        LocalDate today = LocalDate.now();

        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        attendanceRepository
                .findByUserAndCheckInTimeBetween(user, start, end)
                .ifPresent(attendance -> {
                    throw new BusinessException(
                            ErrorCode.ALREADY_CHECKED_IN
                    );
                });

        LocalDateTime now = LocalDateTime.now();

        /*
         * 오늘 스케줄 조회
         */
        boolean late = false;

        Optional<Schedule> schedule =
                scheduleRepository.findByUserAndWorkDate(
                        user,
                        today
                );

        if (schedule.isPresent()) {

            LocalTime scheduledStart =
                    schedule.get().getStartTime();

            LocalTime actualStart =
                    now.toLocalTime();

            late = actualStart.isAfter(scheduledStart);
        }

        Attendance attendance = Attendance.builder()
                .user(user)
                .checkInTime(now)
                .status(AttendanceStatus.WORKING)
                .late(late)
                .build();

        attendanceRepository.save(attendance);
    }

    /**
     * 퇴근
     */
    @Transactional
    public void checkOut(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        LocalDate today = LocalDate.now();

        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        Attendance attendance =
                attendanceRepository.findByUserAndCheckInTimeBetween(user, start, end)
                        .orElseThrow(() ->
                                new BusinessException(ErrorCode.ATTENDANCE_NOT_FOUND));

        if (attendance.getStatus() == AttendanceStatus.OFF_WORK) {
            throw new BusinessException(ErrorCode.ALREADY_CHECKED_OUT);
        }

        attendance.checkOut();
    }

    /**
     * 전체 근태 조회
     */
    public List<AttendanceResponse> getAttendanceList(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.getRole() == UserRole.STAFF) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        return attendanceRepository.findAll()
                .stream()
                .map(AttendanceResponse::from)
                .toList();
    }

    @Transactional
    public void autoCheckOut() {

        LocalDate today = LocalDate.now();

        attendanceRepository
                .findAllByStatus(AttendanceStatus.WORKING)
                .stream()
                .filter(attendance ->
                        attendance.getCheckInTime()
                                .toLocalDate()
                                .isBefore(today)
                )
                .forEach(Attendance::autoCheckOut);
    }

    /**
     * 내 근태 목록 조회
     */
    public List<AttendanceResponse> getMyAttendanceList(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        return attendanceRepository
                .findAllByUserOrderByCheckInTimeDesc(user)
                .stream()
                .map(AttendanceResponse::from)
                .toList();
    }
}