package com.parking_reservation.service;

import com.parking_reservation.dto.response.UserResponse;
import com.parking_reservation.entity.Role;
import com.parking_reservation.entity.RoleType;
import com.parking_reservation.entity.User;
import com.parking_reservation.exception.ResourceNotFoundException;
import com.parking_reservation.repository.RoleRepository;
import com.parking_reservation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateRole(Long userId, RoleType newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Role role = roleRepository.findByName(newRole)
                .orElseGet(() -> roleRepository.save(new Role(newRole)));

        user.getRoles().clear();
        user.getRoles().add(role);
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setActive(false);
        userRepository.save(user);
    }
}
