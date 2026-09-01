package com.cafeos.attendance.entity;

import com.cafeos.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "attendances")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    @Column(nullable = false)
    @Builder.Default
    private Boolean late = false;

    private Long workMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AttendanceStatus status = AttendanceStatus.WORKING;

    public void checkOut() {

        this.checkOutTime = LocalDateTime.now();

        this.workMinutes =
                Duration.between(checkInTime, checkOutTime)
                        .toMinutes();

        this.status = AttendanceStatus.OFF_WORK;
    }

    public void autoCheckOut() {

        this.checkOutTime = LocalDateTime.of(
                checkInTime.toLocalDate(),
                LocalTime.MAX
        );

        this.status = AttendanceStatus.OFF_WORK;
    }
}