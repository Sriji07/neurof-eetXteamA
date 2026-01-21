package com.neurofleetx.backend.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neurofleetx.backend.dto.LoginRequest;
import com.neurofleetx.backend.dto.RegisterRequest;
import com.neurofleetx.backend.model.User;
import com.neurofleetx.backend.service.UserService;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // ========= REGISTER =========
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    try {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setGender(request.getGender());
        user.setRole(request.getRole());

        userService.register(user);

        // Success response
        return ResponseEntity.ok("Registration successful");

    } catch (IllegalArgumentException e) {
        // Custom error message sent to frontend
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Email already registered");
    }
}



    // ========= LOGIN =========
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {

        User user = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        return ResponseEntity.ok(user);
    }
}