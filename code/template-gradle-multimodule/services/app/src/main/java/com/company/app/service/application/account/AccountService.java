package com.company.app.service.application.account;


import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class AccountService {

    private static final Duration EMAIL_CHANGE_TOKEN_TTL = Duration.ofHours(1);

}
