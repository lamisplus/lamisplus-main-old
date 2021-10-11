package org.lamisplus.modules.base.extension.lims;

import lombok.Data;

@Data
public class PatientID {
    public String idNumber;
    public String idTypeCode;

 /*   @JsonGetter(value = "IDNumber")
    public String getIDNumber() {
        return IDNumber;
    }

    @JsonGetter(value = "IDTypeCode")
    public String getIDTypeCode() {
        return IDTypeCode;
    }
*/

}
