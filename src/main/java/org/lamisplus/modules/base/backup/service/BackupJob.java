package org.lamisplus.modules.base.backup.service;

import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.backup.config.ContextProvider;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

@Slf4j
public class BackupJob implements Job {
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        BackupService backupService = ContextProvider.getBean(BackupService.class);
        backupService.backupPGSQL(false);
        backupService.cleanupBackup();
    }
}
