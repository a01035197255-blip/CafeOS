package com.cafeos.common.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // 프론트 주소
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000"
        ));

        // 허용 메서드
        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        // 허용 헤더
        configuration.setAllowedHeaders(List.of("*"));

        // Authorization 헤더 노출
        configuration.setExposedHeaders(List.of(
                "Authorization"
        ));

        // JWT 쿠키 사용할 경우 true
        configuration.setAllowCredentials(true);

        // preflight 캐싱
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}