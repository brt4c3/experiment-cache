package com.test.webapp;

import java.util.concurrent.TimeUnit;
import javax.cache.configuration.MutableConfiguration;
import javax.cache.expiry.CreatedExpiryPolicy;
import javax.cache.expiry.Duration;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CacheConfig {

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache(
                "getCache",
                new MutableConfiguration<>()
                    .setStoreByValue(false)
                    .setExpiryPolicyFactory(
                        CreatedExpiryPolicy.factoryOf(
                            new Duration(TimeUnit.SECONDS, 3)
                        )
                    )
                    .setStatisticsEnabled(true)
            );
        };
    }
}
