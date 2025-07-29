package com.example.cacheapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.cacheapp.service.CacheService;

@RestController
@RequestMapping("/cache")
@CrossOrigin
public class CacheController {

    @Autowired
    private CacheService cacheService;

    @GetMapping("/{key}")
    public ResponseEntity<String> get(@PathVariable String key) {
        if (key == null || key.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Key must not be empty.");
        }
        String value = cacheService.getFromCache(key);
        return ResponseEntity.ok(value);
    }

    @GetMapping("/run-sequence")
    public ResponseEntity<String> runSequence() throws InterruptedException {
        for (String key : new String[] { "A", "B", "C" }) {
            cacheService.getFromCache(key);
        }
        cacheService.getFromCache("A");
        cacheService.getFromCache("B");
        cacheService.getFromCache("C");
        Thread.sleep(1000);
        cacheService.getFromCache("A");
        cacheService.getFromCache("A");
        Thread.sleep(1000);
        cacheService.getFromCache("B");
        cacheService.getFromCache("B");
        Thread.sleep(1000);
        cacheService.getFromCache("C");
        cacheService.getFromCache("C");
        Thread.sleep(1000);
        cacheService.getFromCache("A");
        cacheService.getFromCache("B");
        cacheService.getFromCache("C");

        return ResponseEntity.ok("Sequence run complete");
    }
}
