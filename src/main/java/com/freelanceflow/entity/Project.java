package com.freelanceflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.freelanceflow.entity.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.ACTIVE;

    private LocalDate startDate;

    private LocalDate deadline;

    @Column(precision = 10, scale = 2)
    private BigDecimal budget;

    @CreationTimestamp
    private LocalDateTime createdAt;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;


}
