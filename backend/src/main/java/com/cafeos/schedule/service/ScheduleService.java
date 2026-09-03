package com.cafeos.schedule.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.schedule.dto.CreateScheduleRequest;
import com.cafeos.schedule.dto.ScheduleResponse;
import com.cafeos.schedule.dto.UpdateScheduleRequest;
import com.cafeos.schedule.entity.Schedule;
import com.cafeos.schedule.repository.ScheduleRepository;
import com.cafeos.user.entity.User;
import com.cafeos.user.entity.UserRole;
import com.cafeos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    /**
     * 스케줄 등록
     */
    @Transactional
    public void createSchedule(
            String email,
            CreateScheduleRequest request
    ) {

        User manager = getUser(email);

        validateManager(manager);

        User staff = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        // OWNER에게는 스케줄 등록 불가
        if (staff.getRole() == UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        // 같은 직원의 같은 날짜 스케줄 중복 방지
        if (scheduleRepository.existsByUserAndWorkDate(
                staff,
                request.getWorkDate()
        )) {
            throw new BusinessException(
                    ErrorCode.SCHEDULE_ALREADY_EXISTS
            );
        }

        // 출근시간 >= 퇴근시간 방지
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BusinessException(
                    ErrorCode.INVALID_SCHEDULE_TIME
            );
        }

        Schedule schedule = Schedule.builder()
                .user(staff)
                .workDate(request.getWorkDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .memo(request.getMemo())
                .build();

        scheduleRepository.save(schedule);
    }

    /**
     * 전체 스케줄 조회
     *
     * OWNER / MANAGER
     */
    public List<ScheduleResponse> getScheduleList(
            String email
    ) {

        User user = getUser(email);

        validateManager(user);

        return scheduleRepository.findAll()
                .stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    /**
     * 날짜별 전체 스케줄 조회
     *
     * OWNER / MANAGER
     */
    public List<ScheduleResponse> getScheduleListByDate(
            String email,
            LocalDate workDate
    ) {

        getUser(email);

        return scheduleRepository
                .findAllByWorkDate(workDate)
                .stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    /**
     * 직원별 스케줄 조회
     *
     * OWNER / MANAGER
     */
    public List<ScheduleResponse> getStaffSchedule(
            String email,
            Long staffId
    ) {

        User user = getUser(email);

        validateManager(user);

        User staff = userRepository.findById(staffId)
                .orElseThrow(() ->
                        new BusinessException(
                                ErrorCode.USER_NOT_FOUND
                        ));

        return scheduleRepository
                .findAllByUser(staff)
                .stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    /**
     * 내 스케줄 조회
     *
     * STAFF
     */
    public List<ScheduleResponse> getMySchedule(
            String email
    ) {

        User user = getUser(email);

        return scheduleRepository
                .findAllByUser(user)
                .stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    /**
     * 스케줄 수정
     *
     * OWNER / MANAGER
     */
    @Transactional
    public void updateSchedule(
            String email,
            Long scheduleId,
            UpdateScheduleRequest request
    ) {

        User user = getUser(email);

        validateManager(user);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() ->
                        new BusinessException(
                                ErrorCode.SCHEDULE_NOT_FOUND
                        ));

        // 출근시간 >= 퇴근시간 방지
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BusinessException(
                    ErrorCode.INVALID_SCHEDULE_TIME
            );
        }

        schedule.update(
                request.getWorkDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getMemo()
        );
    }

    /**
     * 스케줄 삭제
     *
     * OWNER / MANAGER
     */
    @Transactional
    public void deleteSchedule(
            String email,
            Long scheduleId
    ) {

        User user = getUser(email);

        validateManager(user);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() ->
                        new BusinessException(
                                ErrorCode.SCHEDULE_NOT_FOUND
                        ));

        scheduleRepository.delete(schedule);
    }

    /**
     * 사용자 조회
     */
    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(
                                ErrorCode.USER_NOT_FOUND
                        ));
    }

    /**
     * OWNER / MANAGER 권한 확인
     */
    private void validateManager(User user) {

        if (user.getRole() != UserRole.OWNER
                && user.getRole() != UserRole.MANAGER) {

            throw new BusinessException(
                    ErrorCode.ACCESS_DENIED
            );
        }
    }
}