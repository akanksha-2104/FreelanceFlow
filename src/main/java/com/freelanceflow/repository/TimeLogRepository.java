package com.freelanceflow.repository;

import com.freelanceflow.entity.Project;
import com.freelanceflow.entity.TimeLog;
import com.freelanceflow.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeLogRepository extends CrudRepository<TimeLog, Long> {
    List<TimeLog> findAllByProject(Project project);
    List<TimeLog> findAllByUser(User user);
    Optional<TimeLog> findByLogIdAndUser(Long logId, User user);
    @Query("SELECT SUM(t.hoursLogged) FROM TimeLog t WHERE t.project = :project")
    Double getTotalHoursByProject(@Param("project")Project project) ;

    @Query("SELECT SUM(t.hoursLogged) FROM TimeLog t WHERE t.user = :user AND t.logDate >= :startDate")
    Double getTotalHoursByUserAndDateRange(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate
    );
}
