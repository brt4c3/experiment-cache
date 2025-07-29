package com.example.cacheapp.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cacheapp.model.KeyDocument;

public interface KeyRepository extends MongoRepository<KeyDocument, String> {}
