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

        Thread.sleep(1000);
        // wrap up
        cacheService.getFromCache("A");
        cacheService.getFromCache("B");
        cacheService.getFromCache("C");
        cacheService.getFromCache("D");
        cacheService.getFromCache("E"); 
        cacheService.getFromCache("F");
        cacheService.getFromCache("G");
        cacheService.getFromCache("H");
        cacheService.getFromCache("I");
        cacheService.getFromCache("J");
        cacheService.getFromCache("K");
        cacheService.getFromCache("L");
        cacheService.getFromCache("M");
        cacheService.getFromCache("N");
        cacheService.getFromCache("O");
        cacheService.getFromCache("P");
        cacheService.getFromCache("Q");
        cacheService.getFromCache("R");
        cacheService.getFromCache("S");
        cacheService.getFromCache("T");
        cacheService.getFromCache("U");
        cacheService.getFromCache("V");
        Thread.sleep(1000);
        cacheService.getFromCache("A");
        cacheService.getFromCache("B");
        cacheService.getFromCache("C");
        cacheService.getFromCache("D");
        cacheService.getFromCache("E"); 
        cacheService.getFromCache("F");
        cacheService.getFromCache("G");
        cacheService.getFromCache("H");
        cacheService.getFromCache("I");
        cacheService.getFromCache("J");
        cacheService.getFromCache("K");
        cacheService.getFromCache("L");
        cacheService.getFromCache("M");
        cacheService.getFromCache("N");
        cacheService.getFromCache("O");
        cacheService.getFromCache("P");
        cacheService.getFromCache("Q");
        cacheService.getFromCache("R");
        cacheService.getFromCache("S");
        cacheService.getFromCache("T");
        cacheService.getFromCache("U");
        cacheService.getFromCache("V");

        return ResponseEntity.ok("Sequence run complete");
    }
}
