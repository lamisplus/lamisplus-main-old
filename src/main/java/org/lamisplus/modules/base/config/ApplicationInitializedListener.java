package org.lamisplus.modules.base.config;

import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.SystemUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.context.ServletWebServerInitializedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationInitializedListener {
    private static final Logger LOG = LoggerFactory.getLogger(ApplicationInitializedListener.class);
    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    @Async
    public void onApplicationEvent(ServletWebServerInitializedEvent event) {
        LOG.info("Scanning for active modules...");
        int port = event.getApplicationContext().getWebServer().getPort();
        String url = "http://localhost:" + port;
        (new ApplicationInitializedListener.BareBonesBrowserLaunch()).openURL(url);
        this.messagingTemplate.convertAndSend("/topic/modules-changed", "Application started");
    }

    static class BareBonesBrowserLaunch {
        final String[] browsers = new String[]{"x-www-browser", "google-chrome", "firefox", "opera", "epiphany", "konqueror", "conkeror", "midori", "kazehakase", "mozilla"};

        BareBonesBrowserLaunch() {
        }

        public void openURL(String url) {
            try {
                Class<?> d = Class.forName("java.awt.Desktop");
                d.getDeclaredMethod("browse", URI.class).invoke(d.getDeclaredMethod("getDesktop").invoke((Object)null), URI.create(url));
            } catch (Exception var9) {
                try {
                    if (SystemUtils.IS_OS_MAC) {
                        Class.forName("com.apple.eio.FileManager").getDeclaredMethod("openURL", String.class).invoke((Object)null, url);
                    } else if (SystemUtils.IS_OS_WINDOWS) {
                        Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + url);
                    } else {
                        String browser = null;
                        String[] var4 = this.browsers;
                        int var5 = var4.length;

                        for(int var6 = 0; var6 < var5; ++var6) {
                            String b = var4[var6];
                            if (browser == null && Runtime.getRuntime().exec(new String[]{"which", b}).getInputStream().read() != -1) {
                                Runtime var10000 = Runtime.getRuntime();
                                String[] var10001 = new String[2];
                                browser = b;
                                var10001[0] = b;
                                var10001[1] = url;
                                var10000.exec(var10001);
                            }
                        }

                        if (browser == null) {
                            throw new Exception(Arrays.toString(this.browsers));
                        }
                    }
                } catch (Exception var8) {
                    ApplicationInitializedListener.LOG.error("Could not open browser: {}", var8.getMessage());
                }
            }

        }
    }
}