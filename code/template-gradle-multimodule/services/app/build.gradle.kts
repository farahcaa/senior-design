plugins {
    java
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dependency.management)
    alias(libs.plugins.jib)
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    implementation("org.liquibase:liquibase-core")
    runtimeOnly("org.postgresql:postgresql")

    implementation(libs.stripe.java)
    implementation(libs.sentry.spring.boot)

    implementation(libs.mapstruct)
    annotationProcessor(libs.mapstruct.processor)
    compileOnly(libs.jetbrains.annotations)

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

// OCI image, no Dockerfile and no Docker daemon needed:
//   ./gradlew :services:app:jibDockerBuild          -> local docker (dev)
//   ./gradlew :services:app:jib -Djib.to.tags=TAG   -> push to GHCR (CI)
jib {
    from {
        image = "eclipse-temurin:21-jre"
        platforms {
            platform {
                architecture = "amd64"
                os = "linux"
            }
            platform {
                architecture = "arm64"
                os = "linux"
            }
        }
    }
    to {
        image = "ghcr.io/company/app"
    }
    container {
        ports = listOf("8080")
        creationTime.set("USE_CURRENT_TIMESTAMP")
    }
}
