package com.freelanceflow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long userId;

    private String username;

    @Column(unique=true)
    private String email;

    private String passwordHash;
    private String fullName;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected  void onCreate(){
        createdAt = LocalDateTime.now();
    }
}

