package com.company.app.service.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * ONE structured log line per HTTP request - the backbone of "log every endpoint" without touching a
 * single controller. It also seeds the SLF4J MDC so that EVERY log line emitted while a request is
 * handled carries a correlation {@code requestId} (and {@code userId} once auth has resolved). With
 * JSON logging on (staging/prod), a log store can then group all the lines for one request or one
 * user - the difference between "grep and pray" and actually tracing what happened.
 *
 * <p>Runs at HIGHEST_PRECEDENCE so the requestId MDC is set before the rest of the filter chain
 * (including Spring Security) executes. The one request line is emitted in a finally block, so it is
 * logged even when the handler throws, with the real (post-handler) status and duration.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger("com.company.app.request");
    private static final String REQUEST_ID_HEADER = "X-Request-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        long startNanos = System.nanoTime();

        // Reuse an upstream request id (from a proxy/client) when present, otherwise mint one, and
        // echo it back on the response so a client or a support ticket can quote the exact id that
        // shows up in the logs.
        String requestId = request.getHeader(REQUEST_ID_HEADER);
        if (requestId == null || requestId.isBlank()) {
            requestId = UUID.randomUUID().toString();
        }
        MDC.put("requestId", requestId);
        response.setHeader(REQUEST_ID_HEADER, requestId);

        try {
            chain.doFilter(request, response);
        } finally {
            // Auth has resolved by now (the security filter chain ran inside doFilter). For our
            // resource-server JWTs the principal NAME is the token subject (the stable user id).
            // Metadata only - never the token itself.
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getName() != null
                    && !"anonymousUser".equals(auth.getName())) {
                MDC.put("userId", auth.getName());
            }

            long durationMs = (System.nanoTime() - startNanos) / 1_000_000L;
            LOGGER.info("http_request method={} path={} status={} durationMs={}",
                    request.getMethod(), request.getRequestURI(), response.getStatus(), durationMs);

            // MUST clear: servlet threads are pooled and reused, so a leftover requestId/userId would
            // bleed into the NEXT request handled by this thread.
            MDC.clear();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Skip k8s health probes - they hammer /actuator/health every few seconds and would bury the
        // real traffic. (They also don't carry a user, so there is nothing to correlate.)
        String path = request.getRequestURI();
        return path != null && path.startsWith("/actuator");
    }
}
