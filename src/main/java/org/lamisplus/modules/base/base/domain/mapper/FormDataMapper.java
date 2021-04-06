package org.lamisplus.modules.base.base.domain.mapper;

import org.lamisplus.modules.base.base.domain.dto.FormDataDTO;
import org.lamisplus.modules.base.base.domain.entity.FormData;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FormDataMapper {
    FormDataDTO toFormDataDTO(FormData formData);
}
