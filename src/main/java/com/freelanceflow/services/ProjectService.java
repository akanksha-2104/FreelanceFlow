package com.freelanceflow.services;

import com.freelanceflow.dto.ProjectDTO;
import com.freelanceflow.dto.ProjectResponseDTO;
import com.freelanceflow.entity.Client;
import com.freelanceflow.entity.Project;
import com.freelanceflow.entity.User;
import com.freelanceflow.entity.enums.ProjectStatus;
import com.freelanceflow.repository.ClientRepository;
import com.freelanceflow.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ClientRepository clientRepository;

    private User getCurrentUser(){
        return(User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public ProjectResponseDTO createProject(ProjectDTO dto) {

        User currentUser = getCurrentUser();

        Client client = clientRepository
                .findByClientIdAndUser(dto.getClientId(), currentUser)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setDeadline(dto.getDeadline());
        project.setBudget(dto.getBudget());
        project.setStatus(
                dto.getStatus() != null ? dto.getStatus() : ProjectStatus.ACTIVE
        ); // optional (default already ACTIVE)

        project.setUser(currentUser);
        project.setClient(client);

        Project saved = projectRepository.save(project);

        return mapToResponseDTO(saved);
    }

    public List<ProjectResponseDTO> getAllProjects() {

        User currentUser = getCurrentUser();

        return projectRepository.findAllByUser(currentUser)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public ProjectResponseDTO getProjectById(Long projectId) {

        User currentUser = getCurrentUser();

        Project project = projectRepository
                .findByProjectIdAndUser(projectId, currentUser)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return mapToResponseDTO(project);
    }

    public ProjectResponseDTO updateProject(Long projectId, ProjectDTO dto) {

        User currentUser = getCurrentUser();

        Project project = projectRepository
                .findByProjectIdAndUser(projectId, currentUser)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // ✅ If client changed
        if (!project.getClient().getClientId().equals(dto.getClientId())) {

            Client newClient = clientRepository
                    .findByClientIdAndUser(dto.getClientId(), currentUser)
                    .orElseThrow(() -> new RuntimeException("Client not found"));

            project.setClient(newClient);
        }

        // Update fields
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setDeadline(dto.getDeadline());
        project.setBudget(dto.getBudget());
        project.setStatus(
                dto.getStatus() != null ? dto.getStatus() : ProjectStatus.ACTIVE
        );

        Project updated = projectRepository.save(project);

        return mapToResponseDTO(updated);
    }

    public ProjectResponseDTO updateStatus(Long projectId, ProjectStatus status) {

        User currentUser = getCurrentUser();

        Project project = projectRepository
                .findByProjectIdAndUser(projectId, currentUser)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setStatus(status);

        Project updated = projectRepository.save(project);

        return mapToResponseDTO(updated);
    }

    public void deleteProject(Long projectId) {

        User currentUser = getCurrentUser();

        Project project = projectRepository
                .findByProjectIdAndUser(projectId, currentUser)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        projectRepository.delete(project);
    }

    private ProjectResponseDTO mapToResponseDTO(Project project) {

        ProjectResponseDTO dto = new ProjectResponseDTO();

        dto.setProjectId(project.getProjectId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setStartDate(project.getStartDate());
        dto.setDeadline(project.getDeadline());
        dto.setBudget(project.getBudget());
        dto.setCreatedAt(project.getCreatedAt());

        dto.setClientId(project.getClient().getClientId());
        dto.setClientName(project.getClient().getClientName());

        return dto;
    }

}
