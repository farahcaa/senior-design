package com.company.app.service.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {
    private static final Logger LOGGER = LoggerFactory.getLogger(StripeConfig.class);

    @Value("${stripe.api-key}")
    private String apiKey;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @PostConstruct
    void initializeStripe() {
        if (apiKey == null || apiKey.isBlank()) {
            LOGGER.error("Stripe initialization failed because stripe.api-key is missing");
            throw new IllegalStateException("Missing stripe.api-key");
        }

        if (webhookSecret == null || webhookSecret.isBlank()) {
            LOGGER.error("Stripe initialization failed because stripe.webhook-secret is missing");
            throw new IllegalStateException("Missing stripe.webhook-secret");
        }

        Stripe.apiKey = apiKey.trim();
        LOGGER.info("Stripe API client initialized and webhook signing secret loaded");
    }
}
