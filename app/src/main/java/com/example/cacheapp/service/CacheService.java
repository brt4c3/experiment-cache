package com.example.cacheapp.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import com.example.cacheapp.model.KeyDocument;
import com.example.cacheapp.repository.KeyRepository;

@Service
public class CacheService {

    private static final Logger logger = LoggerFactory.getLogger(CacheService.class);

    @Autowired
    private KeyRepository keyRepository;

    @Autowired
    private CacheManager cacheManager;

    /**
     * Attempts to retrieve value from cache. On cache hit, logs and returns directly.
     * On cache miss, falls back to MongoDB, logs timing, and stores in cache.
     */
    public String getFromCache(String key) {
        long start = System.currentTimeMillis();
        Cache cache = cacheManager.getCache("getCache");

        // Check cache explicitly
        Cache.ValueWrapper wrapper = cache.get(key);
        if (wrapper != null) {
            String cachedValue = (String) wrapper.get();
            long elapsed = System.currentTimeMillis() - start;
            logger.info("Cache hit for key '{}' ({} ms)", key, elapsed);
            return cachedValue;
        }

        // Cache miss flows here
        logger.info("Cache miss for key '{}', falling back to MongoDB", key);
        KeyDocument doc = keyRepository.findById(key).orElse(null);
        String result;
        if (doc != null) {
            logger.info("MongoDB hit for key '{}': {}", key, doc.getValue());
            result = "MongoDB Fallback: " + doc.getValue();
        } else {
            logger.warn("Key '{}' not found in MongoDB", key);
            result = "Not found in MongoDB: " + key;
        }

        // Store result in cache
        cache.put(key, result);

        long elapsed = System.currentTimeMillis() - start;
        logger.info("getFromCache execution for key '{}' took {} ms", key, elapsed);

        return result;
    }
}
