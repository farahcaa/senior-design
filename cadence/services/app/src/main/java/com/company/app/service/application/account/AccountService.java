package com.company.app.service.application.account;

import com.company.app.service.application.account.dtos.AccountPageDTO;
import com.company.app.service.model.user.UserEntity;
import org.springframework.stereotype.Service;

@Service
public class AccountService {

    /** Summary shown on the account page: just who you are, straight from the user row. */
    public AccountPageDTO getAccount(UserEntity user) {
        return new AccountPageDTO()
                .setFullName(user.getFullName())
                .setEmail(user.getEmail());
    }
}
