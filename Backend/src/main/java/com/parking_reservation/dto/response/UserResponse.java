package com.parking_reservation.dto.response;

import com.parking_reservation.entity.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String profilePic;
    private Set<String> roles;
    private boolean active;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setProfilePic(user.getProfilePic());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setRoles(user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet()));
        return dto;
    }
}
