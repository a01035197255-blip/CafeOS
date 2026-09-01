package com.cafeos.schedule.repository;

import com.cafeos.schedule.entity.Schedule;
import com.cafeos.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    /**
     * 직원별 스케줄 조회
     */
    List<Schedule> findAllByUser(User user);

    /**
     * 날짜별 전체 스케줄 조회
     */
    List<Schedule> findAllByWorkDate(LocalDate workDate);

    /**
     * 직원 + 날짜로 스케줄 조회
     */
    Optional<Schedule> findByUserAndWorkDate(
            User user,
            LocalDate workDate
    );

    /**
     * 직원 + 날짜 스케줄 중복 확인
     */
    boolean existsByUserAndWorkDate(
            User user,
            LocalDate workDate
    );
}