package com.myvitalmate.app.userProfile.repository;

import com.myvitalmate.app.userProfile.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
}
