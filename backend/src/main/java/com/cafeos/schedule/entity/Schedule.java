package com.cafeos.schedule.entity;

import com.cafeos.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Schedule {

    /**
     * 스케줄 ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long id;

    /**
     * 근무 직원
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * 근무 날짜
     */
    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    /**
     * 예정 출근 시간
     */
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    /**
     * 예정 퇴근 시간
     */
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    /**
     * 스케줄 메모
     */
    @Column(length = 255)
    private String memo;

    /**
     * 스케줄 수정
     */
    public void update(
            LocalDate workDate,
            LocalTime startTime,
            LocalTime endTime,
            String memo
    ) {
        this.workDate = workDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.memo = memo;
    }
}