package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.domain.entity.Update;
import org.lamisplus.modules.base.repository.UpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.io.*;
import java.net.*;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class UpdateService {
    private static final int UPDATE_AVAILABLE = 1;
    private static final int UPDATE_COMPLETED = 2;
    private final UpdateRepository updateRepository;
    public static String modulePath = System.getProperty("user.dir");

    @Autowired
    Environment environment;


    public Update getLatestUpdate() {
        Optional<Update> optionalUpdate = updateRepository.findUpdateByMaxVersionFromClient();
        if(optionalUpdate.isPresent()){
            return optionalUpdate.get();
        }
        throw new EntityNotFoundException(Update.class, "Update", "No update available check db");
    }

    public CompletableFuture<Boolean> downloadUpdateOnServer() {
        checkForUpdateOnClient();
        Optional<Update> optionalUpdate = updateRepository.findAnyUpdateByMaxVersion();
        CompletableFuture<Boolean> completableFuture = new CompletableFuture<>();

        //Downloading update on a new thread
        Executors.newCachedThreadPool().submit(() -> {
            try {
                if(optionalUpdate.isPresent()) {
                    URL urlObject = new URL(optionalUpdate.get().getUrl());
                    URLConnection urlConnection = urlObject.openConnection();
                    urlConnection.connect();
                    InputStream inputStream = urlConnection.getInputStream();
                    if (readFromInputStream(inputStream)) {
                        Update update = optionalUpdate.get();
                        update.setStatus(UPDATE_COMPLETED);
                        updateRepository.save(update);
                        completableFuture.complete(true);
                    } else {
                        completableFuture.complete(false);
                    }
                }
            } catch (IOException e) {
                completableFuture.complete(false);
                throw new IOException("No internet connection");
            }
            return null;
        });
        return completableFuture;
    }


    private Boolean readFromInputStream(InputStream inputStream){
        Boolean updatedDownloaded;
        File updateFolder = new File(modulePath + File.separator +"update");
        if (!updateFolder.exists() && !updateFolder.isDirectory()) {
            updateFolder.mkdir();
        }
        File lamisPlusJar = new File(updateFolder.getAbsolutePath() + File.separator +"lamisplus.jar");
        int nBytesToRead;
        FileOutputStream fileInputStream = null;
        BufferedOutputStream bufferedOutputStream = null;

        try {
            nBytesToRead = inputStream.available();
            fileInputStream = new FileOutputStream(lamisPlusJar);
            bufferedOutputStream = new BufferedOutputStream(fileInputStream);
            int nRead;
            byte[] data = new byte[nBytesToRead];
            while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                log.info("Writing some bytes of file...");
                bufferedOutputStream.write(data, 0, nRead);
            }
            updatedDownloaded = true;
        }catch (IOException e){
            updatedDownloaded = false;
            log.error(e.getMessage());
        } finally {
            try {
                bufferedOutputStream.close();
                fileInputStream.close();
            }catch (IOException e){
                log.error(e.getMessage());
                e.printStackTrace();
            }
        }
        if(lamisPlusJar.exists()){
            return updatedDownloaded;
        }
        return updatedDownloaded;
    }

    //On the server
    public Update checkForUpdateOnServer(Double version){
        Update update = updateRepository.findByMaxVersion(version);
        return update;
    }


    //On client
    // cron to execute each 1h
    @Scheduled(cron = "0 */1 * * *")
    public Boolean checkForUpdateOnClient(){
        Update lastUpdateCompleted = updateRepository.findUpdateByMaxVersion();
        Update updateNotCompleted = updateRepository.findUpdateByMaxVersionNotCompleted();
        Boolean isUpdatedAvailable = false;

        try {
            if (lastUpdateCompleted != null && updateNotCompleted == null) {
                String uri = "http://www.lamisplus.org/base-module/api/updates/server?version="+lastUpdateCompleted.getVersion();
                RestTemplate restTemplate = new RestTemplate();
                Update result = restTemplate.getForObject(uri, Update.class);
                if (result != null) {
                    result.setStatus(UPDATE_AVAILABLE);
                    updateRepository.save(result);
                    isUpdatedAvailable = true;
                }
            }
            else if(updateNotCompleted != null){
                isUpdatedAvailable = true;
            }
        }catch (Exception ce){
            //ce.printStackTrace();
            throw new IllegalTypeException(Update.class, "url", lastUpdateCompleted.getUrl());
        }
        return isUpdatedAvailable;
    }


    public Update save(Long id, Update update){
        Update update1 = updateRepository.findByIdAndMaxVersion(id)
                .orElseThrow(() -> new EntityNotFoundException(Update.class, "id", id+""));
        update.setId(update1.getId());
        return updateRepository.save(update);
    }
}
