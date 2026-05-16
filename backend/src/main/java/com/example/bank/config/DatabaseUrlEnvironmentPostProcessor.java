package com.example.bank.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.util.StringUtils;

/**
 * Converts Render-style PostgreSQL URLs (postgresql://user:pass@host/db) into
 * Spring's JDBC datasource properties before auto-configuration creates the
 * DataSource.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String PROPERTY_SOURCE_NAME = "databaseUrlProperties";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (!StringUtils.hasText(databaseUrl)) {
            databaseUrl = environment.getProperty("DB_URL");
        }

        if (!StringUtils.hasText(databaseUrl)) {
            return;
        }

        String trimmedUrl = databaseUrl.trim();
        if (trimmedUrl.startsWith("jdbc:postgresql:")) {
            addProperties(environment, Map.of(
                    "spring.datasource.url", trimmedUrl,
                    "spring.datasource.driver-class-name", "org.postgresql.Driver"));
            return;
        }

        if (trimmedUrl.startsWith("jdbc:")) {
            return;
        }

        if (!trimmedUrl.startsWith("postgres://") && !trimmedUrl.startsWith("postgresql://")) {
            return;
        }

        URI uri = URI.create(trimmedUrl);
        String username = decode(uri.getUserInfo() == null ? null : uri.getUserInfo().split(":", 2)[0]);
        String password = decode(extractPassword(uri.getUserInfo()));
        String jdbcUrl = toJdbcUrl(uri);

        Map<String, Object> properties = new LinkedHashMap<>();
        properties.put("spring.datasource.url", jdbcUrl);
        if (StringUtils.hasText(username)) {
            properties.put("spring.datasource.username", username);
        }
        if (StringUtils.hasText(password)) {
            properties.put("spring.datasource.password", password);
        }
        properties.put("spring.datasource.driver-class-name", "org.postgresql.Driver");
        addProperties(environment, properties);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }

    private static void addProperties(ConfigurableEnvironment environment, Map<String, Object> properties) {
        if (!properties.isEmpty()) {
            environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, properties));
        }
    }

    private static String extractPassword(String userInfo) {
        if (userInfo == null) {
            return null;
        }
        String[] parts = userInfo.split(":", 2);
        return parts.length == 2 ? parts[1] : null;
    }

    private static String decode(String value) {
        return value == null ? null : URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static String toJdbcUrl(URI uri) {
        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://");
        jdbcUrl.append(uri.getHost());
        if (uri.getPort() > 0) {
            jdbcUrl.append(':').append(uri.getPort());
        }
        jdbcUrl.append(uri.getPath());
        if (StringUtils.hasText(uri.getQuery())) {
            jdbcUrl.append('?').append(uri.getQuery());
        }
        return jdbcUrl.toString();
    }
}
