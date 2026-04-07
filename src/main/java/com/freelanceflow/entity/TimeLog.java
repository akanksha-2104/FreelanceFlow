package com.freelanceflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class TimeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long logId;

    @Column(nullable = false)
    Double hoursLogged;

    LocalDate logDate;
    String notes;

    @CreationTimestamp
    LocalDateTime createdAt;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "project_id")
    Project project ;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "task_id", nullable = true)
    Task task;
}
