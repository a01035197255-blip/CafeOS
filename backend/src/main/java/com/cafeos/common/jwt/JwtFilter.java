package com.cafeos.common.jwt;

import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.common.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // Authorization 헤더가 없거나 Bearer가 아니면 통과
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {

            // 토큰 검증
            jwtUtil.validateToken(token);

            // 이메일 추출
            String email = jwtUtil.getEmail(token);

            // UserDetails 조회
            CustomUserDetails userDetails =
                    (CustomUserDetails)
                            customUserDetailsService
                                    .loadUserByUsername(email);

            // Authentication 생성
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            // SecurityContext 저장
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            // 다음 필터로
            filterChain.doFilter(request, response);

        } catch (Exception e) {

            // JWT가 만료되거나 잘못된 경우
            SecurityContextHolder.clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType(
                    "application/json;charset=UTF-8"
            );

            response.getWriter().write("""
                    {
                        "status": 401,
                        "message": "인증이 만료되었습니다."
                    }
                    """);

        }
    }
}