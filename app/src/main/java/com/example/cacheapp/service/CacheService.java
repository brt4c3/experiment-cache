package com.example.cacheapp.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.cacheapp.model.KeyDocument;
import com.example.cacheapp.repository.KeyRepository;

@Service
public class CacheService {

    private static final Logger logger = LoggerFactory.getLogger(
        CacheService.class
    );

    @Autowired
    private KeyRepository keyRepository;

    @Cacheable("getCache")
    public String getFromCache(String key) {
        logger.info("Checking cache for key '{}'", key);
        logger.info("Cache miss for key '{}', falling back to MongoDB", key);
        KeyDocument doc = keyRepository.findById(key).orElse(null);
        if (doc != null) {
            logger.info("MongoDB hit: {}", doc.getValue());
            return "MongoDB Fallback: " + doc.getValue();
        } else {
            logger.warn("Key '{}' not found in MongoDB", key);
            return "Not found in MongoDB: " + key;
        }
    }
}
