package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.FormDTO;
import org.lamisplus.modules.base.domain.entity.Form;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FormMapper {
    FormDTO toForm(Form form);
    Form toFormDTO(FormDTO formDTO);

    @Named("mapWithoutResourceObject")
    @Mapping(target = "resourceObject", ignore = true)
    FormDTO mapWithoutResourceObject(Form form);

    @IterableMapping(qualifiedByName="mapWithoutResourceObject")
    List<FormDTO> FormToFormDTOs(List<Form> forms);
}
