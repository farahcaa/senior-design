package com.company.app.service.config;

import com.company.app.service.resolver.CurrentUserEntityArgumentResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebResolverConfig implements WebMvcConfigurer {

    private final CurrentUserEntityArgumentResolver currentUserEntityArgumentResolver;

    public WebResolverConfig(CurrentUserEntityArgumentResolver currentUserEntityArgumentResolver) {
        this.currentUserEntityArgumentResolver = currentUserEntityArgumentResolver;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(currentUserEntityArgumentResolver);
    }
}
