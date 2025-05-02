package com.myvitalmate.app.userProfile.mapper;

import com.myvitalmate.app.userProfile.dto.PatientProfileDTO;
import com.myvitalmate.app.userProfile.entity.PatientProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    PatientProfileDTO toDto(PatientProfile entity);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    PatientProfile toEntity(PatientProfileDTO dto);

    List<PatientProfileDTO> toDtoList(List<PatientProfile> entities);
}