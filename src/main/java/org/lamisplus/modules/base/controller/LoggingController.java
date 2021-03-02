package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.util.MediaTypeUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import javax.servlet.ServletContext;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/logs")
@Slf4j
@RequiredArgsConstructor
@Audit
public class LoggingController {
    private final ServletContext servletContext;
    @Value("${logging.file.name}")
    private String logFile;

    @GetMapping
    public String log() {
        System.out.println("Testing 123");
        log.trace("This is a TRACE level message");
        log.debug("This is a DEBUG level message");
        log.info("This is an INFO level message");
        log.warn("This is a WARN level message");
        log.error("This is an ERROR level message");
        return "See the log for details";
    }

    @GetMapping(value = "/get-file")
    public ResponseEntity<ByteArrayResource> getFile() throws IOException {
        File file = new File(logFile);

        MediaType mediaType = MediaTypeUtils.getMediaTypeForFileName(this.servletContext, file.getName());
        System.out.println("fileName: " + file.getName());
        System.out.println("mediaType: " + mediaType);

        Path path = Paths.get(logFile);
        byte[] data = Files.readAllBytes(path);
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity.ok()
                // Content-Disposition
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + path.getFileName().toString())
                // Content-Type
                .contentType(mediaType) //
                // Content-Length
                .contentLength(data.length) //
                .body(resource);

    }
}
