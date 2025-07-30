package com.example.cacheapp.config;

import java.net.URI;
import java.net.URISyntaxException;

import javax.cache.Caching;

import org.ehcache.jsr107.EhcacheCachingProvider;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.jcache.JCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
  @Bean
  public JCacheCacheManager cacheManager(javax.cache.CacheManager jcm) {
    return new JCacheCacheManager(jcm);
  }

  @Bean
  public javax.cache.CacheManager jCacheManager() throws URISyntaxException {
    URI uri = getClass().getResource("/ehcache.xml").toURI();
    return Caching.getCachingProvider(
      EhcacheCachingProvider.class.getName()
    ).getCacheManager(uri, getClass().getClassLoader());
  }
}

