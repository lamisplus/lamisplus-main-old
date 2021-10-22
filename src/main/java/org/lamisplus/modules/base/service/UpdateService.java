package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.entity.Update;
import org.lamisplus.modules.base.repository.UpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.yaml.snakeyaml.Yaml;

import javax.annotation.PostConstruct;
import java.io.*;
import java.net.*;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class UpdateService {
    private static final int UPDATE_AVAILABLE = 1;
    private static final int UPDATE_COMPLETED = 3;
    private final UpdateRepository updateRepository;
    @Autowired
    Environment environment;


    public List<Update> getUpdates() {
        return this.updateRepository.findAll();
    }

    public void downloadUpdateOnServer() throws IOException {
        Optional<Update> optionalUpdate = updateRepository.findUpdateByMaxVersionFromClient();
        try {
            if(optionalUpdate.isPresent()) {
                URL urlObject = new URL(optionalUpdate.get().getUrl());
                URLConnection urlConnection = urlObject.openConnection();
                urlConnection.connect();
                InputStream inputStream = urlConnection.getInputStream();
                readFromInputStream(inputStream);
            }else {
                if(!checkForUpdateOnClient()) {
                    throw new EntityNotFoundException(Update.class, "update", "not available at this time");
                }else {

                }
            }
        } catch (IOException e) {
            throw new IOException("No internet connection");
        }
    }


    private void readFromInputStream(InputStream inputStream){
        File file = new File("update/lamisplus.jar");
        int nBytesToRead;
        FileOutputStream fileInputStream = null;
        BufferedOutputStream bufferedOutputStream = null;

        try {
            nBytesToRead = inputStream.available();
            fileInputStream = new FileOutputStream(file);
            bufferedOutputStream = new BufferedOutputStream(fileInputStream);
            int nRead;
            byte[] data = new byte[nBytesToRead];
            while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                log.info("Writing some bytes of file...");
                bufferedOutputStream.write(data, 0, nRead);
            }

        }catch (IOException e){
            log.error(e.getMessage());
            e.printStackTrace();
        } finally {
            try {
                bufferedOutputStream.close();
                fileInputStream.close();
            }catch (IOException e){
                log.error(e.getMessage());
                e.printStackTrace();
            }
        }
        if(file.exists()){
            //update update table
        }
    }

    //On the server
    public Update checkForUpdateOnServer(Double version){
        Update update = updateRepository.findByMaxVersion(version);
        return update;
    }



    @EventListener(ApplicationReadyEvent.class)
    public void readUpdateOnStartUp() throws IOException {
        File updateFile = null;
        BufferedReader in = null;
        Update update;
        try {
            in = new BufferedReader(new InputStreamReader(
                    getClass().getClassLoader().getResourceAsStream("update.yml")));
            Yaml yaml = new Yaml();
            update = yaml.loadAs(in, Update.class);

            in.close();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error: " + e.getMessage());
        } finally {
            if (in != null) {
                in.close();
            }
        }
        update.setDateCreated(new Timestamp(System.currentTimeMillis()));
        update.setUrl("http://localhost:8080/api/updates/server");
        //This checks if that update is already in the db
        Optional<Update> optionalUpdate = updateRepository.findByCodeAndVersion(update.getCode(), update.getVersion());
        if (optionalUpdate.isPresent()) {
            Update update1 = optionalUpdate.get();
            if (update.getStatus() != update1.getStatus()) {
                update1.setStatus(UPDATE_COMPLETED);
                updateRepository.save(update1);
                return;
            }
        } else {
            updateRepository.save(update);
        }

    }

    //On client
    public Boolean checkForUpdateOnClient(){
        Double updateNotCompleted = updateRepository.findMaxVersionByUpdateAvailableStatus();
        Update lastUpdateCompleted = updateRepository.findUpdateByMaxVersion();
        Boolean isUpdatedAvailable = false;

        if(updateNotCompleted == null) {
            String uri = lastUpdateCompleted.getUrl() + "?version=" + lastUpdateCompleted.getVersion();
            RestTemplate restTemplate = new RestTemplate();
            Update result = restTemplate.getForObject(uri, Update.class);
            if (result != null) {
                result.setStatus(UPDATE_AVAILABLE);
                updateRepository.save(result);
                isUpdatedAvailable = true;
            }
        }
        return isUpdatedAvailable;
    }
}
