package com.cafeos.common.service;

import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CoolSmsService {

    private final DefaultMessageService messageService;

    @Value("${coolsms.sender}")
    private String sender;

    /**
     * SMS 발송
     */
    public SingleMessageSentResponse sendSms(String phone, String text) {

        Message message = new Message();

        message.setFrom(sender);
        message.setTo(phone);
        message.setText(text);

        return messageService.sendOne(
                new SingleMessageSendingRequest(message)
        );
    }

    /**
     * 인증번호 발송
     */
    public SingleMessageSentResponse sendVerificationCode(String phone, String code) {

        String text = """
                [CafeOS]
                
                인증번호는 [%s] 입니다.
                3분 이내에 입력해주세요.
                """.formatted(code);

        return sendSms(phone, text);
    }
}