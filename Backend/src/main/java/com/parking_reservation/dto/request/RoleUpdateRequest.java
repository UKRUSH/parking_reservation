package com.parking_reservation.dto.request;

import com.parking_reservation.entity.RoleType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleUpdateRequest {
    @NotNull(message = "Role is required")
    private RoleType role;
}
