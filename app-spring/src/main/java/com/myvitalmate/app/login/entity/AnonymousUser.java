package com.myvitalmate.app.login.entity;


import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "anonymous_users")
public class AnonymousUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID anonymousId;

    @Column(nullable = false)
    private String anonymousRole;


    public AnonymousUser() {
    }

    public AnonymousUser(UUID anonymousId, String anonymousRole) {
        this.anonymousId = anonymousId;
        this.anonymousRole = anonymousRole;
    }

    public String getRole() {
        return anonymousRole;
    }
}
