package com.company.app.service.resolver;

import com.company.app.service.model.user.UserEntity;
import com.company.app.service.model.user.UserRepository;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.MethodParameter;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Optional;
import java.util.UUID;

@Component
public class CurrentUserEntityArgumentResolver implements HandlerMethodArgumentResolver {

    private static final Logger LOGGER = LoggerFactory.getLogger(CurrentUserEntityArgumentResolver.class);
    private final UserRepository userRepository;

    public CurrentUserEntityArgumentResolver(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterType().equals(UserEntity.class)
                && parameter.hasParameterAnnotation(CurrentUserEntity.class);
    }

    @Override
    public Object resolveArgument(@NotNull MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  @NotNull NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {
        LOGGER.debug("Resolving @CurrentUserEntity for parameter '{}'", parameter.getParameterName());
        UserEntity cachedUserEntity =
                (UserEntity) webRequest.getAttribute("currentUserEntity", RequestAttributes.SCOPE_REQUEST);

        if (cachedUserEntity != null) {
            LOGGER.debug("Using cached currentUserEntity id='{}'", cachedUserEntity.getId());
            return cachedUserEntity;
        }

        Jwt jwt = extractJwt(SecurityContextHolder.getContext().getAuthentication());
        if (jwt == null) {
            LOGGER.error("Failed to resolve @CurrentUserEntity because no JWT is present");
            throw new BadCredentialsException("No authenticated user found");
        }

        UserEntity userEntity = resolveOrCreateUserEntity(jwt);
        webRequest.setAttribute("currentUserEntity", userEntity, RequestAttributes.SCOPE_REQUEST);
        LOGGER.debug("Resolved @CurrentUserEntity id='{}'", userEntity.getId());
        return userEntity;
    }

    private Jwt extractJwt(Authentication authentication) {
        if (authentication == null) {
            LOGGER.error("SecurityContext authentication is null");
            return null;
        }
        LOGGER.debug("Authentication type='{}', principalType='{}', credentialsType='{}'",
                authentication.getClass().getName(),
                authentication.getPrincipal() == null ? "null" : authentication.getPrincipal().getClass().getName(),
                authentication.getCredentials() == null ? "null" : authentication.getCredentials().getClass().getName());
        Object principal = authentication.getPrincipal();
        if (principal instanceof Jwt jwt) {
            LOGGER.debug("JWT extracted from authentication principal");
            return jwt;
        }
        Object credentials = authentication.getCredentials();
        if (credentials instanceof Jwt jwt) {
            LOGGER.debug("JWT extracted from authentication credentials");
            return jwt;
        }
        LOGGER.error("JWT not found in authentication principal or credentials");
        return null;
    }

    private UserEntity resolveOrCreateUserEntity(Jwt jwt) {
        // Keycloak access-token claims: sub is the user's UUID; email / preferred_username /
        // name are the standard OIDC profile claims (any of them may be absent).
        UUID userId = parseUserId(jwt);
        String email = jwt.getClaimAsString("email");
        String preferredUsername = jwt.getClaimAsString("preferred_username");
        String name = jwt.getClaimAsString("name");
        // Log only the internal user UUID; email/username/name are PII and must not be logged.
        LOGGER.debug("Resolving app user for userId='{}'", userId);

        Optional<UserEntity> existingUser = findExistingUser(userId, email, preferredUsername);
        if (existingUser.isPresent()) {
            UserEntity userEntity = existingUser.get();
            String resolvedName = buildName(name, preferredUsername);
            boolean dirty = false;
            if (resolvedName != null && !resolvedName.equals(userEntity.getFullName())) {
                userEntity.setFullName(resolvedName);
                dirty = true;
            }
            // Heal any legacy/null tier to FREE (the entity already defaults to FREE for new rows,
            // but an existing row read back without a tier
            if (dirty) {
                try {
                    userEntity = userRepository.save(userEntity);
                    LOGGER.debug("Updated app user fields for id='{}'", userEntity.getId());
                } catch (RuntimeException e) {
                    LOGGER.warn("Failed to update app user fields for id='{}'", userEntity.getId(), e);
                }
            }
            LOGGER.debug("Found existing app user id='{}'", userEntity.getId());
            return userEntity;
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setId(userId);
        userEntity.setUsername(buildUsername(preferredUsername, userId));
        userEntity.setEmail(buildEmail(email, userId));
        userEntity.setFullName(buildName(name, preferredUsername));


        try {
            LOGGER.debug("Creating new app user with id='{}'", userEntity.getId());
            return userRepository.save(userEntity);
        } catch (RuntimeException e) {
            LOGGER.error("Failed creating app user; retrying lookup. userId='{}'", userId, e);
            return findExistingUser(userId, email, preferredUsername).orElseThrow(
                    () -> new BadCredentialsException("Authenticated user could not be resolved", e)
            );
        }
    }

    private UUID parseUserId(Jwt jwt) {
        try {
            return UUID.fromString(jwt.getSubject());
        } catch (IllegalArgumentException | NullPointerException e) {
            LOGGER.error("JWT subject is not a UUID");
            throw new BadCredentialsException("Authenticated user has an invalid subject", e);
        }
    }

    private Optional<UserEntity> findExistingUser(UUID userId, String email, String preferredUsername) {
        Optional<UserEntity> byId = userRepository.findById(userId);
        if (byId.isPresent()) {
            LOGGER.debug("Matched app user by id='{}'", userId);
            return byId;
        }

        if (email != null && !email.isBlank()) {
            Optional<UserEntity> byEmail = userRepository.findByEmail(email);
            if (byEmail.isPresent()) {
                LOGGER.debug("Matched app user by email -> id='{}'", byEmail.get().getId());
                return byEmail;
            }
            LOGGER.debug("No app user match by email");
        }

        if (preferredUsername != null && !preferredUsername.isBlank()) {
            Optional<UserEntity> byUsername = userRepository.findByUsername(preferredUsername);
            if (byUsername.isPresent()) {
                LOGGER.debug("Matched app user by username -> id='{}'", byUsername.get().getId());
                return byUsername;
            }
            LOGGER.debug("No app user match by username");
        }

        LOGGER.debug("No existing app user found for userId='{}'", userId);
        return Optional.empty();
    }

    private String buildUsername(String preferredUsername, UUID userId) {
        if (preferredUsername != null && !preferredUsername.isBlank()) {
            return preferredUsername;
        }
        return "user-" + userId.toString().substring(0, 8);
    }

    private String buildEmail(String email, UUID userId) {
        if (email != null && !email.isBlank()) {
            return email;
        }
        return userId + "@local.invalid";
    }

    private String buildName(String name, String preferredUsername) {
        if (name != null && !name.isBlank()) {
            return name;
        }
        if (preferredUsername != null && !preferredUsername.isBlank() && !preferredUsername.contains("@")) {
            return preferredUsername;
        }
        return null;
    }
}
