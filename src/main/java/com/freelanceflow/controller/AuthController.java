package com.freelanceflow.controller;

import com.freelanceflow.dto.LoginDTO;
import com.freelanceflow.dto.RegisterDTO;
import com.freelanceflow.dto.UserResponseDTO;
import com.freelanceflow.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserResponseDTO register(@RequestBody RegisterDTO registerDTO) {
        return userService.register(registerDTO);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginDTO loginDTO) {
        return userService.login(loginDTO);
    }
}
