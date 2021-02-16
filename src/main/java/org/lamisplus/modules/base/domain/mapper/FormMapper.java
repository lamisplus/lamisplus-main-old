package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.FormDTO;
import org.lamisplus.modules.base.domain.entity.Form;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FormMapper {
    FormDTO toForm(Form form);
    Form toFormDTO(FormDTO formDTO);
}
