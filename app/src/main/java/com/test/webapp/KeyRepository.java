package com.test.webapp.repository;

import com.test.webapp.model.KeyDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface KeyRepository extends MongoRepository<KeyDocument, String> {}
