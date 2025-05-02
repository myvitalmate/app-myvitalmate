package com.myvitalmate.app.userProfile.repository;

import com.myvitalmate.app.login.entity.User;
import com.myvitalmate.app.userProfile.entity.DietitianProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DietitianProfileRepository extends JpaRepository<DietitianProfile, Long> {
    List<DietitianProfile> findByUser(User user);
}
