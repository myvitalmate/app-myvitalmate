package com.myvitalmate.app.userProfile.repository;

import com.myvitalmate.app.login.entity.User;
import com.myvitalmate.app.userProfile.entity.DietitianProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DietitianProfileRepository extends JpaRepository<DietitianProfile, Long> {
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END " +
            "FROM DietitianProfile d " +
            "WHERE d.contact.email = :email OR d.contact.phoneNumber = :phoneNumber ")
    boolean existingContactData(
            @Param("email") String email,
            @Param("phoneNumber") String phoneNumber
    );

    List<DietitianProfile> findByUser(User user);
}
