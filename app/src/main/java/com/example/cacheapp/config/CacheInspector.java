package com.example.cacheapp.config;

import java.util.Collection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class CacheInspector {

    private static final Logger logger = LoggerFactory.getLogger(CacheInspector.class);
    private final CacheManager cacheManager;

    public CacheInspector(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @EventListener(ContextRefreshedEvent.class)
    public void listCaches() {
        Collection<String> names = cacheManager.getCacheNames();
        logger.info("🎯 Available caches: {}", names);
    }
}

