package org.lamisplus.modules.base.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.SystemUtils;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.context.ServletWebServerInitializedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
@Slf4j
public class BrowserLauncher{
    private static String command = "rundll32 url.dll,FileProtocolHandler ";
    String url = "http://localhost:8484";

    @EventListener(ApplicationReadyEvent.class)
    public void launchBrowser(){
        Runtime runtime = Runtime.getRuntime();
        if (SystemUtils.IS_OS_WINDOWS) {
            try {
                runtime.exec("rundll32 url.dll, FileProtocolHandler " + url);
                log.info("url {}", url);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else if (SystemUtils.IS_OS_LINUX) {
            String[] browsers = { "epiphany", "firefox", "mozilla", "konqueror",
                    "netscape", "opera", "links", "lynx" };

            StringBuffer cmd = new StringBuffer();
            for (int i = 0; i < browsers.length; i++)
                if(i == 0)
                    cmd.append(String.format(    "%s \"%s\"", browsers[i], url));
                else
                    cmd.append(String.format(" || %s \"%s\"", browsers[i], url));
            // If the first didn't work, try the next browser and so on

            try {
                runtime.exec(new String[] { "sh", "-c", cmd.toString() });
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else if (SystemUtils.IS_OS_MAC) {
            String url = "http://stackoverflow.com";
            try {
                runtime.exec("open " + url);
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
    }

    private int port;

    public int getPort() {
        return port;
    }

    @EventListener
    public void onApplicationEvent(final ServletWebServerInitializedEvent event) {
        port = event.getWebServer().getPort();
        log.info("port {}", port);
    }
}
