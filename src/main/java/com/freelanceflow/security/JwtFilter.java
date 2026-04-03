package com.freelanceflow.security;

import com.freelanceflow.entity.User;
import com.freelanceflow.repository.UserRepository;
import com.freelanceflow.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {


        if (request.getRequestURI().startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }


        String authorizationHeader = request.getHeader("Authorization");

//        System.out.println("Request URI: " + request.getRequestURI());
//        System.out.println("Authorization Header: " + authorizationHeader);

        if(authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request,response);
            return;
        }

        String token = authorizationHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        try{
            if(email != null && jwtUtil.validateToken(token)) {
                User user = userRepository.findByEmail(email)
                        .orElse(null);

                if(user != null) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            user, null , List.of(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                    //System.out.println("Auth set for: " + email);
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }
        catch(Exception e){
            e.printStackTrace();
        }

        filterChain.doFilter(request,response);
    }
}
