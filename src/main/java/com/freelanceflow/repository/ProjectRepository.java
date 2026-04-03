package com.freelanceflow.repository;

import com.freelanceflow.entity.Project;
import com.freelanceflow.entity.User;
import com.freelanceflow.entity.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByUser(User user);
    Optional<Project> findByProjectIdAndUser(Long projectId, User user);
    List<Project> findAllByUserAndStatus(User user, ProjectStatus status);
}
