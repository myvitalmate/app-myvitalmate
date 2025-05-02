package com.myvitalmate.app.userProfile.repository;

import com.myvitalmate.app.login.entity.User;
import com.myvitalmate.app.userProfile.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
    List<PatientProfile> findByUser(User user);
}
