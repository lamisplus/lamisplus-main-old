package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.FormDTO;
import org.lamisplus.modules.base.domain.dto.FormDataDTO;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FormDataMapper {
    FormDataDTO toFormDataDTO(FormData formData);
}
