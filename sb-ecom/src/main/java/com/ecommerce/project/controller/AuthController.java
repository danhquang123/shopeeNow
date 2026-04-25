package com.ecommerce.project.controller;

import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.Role;
import com.ecommerce.project.model.User;
import com.ecommerce.project.repositories.RoleRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.security.jwt.JwtUtils;
import com.ecommerce.project.security.jwt.LoginRequest;

import com.ecommerce.project.security.jwt.SignupRequest;
import com.ecommerce.project.security.response.MessageResponse;
import com.ecommerce.project.security.response.UserInfoResponse;
import com.ecommerce.project.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {
        org.springframework.web.bind.annotation.RequestMethod.GET,
        org.springframework.web.bind.annotation.RequestMethod.POST,
        org.springframework.web.bind.annotation.RequestMethod.PUT,
        org.springframework.web.bind.annotation.RequestMethod.DELETE,
        org.springframework.web.bind.annotation.RequestMethod.OPTIONS })
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // =========================
    // 🔐 Inject Security Beans
    // =========================
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // 1. Tạo Cookie (Vẫn giữ để dùng cho các request dùng Cookie)
        ResponseCookie jwtCookie = jwtUtils.generateCookie(userDetails);

        // 2. Tạo chuỗi Token "SẠCH" (Chỉ chứa eyJ...)
        String cleanJwtToken = jwtUtils.generateTokenFromUsername(userDetails.getUsername());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // TRẢ VỀ: Header có Cookie, Body có Token sạch
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(new UserInfoResponse(
                        userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getEmail(),
                        roles,
                        cleanJwtToken // <--- QUAN TRỌNG: Gửi cleanJwtToken thay vì jwtCookie.toString()
                ));
    }

    // =========================
    // 🔑 LOGIN → JWT
    // =========================
    // @PostMapping("/signin")
    // public ResponseEntity<?> authenticateUser(
    // @RequestBody LoginRequest loginRequest) {
    //
    // Authentication authentication;
    //
    // try {
    // authentication = authenticationManager.authenticate(
    // new UsernamePasswordAuthenticationToken(
    // loginRequest.getUsername(),
    // loginRequest.getPassword()
    // )
    // );
    //
    // } catch (AuthenticationException exception) {
    //
    // Map<String, Object> error = new HashMap<>();
    // error.put("message", "Bad credentials");
    // error.put("status", false);
    //
    // return new ResponseEntity<>(
    // error,
    // HttpStatus.UNAUTHORIZED
    // );
    // }
    //
    // // Lưu auth vào context
    // SecurityContextHolder.getContext()
    // .setAuthentication(authentication);
    //
    // // Lấy user
    // UserDetailsImpl userDetails =
    // (UserDetailsImpl) authentication.getPrincipal();
    //
    // // Tạo JWT
    // String jwtToken =
    // jwtUtils.generateTokenFromUser(userDetails);
    //
    // // Lấy roles
    // List<String> roles =
    // userDetails.getAuthorities()
    // .stream()
    // .map(item -> item.getAuthority())
    // .collect(Collectors.toList());
    //
    // // Response
    // UserInfoResponse response =
    // new UserInfoResponse(
    // userDetails.getId(),
    //
    // userDetails.getUsername(),
    // roles,
    // jwtToken
    // );
    //
    // return ResponseEntity.ok(response);
    // }

    @PostMapping("/signup")

    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByUserName(signupRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("ERROR: Username is already taken !"));
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("ERROR: Email is already taken !"));
        }

        User user = new User(
                signupRequest.getUsername(),
                signupRequest.getEmail(),
                passwordEncoder.encode(signupRequest.getPassword()));

        List<String> strRoles = signupRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error : Role is not found"));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });

        }
        user.setRoles(roles); // Gán set roles cho user
        userRepository.save(user); // Lưu vào database

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/username")
    public String currentUserName(Authentication authentication) {
        if (authentication != null) {
            return authentication.getName();
        } else
            return "NULL";
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }
        return ResponseEntity.ok()
                .body(new UserInfoResponse(
                        userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getEmail(),
                        roles,
                        null));

    }

    @GetMapping("/user/email")
    public ResponseEntity<?> getUserEmail(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User not logged in"));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Map<String, String> response = new HashMap<>();
        response.put("email", userDetails.getEmail());
        response.put("username", userDetails.getUsername());
        response.put("id", userDetails.getId().toString());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signoutUser() {
        ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageResponse("You Have Signed Out ! "));
    }

}
