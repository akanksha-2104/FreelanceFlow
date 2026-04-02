package com.freelanceflow.freelanceFlow.controller;

import com.freelanceflow.freelanceFlow.dto.ClientDTO;
import com.freelanceflow.freelanceFlow.dto.ClientResponseDTO;
import com.freelanceflow.freelanceFlow.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    ClientService clientService;

    @PostMapping
    public ClientResponseDTO createClient(@RequestBody ClientDTO dto) {
        return clientService.createClient(dto);
    }

    @GetMapping
    public List<ClientResponseDTO> getAllClients() {
        return clientService.getAllClients();
    }

    @PutMapping("/{id}")
    public ClientResponseDTO updateClient(@PathVariable Long id, @RequestBody ClientDTO dto) {
        return clientService.updateClient(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
    }
}
