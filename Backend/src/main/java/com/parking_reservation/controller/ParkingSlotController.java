package com.parking_reservation.controller;

import com.parking_reservation.dto.response.ApiResponse;
import com.parking_reservation.dto.response.ParkingSlotResponse;
import com.parking_reservation.service.ParkingSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/parking-slots")
@RequiredArgsConstructor
public class ParkingSlotController {

    private final ParkingSlotService slotService;

    // GET /api/v1/parking-slots?type=CAR&startTime=...&endTime=...
    @GetMapping
    public ResponseEntity<ApiResponse<List<ParkingSlotResponse>>> getSlots(
            @RequestParam(required = false) String type,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {

        LocalDateTime start = startTime != null ? startTime : LocalDateTime.now();
        LocalDateTime end = endTime != null ? endTime
                : LocalDateTime.now().plusDays(1).withHour(23).withMinute(59).withSecond(0).withNano(0);

        return ResponseEntity.ok(ApiResponse.success(slotService.getSlots(type, start, end)));
    }
}
