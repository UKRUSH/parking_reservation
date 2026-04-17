package com.parking_reservation.controller;

import com.parking_reservation.dto.response.ApiResponse;
import com.parking_reservation.dto.response.UserResponse;
import com.parking_reservation.entity.User;
import com.parking_reservation.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    /**
     * GET /api/v1/auth/me
     * Returns the currently authenticated user's profile from the JWT context.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal User user) {

        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        return ResponseEntity.ok(ApiResponse.success(UserResponse.from(user)));
    }

    /**
     * POST /api/v1/auth/logout
     * JWT is stateless — client discards the token.
     * Backend simply confirms the logout.
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }
}
