package com.test.webapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class CacheApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(
        SpringApplicationBuilder builder
    ) {
        return builder.sources(CacheApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(CacheApplication.class, args);
    }
}
