package com.cafeos.attendance.service;

import com.cafeos.attendance.dto.AttendanceResponse;
import com.cafeos.attendance.entity.Attendance;
import com.cafeos.attendance.entity.AttendanceStatus;
import com.cafeos.attendance.repository.AttendanceRepository;
import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.user.entity.User;
import com.cafeos.user.entity.UserRole;
import com.cafeos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    /**
     * 출근
     */
    @Transactional
    public void checkIn(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        LocalDate today = LocalDate.now();

        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        attendanceRepository.findByUserAndCheckInTimeBetween(user, start, end)
                .ifPresent(attendance -> {
                    throw new BusinessException(ErrorCode.ALREADY_CHECKED_IN);
                });

        Attendance attendance = Attendance.builder()
                .user(user)
                .checkInTime(LocalDateTime.now())
                .status(AttendanceStatus.WORKING)
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
     * 내 근태 조회
     */
    public AttendanceResponse getMyAttendance(String email){

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

        return AttendanceResponse.from(attendance);
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
}