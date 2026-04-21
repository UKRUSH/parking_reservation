package com.parking_reservation.service;

import com.parking_reservation.dto.response.ParkingSlotResponse;
import com.parking_reservation.entity.ParkingSlot;
import com.parking_reservation.entity.ParkingSlot.SlotStatus;
import com.parking_reservation.repository.ParkingBookingRepository;
import com.parking_reservation.repository.ParkingSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingSlotService {

    private final ParkingSlotRepository slotRepository;
    private final ParkingBookingRepository bookingRepository;

    public List<ParkingSlotResponse> getSlots(String type, LocalDateTime start, LocalDateTime end) {
        List<ParkingSlot> slots = (type != null && !type.isBlank())
                ? slotRepository.findByTypeIgnoreCase(type)
                : slotRepository.findAll();

        Set<Long> occupiedIds = bookingRepository.findOccupiedSlotIds(start, end);

        return slots.stream()
                .map(s -> {
                    boolean available = s.getStatus() == SlotStatus.AVAILABLE
                            && !occupiedIds.contains(s.getId());
                    return ParkingSlotResponse.from(s, available);
                })
                .collect(Collectors.toList());
    }
}
