package com.myvitalmate.app.userProfile.repository;

import com.myvitalmate.app.userProfile.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END " +
            "FROM PatientProfile p " +
            "WHERE p.contact.email = :email OR p.contact.phoneNumber = :phoneNumber ")
    boolean existingContactData(
            @Param("email") String email,
            @Param("phoneNumber") String phoneNumber
    );
}
