package org.lamisplus.modules.base.base.domain.dto;

import lombok.Data;

@Data
public class IcdDistinctDTO {
    private String categoryCode;
    private String categoryTitle;

    public IcdDistinctDTO(String categoryCode, String categoryTitle) {
        this.categoryCode = categoryCode;
        this.categoryTitle = categoryTitle;
    }
}
