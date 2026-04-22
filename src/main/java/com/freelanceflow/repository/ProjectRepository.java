package com.freelanceflow.repository;

import com.freelanceflow.entity.Project;
import com.freelanceflow.entity.User;
import com.freelanceflow.entity.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByUser(User user);
    Optional<Project> findByProjectIdAndUser(Long projectId, User user);
    List<Project> findAllByUserAndStatus(User user, ProjectStatus status);

    // 🔹 Count projects by status
    Long countByUserAndStatus(User user, ProjectStatus status);

    // 🔹 Upcoming deadlines (next 7 days)
    @Query("SELECT p FROM Project p WHERE p.user = :user AND p.deadline BETWEEN :today AND :nextWeek AND p.status = 'ACTIVE'")
    List<Project> findUpcomingDeadlines(@Param("user") User user,
                                        @Param("today") LocalDate today,
                                        @Param("nextWeek") LocalDate nextWeek);
}
