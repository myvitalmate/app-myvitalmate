package com.myvitalmate.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.myvitalmate.app.dto.HealthResponseDto;

@RestController
@RequestMapping(value = "health")
public class HealthController {

	@GetMapping("/check/")
	public ResponseEntity<HealthResponseDto> getHealthCheck(@RequestParam String query) {

		HealthResponseDto response = new HealthResponseDto(
				"Spring Boot service is running smoothly. Search query received: " + query);

		return ResponseEntity.ok(response);
	}

}
