package org.lamisplus.modules.base.base.domain.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
public class FileInfo {
    private String name;
    private String url;

    public FileInfo(String name, String url) {
        this.name = name;
        this.url = url;
    }
}
