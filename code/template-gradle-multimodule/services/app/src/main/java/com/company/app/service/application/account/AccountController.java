package com.company.app.service.application.account;

import com.company.app.service.application.account.dtos.AccountPageDTO;
import com.company.app.service.model.user.UserEntity;
import com.company.app.service.resolver.CurrentUserEntity;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequestMapping("/app")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService){
        this.accountService = accountService;
    }



}
