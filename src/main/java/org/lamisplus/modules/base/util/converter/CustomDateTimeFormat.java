package org.lamisplus.modules.base.util.converter;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@RequiredArgsConstructor
public class CustomDateTimeFormat {

    public static LocalDate LocalDateByFormat(LocalDate date, String format){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
        return LocalDate.parse(formatter.format(date),formatter);
    }

    public static LocalTime LocalTimeByFormat(LocalTime time, String format){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
        return LocalTime.parse(formatter.format(time),formatter);
    }

    public static LocalDateTime LocalDateTimeByFormat(LocalDateTime time, String format){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
        return LocalDateTime.parse(formatter.format(time),formatter);
    }
}
