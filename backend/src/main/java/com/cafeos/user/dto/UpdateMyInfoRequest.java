package com.cafeos.user.dto;

import com.cafeos.user.entity.Gender;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class UpdateMyInfoRequest {

    private String name;

    private String phone;

    private LocalDate birthDate;

    private Gender gender;
}