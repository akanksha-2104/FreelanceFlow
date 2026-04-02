package com.freelanceflow.freelanceFlow.repository;

import com.freelanceflow.freelanceFlow.entity.Client;
import com.freelanceflow.freelanceFlow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByClientIdAndUser(Long clientId, User user);
    List<Client> findAllByUser(User user);
}
