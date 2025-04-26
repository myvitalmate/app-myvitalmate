package com.myvitalmate.app.userProfile.mapper;

import com.myvitalmate.app.userProfile.dto.DietitianProfileDTO;
import com.myvitalmate.app.userProfile.entity.DietitianProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DietitianMapper {
    DietitianProfileDTO toDto(DietitianProfile entity);

    @Mapping(target = "id", ignore = true)
    DietitianProfile toEntity(DietitianProfileDTO dto);

    List<DietitianProfileDTO> toDtoList(List<DietitianProfile> entities);
}
