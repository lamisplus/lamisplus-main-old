package org.lamisplus.modules.base.util;

import org.eclipse.birt.report.engine.api.IRenderOption;

public enum OperatorType {
    EQUAL_T0("equal_to"),
    GREATER_THAN("greater_than"),
    LESS_THAN("less_than"),
    GREATER_THAN_OR_EQUAL_TO("greater_than_or_equal_to"),
    LESS_THAN_OR_EQUAL_TO("less_than_or_equal_to"),
    INVALID("invalid");

    String val;
    OperatorType(String val) {
        this.val = val;
    }

    public static OperatorType from(String text) {
        for (OperatorType output : values()) {
            if(output.val.equalsIgnoreCase(text)) return output;
        }
        return INVALID;
    }
}
