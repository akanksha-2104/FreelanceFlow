package com.freelanceflow.services;

import com.freelanceflow.dto.*;
import com.freelanceflow.entity.Task;
import com.freelanceflow.entity.User;
import com.freelanceflow.repository.UserRepository;
import com.freelanceflow.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserResponseDTO register(RegisterDTO dto) {
        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .passwordHash(encoder.encode(dto.getPassword()))
                .fullName(dto.getFullName())
                .build();

        User savedUser = userRepository.save(user);

        UserResponseDTO response = UserResponseDTO.builder()
                .userId(savedUser.getUserId())
                .username(savedUser.getUsername())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .build();

        return response;
    }



    public ResponseEntity<AuthResponseDTO> login(LoginDTO dto){
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(()-> new RuntimeException("User not found"));

        if(!encoder.matches(dto.getPassword(), user.getPasswordHash())){
            throw new RuntimeException("Wrong Password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        AuthResponseDTO response = mapToResponse(user, token);

        return ResponseEntity.ok(response);

    }

    private AuthResponseDTO mapToResponse(User user, String token) {
        AuthResponseDTO dto = new AuthResponseDTO();

        dto.setToken(token);
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setUserName(user.getUsername());

        return dto;
    }
}
