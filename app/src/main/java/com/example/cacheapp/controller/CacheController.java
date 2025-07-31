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
        for (String k : new String[] { "A", "B", "C" }) {
            cacheService.getFromCache(k);
        }
        // A, B, C: hot → cache hits
        cacheService.getFromCache("A");
        cacheService.getFromCache("B");
        cacheService.getFromCache("C");

        Thread.sleep(1000);
        // stales after TTL?
        cacheService.getFromCache("A");
        cacheService.getFromCache("A");

        Thread.sleep(1000);
        cacheService.getFromCache("B");
        cacheService.getFromCache("B");

        Thread.sleep(1000);
        cacheService.getFromCache("C");
        cacheService.getFromCache("C");

        Thread.sleep(3000);
        // wrap up
        int l = 0;
        while (l < 5) {
            for (String key : new String[] {
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
                "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"
            }) {
                cacheService.getFromCache(key);
                System.out.println("Loop " + l + ": Accessing key " + key);
            }
            Thread.sleep(1000);  // Simulate time delay to test TTL and GC impact
            l++;
        }

        return ResponseEntity.ok("Sequence run complete");
    }
}
