package com.freelanceflow.freelanceFlow.services;

import com.freelanceflow.freelanceFlow.dto.AuthResponseDTO;
import com.freelanceflow.freelanceFlow.dto.LoginDTO;
import com.freelanceflow.freelanceFlow.dto.RegisterDTO;
import com.freelanceflow.freelanceFlow.dto.UserResponseDTO;
import com.freelanceflow.freelanceFlow.entity.User;
import com.freelanceflow.freelanceFlow.repository.UserRepository;
import com.freelanceflow.freelanceFlow.util.JwtUtil;
import jakarta.servlet.Registration;
import org.springframework.beans.factory.annotation.Autowired;
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



    public String login(LoginDTO dto){
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(()-> new RuntimeException("User not found"));

        if(!encoder.matches(dto.getPassword(), user.getPasswordHash())){
            throw new RuntimeException("Wrong Password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return token;

    }
}
