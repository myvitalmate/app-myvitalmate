package com.myvitalmate.app.registration.repository;

import com.myvitalmate.app.registration.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
}
