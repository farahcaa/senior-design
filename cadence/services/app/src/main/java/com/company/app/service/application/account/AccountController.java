package com.company.app.service.application.account;

import com.company.app.service.application.account.dtos.AccountPageDTO;
import com.company.app.service.model.user.UserEntity;
import com.company.app.service.resolver.CurrentUserEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/app")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    /** GET /app/account - the signed-in user's name and email (user row is created on first call). */
    @GetMapping("/account")
    public ResponseEntity<AccountPageDTO> getAccount(@CurrentUserEntity UserEntity user) {
        return ResponseEntity.ok(accountService.getAccount(user));
    }
}
