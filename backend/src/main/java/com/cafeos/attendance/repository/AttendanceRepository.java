package com.cafeos.attendance.repository;

import com.cafeos.attendance.entity.Attendance;
import com.cafeos.attendance.entity.AttendanceStatus;
import com.cafeos.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance,Long> {

    Optional<Attendance> findByUserAndCheckInTimeBetween(
            User user,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Attendance> findAllByStatus(
            AttendanceStatus status
    );

    List<Attendance> findAllByUserOrderByCheckInTimeDesc(User user);
}