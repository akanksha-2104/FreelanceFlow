package com.freelanceflow.services;

import com.freelanceflow.dto.TaskDTO;
import com.freelanceflow.dto.TaskResponseDTO;
import com.freelanceflow.entity.Project;
import com.freelanceflow.entity.Task;
import com.freelanceflow.entity.User;
import com.freelanceflow.entity.enums.TaskStatus;
import com.freelanceflow.repository.ProjectRepository;
import com.freelanceflow.repository.TaskRepository;
import com.freelanceflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

    }

    public TaskResponseDTO createTask(TaskDTO dto) {

        User currentUser = getCurrentUser();

        Project project = projectRepository
                .findByProjectIdAndUser(dto.getProjectId(), currentUser)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(TaskStatus.TODO);
        task.setDueDate(dto.getDueDate());

        task.setProject(project);

        Task saved = taskRepository.save(task);

        return mapToResponse(saved);
    }

    //GET TASKS BY PROJECT
    public List<TaskResponseDTO> getTasksByProject(Long projectId) {

        User currentUser = getCurrentUser();

        Project project = projectRepository
                .findByProjectIdAndUser(projectId, currentUser)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return taskRepository.findAllByProject(project)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    //UPDATE TASK
    public TaskResponseDTO updateTask(Long taskId, TaskDTO dto) {

        User currentUser = getCurrentUser();

        Project project = projectRepository
                .findByProjectIdAndUser(dto.getProjectId(), currentUser)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Task task = taskRepository
                .findByTaskIdAndProject(taskId, project)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());

        Task updated = taskRepository.save(task);

        return mapToResponse(updated);
    }

    public TaskResponseDTO updateTaskStatus(Long taskId, TaskStatus status) {

        User currentUser = getCurrentUser();

//        // Step 1: Verify project ownership
//        Project project = projectRepository
//                .findByProjectIdAndUser(projectId, currentUser)
//                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Step 2: Verify task belongs to project
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Project project = task.getProject();

        if (!project.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }

        task.setStatus(status);

        Task updated = taskRepository.save(task);

        return mapToResponse(updated);
    }

    // DELETE TASK
    public void deleteTask(Long taskId) {

        User currentUser = getCurrentUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Project project = task.getProject();

        if (!project.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }

        taskRepository.delete(task);
    }

    // MAPPER METHOD
    private TaskResponseDTO mapToResponse(Task task) {
        TaskResponseDTO dto = new TaskResponseDTO();

        dto.setTaskId(task.getTaskId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());

        dto.setProjectId(task.getProject().getProjectId());
        dto.setProjectTitle(task.getProject().getTitle());

        dto.setCreatedAt(task.getCreatedAt());
        dto.setDueDate(task.getDueDate());
        dto.setPriority(task.getPriority());

        return dto;
    }

}
