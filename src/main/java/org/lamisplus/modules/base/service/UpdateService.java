package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entity.Update;
import org.lamisplus.modules.base.repository.UpdateRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
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

    public List<Update> getUpdates() {
        return this.updateRepository.findAll();
    }

    public void downloadUpdateOnServer(String url) throws IOException {
        try {
            URL urlObject = new URL(url);
            URLConnection urlConnection = urlObject.openConnection();
            urlConnection.connect();
            InputStream inputStream = urlConnection.getInputStream();
            readFromInputStream(inputStream);
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

    public Update checkForUpdateOnServer(Double version){
        Update update = updateRepository.findByMaxVersion(version);
        return update;
    }


    //@EventListener(ApplicationReadyEvent.class)
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

    public Boolean updateAvailable(){
        Double updateNotCompleted = updateRepository.findMaxVersionByUpdateAvailableStatus();
        Double lastUpdateCompleted = updateRepository.findMaxVersion();
        Boolean isUpdatedAvailable = false;

        if(updateNotCompleted == null) {
            String uri = "http://localhost:8080/api/updates/server?version=" + lastUpdateCompleted;
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
