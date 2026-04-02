package com.freelanceflow.freelanceFlow.services;

import com.freelanceflow.freelanceFlow.dto.ClientDTO;
import com.freelanceflow.freelanceFlow.dto.ClientResponseDTO;
import com.freelanceflow.freelanceFlow.entity.Client;
import com.freelanceflow.freelanceFlow.entity.User;
import com.freelanceflow.freelanceFlow.repository.ClientRepository;
import com.freelanceflow.freelanceFlow.repository.UserRepository;
import com.freelanceflow.freelanceFlow.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {
    @Autowired
    ClientRepository clientRepository;



    private User getCurrentUser(){
        return(User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public ClientResponseDTO createClient(ClientDTO dto){

        User user = getCurrentUser();

        Client client = new Client();
        client.setClientName(dto.getClientName());
        client.setEmail(dto.getEmail());
        client.setPhone(dto.getPhone());
        client.setCompany(dto.getCompany());
        client.setAddress(dto.getAddress());

        client.setUser(user);

        Client saved = clientRepository.save(client);

        return mapToResponse(saved);
    }

    public List<ClientResponseDTO> getAllClients(){

        User currentUser = getCurrentUser();
        return clientRepository.findAllByUser(currentUser)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ClientResponseDTO updateClient(Long clientId, ClientDTO dto){
        User user = getCurrentUser();

        Client client = clientRepository.findByClientIdAndUser(clientId, user)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setClientName(dto.getClientName());
        client.setEmail(dto.getEmail());
        client.setPhone(dto.getPhone());
        client.setCompany(dto.getCompany());
        client.setAddress(dto.getAddress());

        return mapToResponse(clientRepository.save(client));
    }

    public void deleteClient(Long clientId){
        User currentUser = getCurrentUser();

        Client client = clientRepository.findByClientIdAndUser(clientId, currentUser)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        clientRepository.delete(client);

    }

    private ClientResponseDTO mapToResponse(Client client){
        ClientResponseDTO dto = new ClientResponseDTO();
        dto.setClientId(client.getClientId());
        dto.setClientName(client.getClientName());
        dto.setEmail(client.getEmail());
        dto.setPhone(client.getPhone());
        dto.setCompany(client.getCompany());
        dto.setAddress(client.getAddress());
        return dto;
    }

}
