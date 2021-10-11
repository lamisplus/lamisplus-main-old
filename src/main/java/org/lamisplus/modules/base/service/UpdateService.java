package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.DrugDTO;
import org.lamisplus.modules.base.domain.entity.DrugGroup;
import org.lamisplus.modules.base.domain.entity.Update;
import org.lamisplus.modules.base.domain.mapper.DrugMapper;
import org.lamisplus.modules.base.repository.DrugGroupRepository;
import org.lamisplus.modules.base.repository.UpdateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class UpdateService {
    private final UpdateRepository updateRepository;

    public List<Update> getAllUpdates() {
        return this.updateRepository.findAll();
    }

    public void downloadUpdateOnServer(String url) {
        try {
            URL urlObject = new URL(url);
            URLConnection urlConnection = urlObject.openConnection();
            urlConnection.connect();
            InputStream inputStream = urlConnection.getInputStream();
            readFromInputStream(inputStream);
        } catch (IOException e) {
            log.error(e.getMessage());
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

    public Boolean checkForUpdate(){
        return null;
    }

}
