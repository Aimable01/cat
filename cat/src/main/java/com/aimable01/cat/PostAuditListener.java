package com.aimable01.cat;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

public class PostAuditListener {
    @PrePersist
    public void beforeCreate(Post post) {
        System.out.println("About to create post: " + post.getTitle());
    }

    @PreUpdate
    public void beforeUpdate(Post post) {
        System.out.println("About to update post: " + post.getTitle());
    }
}
