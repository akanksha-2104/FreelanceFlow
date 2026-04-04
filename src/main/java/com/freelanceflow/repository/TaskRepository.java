package com.freelanceflow.repository;

import com.freelanceflow.entity.Project;
import com.freelanceflow.entity.Task;
import com.freelanceflow.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByProject(Project project);
    Optional<Task> findByTaskIdAndProject(Long taskId, Project project);
    List<Task> findAllByProjectAndStatus(Project project, TaskStatus status);
}
