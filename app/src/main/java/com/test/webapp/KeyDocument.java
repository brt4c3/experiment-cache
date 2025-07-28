package com.test.webapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "index")
public class KeyDocument {
    @Id
    private String id;
    private String value;

    public KeyDocument() {}

    public KeyDocument(String id, String value) {
        this.id = id;
        this.value = value;
    }

    public String getId() { return id; }
    public String getValue() { return value; }
}
