package org.lamisplus.modules.base.controller.apierror;


import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;
@RequiredArgsConstructor
public class RecordExistException extends RuntimeException {

    public RecordExistException(Class clazz, String... searchParamsMap) {
        super(RecordExistException.generateMessage(clazz.getSimpleName(), ErrorMapper.toMap(String.class, String.class, searchParamsMap)));
    }

    private static String generateMessage(String entity, Map<String, String> searchParams) {
        return StringUtils.capitalize(entity) +
                " already exist " + searchParams;
    }
}
