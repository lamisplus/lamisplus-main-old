package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class OrganisationUnitExtraction {
    private String organisationUnitName;
    private String parentOrganisationUnitName;
    private String parentParentOrganisationUnitName;
    private Long parentOrganisationUnitId;
    private String description;

        /*private Object getCellValue(Cell cell)
        {
            switch (cell.getCellType()) {
                case Cell.CELL_TYPE_STRING:
                    return cell.getStringCellValue();

                case Cell.CELL_TYPE_BOOLEAN:
                    return cell.getBooleanCellValue();

                case Cell.CELL_TYPE_NUMERIC:
                    return cell.getNumericCellValue();
            }

            return null;
        }*/
}
