package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ModuleDTO;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.domain.mapper.ModuleMapper;
import org.lamisplus.modules.base.repository.ModuleRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.util.module.ModuleUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final ModuleMapper moduleMapper;
    private final ModuleStorageService storageService;
    private final UserService userService;

    public Module save(ModuleDTO moduleDTO) {
        Optional<Module> moduleOptional = this.moduleRepository.findByName(moduleDTO.getName());
        if(moduleOptional.isPresent()) throw new RecordExistException(Module.class, "Module Id", moduleDTO.getName());

        final Module module = this.moduleMapper.toModuleDTO(moduleDTO);
        module.setCreatedBy(userService.getUserWithAuthorities().get().getUserName());

        return this.moduleRepository.save(module);
    }

    public List<Module> getAllModules(){
        GenericSpecification<Module> genericSpecification = new GenericSpecification<Module>();
        Specification<Module> specification = genericSpecification.findAll();
        List<Module> moduleList = this.moduleRepository.findAll(specification);
        //if(moduleList.size() > 0 || moduleList == null) throw new EntityNotFoundException(Module.class, "Module", moduleId + "");
        return moduleList;

    }

    public Module bootstrap(MultipartFile file, Boolean overrideExistFile){
        List<Module> configs = new ArrayList<>();
        Module module = new Module();
        //create a new file to get file name
        File fileNew = new File(file.getOriginalFilename());
        String fileName = fileNew.getName().toLowerCase().replace(".jar","");

        //Check to see if module exist
        Optional<Module> moduleOptional = this.moduleRepository.findByName(fileName);
        if(moduleOptional.isPresent() && moduleOptional.get().getArchived() != 1) {
            if(overrideExistFile == null || overrideExistFile == false ){
                throw new RecordExistException(Module.class, "Module", fileName);
            }
            moduleOptional.get().setVersion("new version");
            moduleRepository.save(moduleOptional.get());
        }

        //Copy files
        storageService.store(fileName, file, overrideExistFile);
        module.setName(fileName);
        module.setActive(true);
        module.setModuleType(1);
        this.moduleRepository.save(module);

        try {
            ModuleUtils.loadModuleConfig(file.getInputStream(), "module.yml", configs,fileName, true);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return module;

    }

}
