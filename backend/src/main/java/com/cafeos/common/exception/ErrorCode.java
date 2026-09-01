package com.cafeos.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // Common
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C001", "서버 내부 오류가 발생했습니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C002", "잘못된 요청입니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C003", "지원하지 않는 요청입니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "C004", "접근 권한이 없습니다."),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "C005", "리소스를 찾을 수 없습니다."),

    AI_ANALYSIS_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "C006", "AI 분석에 실패했습니다."),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "U002", "이미 사용 중인 이메일입니다."),
    PHONE_ALREADY_EXISTS(HttpStatus.CONFLICT, "U003", "이미 사용 중인 전화번호입니다."),
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "U004", "비밀번호가 일치하지 않습니다."),
    OWNER_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "OWNER_001", "이미 OWNER 계정이 존재합니다."),
    INVALID_PHONE(HttpStatus.BAD_REQUEST,    "AUTH_009","휴대폰 번호가 일치하지 않습니다."),

    USER_DISABLED(HttpStatus.FORBIDDEN, "USER_001", "비활성화된 사용자입니다."),

    EMAIL_CODE_EXPIRED(HttpStatus.BAD_REQUEST, "EMAIL_001", "이메일 인증번호가 만료되었습니다."),
    INVALID_EMAIL_CODE(HttpStatus.BAD_REQUEST, "EMAIL_002", "이메일 인증번호가 올바르지 않습니다."),

    // Menu
    MENU_NOT_FOUND(HttpStatus.NOT_FOUND, "MENU_001", "메뉴를 찾을 수 없습니다."),
    MENU_ALREADY_EXISTS(HttpStatus.CONFLICT, "MENU_002", "이미 존재하는 메뉴입니다."),

    // Ingredient
    INGREDIENT_NOT_FOUND(HttpStatus.NOT_FOUND, "INGREDIENT_001", "재료를 찾을 수 없습니다."),
    INGREDIENT_ALREADY_EXISTS(HttpStatus.CONFLICT, "INGREDIENT_002", "이미 존재하는 재료입니다."),

    // Inventory
    INVENTORY_NOT_FOUND(HttpStatus.NOT_FOUND, "INVENTORY_001", "재고를 찾을 수 없습니다."),
    INSUFFICIENT_STOCK(HttpStatus.BAD_REQUEST, "INVENTORY_002", "재고가 부족합니다."),
    INVENTORY_ALREADY_EXISTS(HttpStatus.CONFLICT, "INVENTORY_002", "이미 등록된 재고입니다."),

    // Recipe
    RECIPE_NOT_FOUND(HttpStatus.NOT_FOUND, "RECIPE_001", "레시피를 찾을 수 없습니다."),
    RECIPE_ALREADY_EXISTS(HttpStatus.CONFLICT, "RECIPE_002", "이미 존재하는 레시피입니다."),
    // RecipeItem
    RECIPE_ITEM_NOT_FOUND(HttpStatus.NOT_FOUND, "RECIPE_ITEM_001", "레시피 재료를 찾을 수 없습니다."),
    RECIPE_ITEM_ALREADY_EXISTS(HttpStatus.CONFLICT, "RECIPE_ITEM_002", "이미 등록된 레시피 재료입니다."),

    // Order
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "ORDER_001", "주문을 찾을 수 없습니다."),
    ORDER_ALREADY_COMPLETED(HttpStatus.BAD_REQUEST, "ORDER_002", "이미 완료된 주문입니다."),
    ORDER_ALREADY_CANCELLED(HttpStatus.BAD_REQUEST, "ORDER_002", "이미 취소된 주문입니다."),

    // Attendance
    ATTENDANCE_NOT_FOUND(HttpStatus.NOT_FOUND, "ATTENDANCE_001", "근태 정보를 찾을 수 없습니다."),
    ALREADY_CHECKED_IN(HttpStatus.BAD_REQUEST, "ATTENDANCE_002", "이미 출근 처리되었습니다."),
    ALREADY_CHECKED_OUT(HttpStatus.BAD_REQUEST, "ATTENDANCE_003", "이미 퇴근 처리되었습니다."),

    TASK_NOT_FOUND(HttpStatus.NOT_FOUND, "TASK_001", "업무를 찾을 수 없습니다."),

    // Notice
    NOTICE_NOT_FOUND(HttpStatus.NOT_FOUND, "NOTICE_001", "공지를 찾을 수 없습니다."),

    // Schedule
    SCHEDULE_NOT_FOUND(HttpStatus.NOT_FOUND, "SCHEDULE_001", "스케줄을 찾을 수 없습니다."),
    SCHEDULE_ALREADY_EXISTS(HttpStatus.CONFLICT, "SCHEDULE_002", "해당 직원의 해당 날짜에 이미 스케줄이 존재합니다."),
    INVALID_SCHEDULE_TIME(HttpStatus.BAD_REQUEST, "SCHEDULE_003", "출근 시간은 퇴근 시간보다 빨라야 합니다."),

    // Auth
    INVALID_EMAIL_OR_PASSWORD(HttpStatus.UNAUTHORIZED, "A001", "이메일 또는 비밀번호가 올바르지 않습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "A002", "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "A003", "만료된 토큰입니다."),
    UNSUPPORTED_TOKEN(HttpStatus.UNAUTHORIZED, "A004", "지원하지 않는 토큰입니다."),
    EMPTY_TOKEN(HttpStatus.UNAUTHORIZED, "A005", "토큰이 존재하지 않습니다."),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "AUTH_008", "리프레시 토큰이 존재하지 않습니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH_009", "유효하지 않은 리프레시 토큰입니다."),
    VERIFICATION_CODE_EXPIRED(HttpStatus.BAD_REQUEST, "AUTH_010", "인증번호가 만료되었습니다."),

    INVALID_VERIFICATION_CODE(HttpStatus.BAD_REQUEST, "AUTH_011", "인증번호가 올바르지 않습니다."),
    LOGIN_REQUIRED(HttpStatus.UNAUTHORIZED, "A006", "로그인이 필요합니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}