package com.cafeos.common.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final RedisTemplate<String, String> redisTemplate;

    public void sendCode(String email) {

        String code = String.format("%06d",
                ThreadLocalRandom.current().nextInt(1000000));

        redisTemplate.opsForValue().set(
                "EMAIL:" + email,
                code,
                Duration.ofMinutes(5)
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[CafeOS] 이메일 인증");
        message.setText(
                "안녕하세요.\n\n" +
                        "인증번호는 [" + code + "] 입니다.\n" +
                        "5분 이내에 입력해주세요."
        );

        mailSender.send(message);
    }

    public void verify(String email, String code) {

        String savedCode = redisTemplate.opsForValue().get("EMAIL:" + email);

        if (savedCode == null) {
            throw new BusinessException(ErrorCode.EMAIL_CODE_EXPIRED);
        }

        if (!savedCode.equals(code)) {
            throw new BusinessException(ErrorCode.INVALID_EMAIL_CODE);
        }

        redisTemplate.delete("EMAIL:" + email);
    }
}