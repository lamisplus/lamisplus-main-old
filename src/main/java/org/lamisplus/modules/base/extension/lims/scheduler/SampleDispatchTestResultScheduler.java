package org.lamisplus.modules.base.extension.lims.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class SampleDispatchTestResultScheduler {
    private final SampleDispatchHandler sampleDispatchHandler;
    private final TestResultHandler testResultHandler;

    //repeat sample dispatch every 6 hours  "0 0 0/6 * * ?"
    @Scheduled(cron="0 0/5 * * * ?")
    public void dispatchJob() throws Exception {
        //sampleDispatchHandler.dispatch();
    }

    //repeat every 30 minutes value="0 0/30 * * * ?"
    @Scheduled(cron="0 0/30 * * * ?")
    public void resultJob() throws Exception {
        //testResultHandler.retrieve();
    }

}
