package com.cafeos.notice.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.notice.dto.CreateNoticeRequest;
import com.cafeos.notice.dto.NoticeResponse;
import com.cafeos.notice.dto.UpdateNoticeRequest;
import com.cafeos.notice.entity.Notice;
import com.cafeos.notice.repository.NoticeRepository;
import com.cafeos.user.entity.User;
import com.cafeos.user.entity.UserRole;
import com.cafeos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;

    /**
     * 공지 등록
     */
    @Transactional
    public void createNotice(String email,
                             CreateNoticeRequest request){

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() == UserRole.STAFF) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Notice notice = Notice.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .pinned(request.getPinned() != null ? request.getPinned() : false)
                .build();

        noticeRepository.save(notice);
    }

    /**
     * 공지 목록 조회
     */
    public List<NoticeResponse> getNoticeList() {

        return noticeRepository
                .findAllByOrderByPinnedDescCreatedAtDesc()
                .stream()
                .map(NoticeResponse::from)
                .toList();
    }

    /**
     * 공지 상세조회
     */
    public NoticeResponse getNotice(Long noticeId){

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.NOTICE_NOT_FOUND));

        return NoticeResponse.from(notice);
    }

    /**
     * 공지 수정
     */
    @Transactional
    public void updateNotice(String email,
                             Long noticeId,
                             UpdateNoticeRequest request){

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() == UserRole.STAFF) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.NOTICE_NOT_FOUND));

        notice.update(
                request.getTitle(),
                request.getContent(),
                request.getPinned()
        );
    }

    /**
     * 공지 삭제
     */
    @Transactional
    public void deleteNotice(String email,
                             Long noticeId){

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() == UserRole.STAFF) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.NOTICE_NOT_FOUND));

        noticeRepository.delete(notice);
    }
}