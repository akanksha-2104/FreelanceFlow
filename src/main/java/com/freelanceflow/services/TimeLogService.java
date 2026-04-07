package com.freelanceflow.services;

import com.freelanceflow.dto.ProjectTimeDTO;
import com.freelanceflow.dto.TaskResponseDTO;
import com.freelanceflow.dto.TimeLogDTO;
import com.freelanceflow.dto.TimeLogResponseDTO;
import com.freelanceflow.entity.*;
import com.freelanceflow.repository.ProjectRepository;
import com.freelanceflow.repository.TaskRepository;
import com.freelanceflow.repository.TimeLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimeLogService {
    @Autowired
    TimeLogRepository timeLogRepository;

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    TaskRepository taskRepository;

    public User getCurrentUser(){
        return (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public TimeLogResponseDTO addLog(TimeLogDTO dto){
        User currentUser = getCurrentUser();

        Project project = projectRepository
                .findByProjectIdAndUser(dto.getProjectId(), currentUser)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Task task = null;

        if(dto.getTaskId()!=null) {
            task = taskRepository.findById(dto.getTaskId())
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            if (!task.getProject().getProjectId().equals(project.getProjectId())) {
                throw new RuntimeException("Task does not belong to project");
            }
        }

        TimeLog timeLog = new TimeLog();
            timeLog.setNotes(dto.getNotes());
            timeLog.setHoursLogged(dto.getHoursLogged());
            timeLog.setLogDate(dto.getLogDate());

            timeLog.setUser(currentUser);
            timeLog.setProject(project);

            if(task != null){
                timeLog.setTask(task);
            }
            TimeLog saved = timeLogRepository.save(timeLog);

            return mapToResponse(saved);
    }

    public List<TimeLogResponseDTO> getLogsByProject(Long projectId) {

        User currentUser = getCurrentUser();

        //Verify project ownership
        Project project = projectRepository
                .findByProjectIdAndUser(projectId, currentUser)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Fetch logs
        return timeLogRepository.findAllByProject(project)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProjectTimeDTO getTotalHours(Long projectId) {

        User currentUser = getCurrentUser();

        //Verify project
        Project project = projectRepository
                .findByProjectIdAndUser(projectId, currentUser)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        //Get total hours
        Double totalHours = timeLogRepository.getTotalHoursByProject(project);

        if (totalHours == null) {
            totalHours = 0.0;
        }

        //Return DTO
        ProjectTimeDTO dto = new ProjectTimeDTO();
        dto.setProjectId(projectId);
        dto.setTotalHours(totalHours);

        return dto;
    }

    public void deleteLog(Long logId) {

        User currentUser = getCurrentUser();

        TimeLog log = timeLogRepository
                .findByLogIdAndUser(logId, currentUser)
                .orElseThrow(() -> new RuntimeException("Log not found"));

        timeLogRepository.delete(log);
    }

    // MAPPER METHOD
    private TimeLogResponseDTO mapToResponse(TimeLog timeLog) {
        TimeLogResponseDTO dto = new TimeLogResponseDTO();

        dto.setLogId(timeLog.getLogId());
        dto.setNotes(timeLog.getNotes());
        dto.setHoursLogged(timeLog.getHoursLogged());
        dto.setCreatedAt(timeLog.getCreatedAt());
        dto.setLogDate(timeLog.getLogDate());
        dto.setProjectId(timeLog.getProject().getProjectId());
        dto.setProjectTitle(timeLog.getProject().getTitle());
        if (timeLog.getTask() != null) {
            dto.setTaskId(timeLog.getTask().getTaskId());
            dto.setTaskTitle(timeLog.getTask().getTitle());
        }


        return dto;
    }
}
