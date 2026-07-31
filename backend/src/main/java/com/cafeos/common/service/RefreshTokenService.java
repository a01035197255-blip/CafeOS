package com.cafeos.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RedisTemplate<String, String> redisTemplate;

    public void save(Long userId, String refreshToken, long expirationMillis) {
        redisTemplate.opsForValue().set(
                "RT:" + userId,
                refreshToken,
                Duration.ofMillis(expirationMillis)
        );
    }

    public String find(Long userId) {
        return redisTemplate.opsForValue().get("RT:" + userId);
    }

    public void delete(Long userId) {
        redisTemplate.delete("RT:" + userId);
    }
}