package com.company.app.service.config;

import io.sentry.EventProcessor;
import io.sentry.Hint;
import io.sentry.SentryEvent;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

/**
 * Stamps the request-correlation MDC ({@code requestId}, {@code userId} - set by
 * {@link RequestLoggingFilter}) onto every Sentry event as searchable TAGS. So when Sentry alerts
 * you to an exception, the issue already shows which request and which user hit it, and you can pivot
 * straight to the matching lines in the JSON logs.
 *
 * <p>The Sentry Spring Boot auto-configuration discovers {@link EventProcessor} beans automatically,
 * so no explicit registration is needed. This is metadata only (an opaque request id and the user's
 * OIDC subject), never token or payload content.
 *
 * <p>Inert without a DSN: if Sentry is disabled (no SENTRY_DSN, e.g. local dev) no events are sent,
 * so this processor is never invoked.
 */
@Component
public class SentryMdcEventProcessor implements EventProcessor {

    @Override
    public SentryEvent process(SentryEvent event, Hint hint) {
        String requestId = MDC.get("requestId");
        if (requestId != null && !requestId.isBlank()) {
            event.setTag("requestId", requestId);
        }
        String userId = MDC.get("userId");
        if (userId != null && !userId.isBlank()) {
            event.setTag("userId", userId);
        }
        return event;
    }
}
