package com.company.app.service.application.account.dtos;

public class AccountPageDTO {

    private String fullName;
    private String email;
    private String tier;

    public String getFullName() {
        return fullName;
    }

    public AccountPageDTO setFullName(String fullName) {
        this.fullName = fullName;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public AccountPageDTO setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getTier() {
        return this.tier;
    }

    public AccountPageDTO setTier(String tier) {
        this.tier = tier;
        return this;
    }
}
