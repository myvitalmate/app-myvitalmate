package com.myvitalmate.app.nutrientLog.mapper;

import com.myvitalmate.app.nutrientLog.dto.NutrientValuesDTO;
import com.myvitalmate.app.nutrientLog.entity.NutrientEntryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NutrientValuesMapper {
    NutrientValuesDTO toDto(NutrientEntryEntity entity);

    @Mapping(target = "id", ignore = true)
    NutrientEntryEntity toEntity(NutrientValuesDTO dto);

    List<NutrientValuesDTO> toDtoList(List<NutrientEntryEntity> entities);
}
