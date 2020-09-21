package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.config.ApplicationProperties;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ModuleDTO;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.domain.entity.ModuleDependency;
import org.lamisplus.modules.base.domain.entity.Program;
import org.lamisplus.modules.base.domain.mapper.ModuleMapper;
import org.lamisplus.modules.base.repository.FormRepository;
import org.lamisplus.modules.base.repository.ModuleDependencyRepository;
import org.lamisplus.modules.base.repository.ModuleRepository;
import org.lamisplus.modules.base.bootstrap.ClassPathHacker;
import org.lamisplus.modules.base.repository.ProgramRepository;
import org.lamisplus.modules.base.util.DataLoader;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.bootstrap.ModuleUtil;
import org.lamisplus.modules.base.bootstrap.StorageUtil;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@org.springframework.stereotype.Service
@Transactional
@RequiredArgsConstructor
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final ModuleDependencyRepository moduleDependencyRepository;
    private final FormRepository formRepository;
    private final ModuleMapper moduleMapper;
    private final StorageUtil storageService;
    private final ApplicationProperties properties;
    private final List<String> classNames;
    private final String fileSeparator = File.separator;
    private final Set<Class> moduleClasses;
    private final GenericSpecification<Module> genericSpecification;
    private final UserService userService;
    private static final int MODULE_TYPE = 1;
    private static final int STATUS_UPLOADED = 1;
    private static final int STATUS_INSTALLED = 2;
    private static final int STATUS_STARTED = 3;
    private static final String ORG_LAMISPLUS_MODULES_PATH = "/org/lamisplus/modules/";
    private List<Module> externalModules;
    private final ProgramRepository programRepository;
    private final DataLoader<Form> formDataLoader;
    private static final boolean ACTIVE = true;
    private static final String FORM = "Form";
    private static final boolean INACTIVE = false;
    private Log log = LogFactory.getLog(ModuleService.class);



    public Module save(ModuleDTO moduleDTO) {
        Optional<Module> moduleOptional = this.moduleRepository.findByName(moduleDTO.getName());
        if(moduleOptional.isPresent()) throw new RecordExistException(Module.class, "Module Id", moduleDTO.getName());

        final Module module = this.moduleMapper.toModuleDTO(moduleDTO);
        module.setCreatedBy(userService.getUserWithAuthorities().get().getUserName());

        return this.moduleRepository.save(module);
    }

    public List<Module> getAllModules(){
        Specification<Module> specification = genericSpecification.findAll();
        return (List<Module>) this.moduleRepository.findAll(specification);
    }

    public List<Module> uploadAndUnzip(MultipartFile[] files, Boolean overrideExistFile) {
        ModuleUtil.setModuleConfigs();
        List<Module> modules = new ArrayList<Module>();
        Arrays.asList(files).stream().forEach(file ->{
            String fileName = file.getOriginalFilename().replace(".jar", "");
           Optional<Module> optionalModule =  moduleRepository.findByName(fileName);
           if(overrideExistFile == null || overrideExistFile == false){
               if(optionalModule.isPresent()){
                   throw new RecordExistException(Module.class, "Module Name", fileName
                           + " (set override to true if replacing exist module)");
               }
           }
            if(!file.getOriginalFilename().contains(".jar")){
                log.info("File is not a jar file");
                throw new IllegalTypeException(Module.class, "File", "not a jar file");
            }
        });

        Arrays.asList(files).stream().forEach(file ->{
             File jarFile = new File(file.getOriginalFilename());

            String fileName = jarFile.getName().toLowerCase().replace(".jar","");
            log.info("name of jar file: " + fileName);

            //Copy files
            URL url = storageService.store(fileName, file, overrideExistFile, null);
            log.info(fileName +" Uploaded...");

             final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", fileName);

             try {
                 ModuleUtil.copyPathFromJar(storageService.getURL(jarFile.getName().toLowerCase()),
                         fileSeparator, moduleRuntimePath);
                 log.debug(fileName +" Unzipped...");
                 //storageService.deleteFile(url.getFile());

             } catch (Exception e) {
                 log.debug(e.getMessage());
                 e.printStackTrace();
                 throw new RuntimeException("Server error module not loaded: " + e.getMessage());
             }
         });

        //Saving a module, program, form to db
        ModuleUtil.getModuleConfigs().forEach(externalModule -> {
            externalModule.setStatus(STATUS_UPLOADED);
            externalModule.setActive(INACTIVE);
            externalModule.setModuleType(MODULE_TYPE);
            Optional<Module> moduleOptional = moduleRepository.findByName(externalModule.getName().toLowerCase());

            //Saving module...
            final Module module = moduleOptional.isPresent()? moduleOptional.get(): moduleRepository.save(externalModule);
            log.debug(module.getName() + " saved...");
            modules.add(module);

            //Getting all dependencies
            externalModule.getModuleDependencyByModule().forEach(moduleDependency -> {
                moduleDependency.setModuleId(module.getId());
                final ModuleDependency dependency = moduleDependencyRepository.save(moduleDependency);
                log.debug(dependency.getArtifact_id() + " saved...");
            });

            //Get program
            externalModule.getProgramsByModule().forEach(program -> {
                if(programRepository.findByModuleId(module.getId()).size() < 1){
                    program.setModuleId(module.getId());
                    //Saving program...
                    final Program program1 =  programRepository.save(program);
                    log.debug(program1.getName() + " saved...");
                    program1.getCode();
                }

                //Get forms
                ModuleUtil.getJsonFile().forEach(jsonFile ->{
                    if(jsonFile.getName().contains(FORM)){
                        loadExternalModuleForms(jsonFile).forEach(form ->{
                            if(!formRepository.findByCode(form.getCode()).isPresent()){
                                form.setProgramCode(program.getCode());
                                //Saving form...
                                final Form form1 = formRepository.save(form);
                                log.debug(form1.getName() + " saved...");
                            }
                        });
                    }
                });
            });
            cleanUpExternalModuleFolder(externalModule);
        });

        return modules;
    }

    public Module installModule(Long moduleId){
        Optional<Module> moduleOptional = this.moduleRepository.findById(moduleId);
        if(!moduleOptional.isPresent()) {
            throw new EntityNotFoundException(Module.class, "Module Id", moduleId + "");
        }
        Module module = moduleOptional.get();

        final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", module.getName());
        File rootFile = new File(moduleRuntimePath.toAbsolutePath().toString());
        File filePath = new File(moduleRuntimePath.toAbsolutePath().toString() +
                ORG_LAMISPLUS_MODULES_PATH + module.getName());

        log.debug("moduleRuntimePath is " + moduleRuntimePath.toString());

        if(rootFile != null && rootFile.exists()) {
            try {
                ClassPathHacker.addFile(rootFile.getAbsolutePath());
                List<URL> classURL = showFiles(filePath.listFiles(), rootFile);
                ClassLoader loader = new URLClassLoader(classURL.toArray(
                        new URL[classURL.size()]), ClassLoader.getSystemClassLoader());

                classNames.forEach(className -> {
                    try {
                        if(className.contains(module.getMain())) {
                            moduleClasses.add(loader.loadClass(className));
                        }
                    } catch (ClassNotFoundException e) {
                        e.printStackTrace();
                    }
                });

            } catch (IOException e) {
                //TODO: Log error and Set modules active to false
                log.debug(e.getClass().getName()+": " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Server error module not loaded: " + e.getMessage());
            }

            switch (module.getStatus()){
                case STATUS_UPLOADED:
                    module.setStatus(STATUS_INSTALLED);
                    break;
                }
        } else {
            log.debug("Cannot find " + module.getName());
            //TODO: remove module from externalModules list
        }
        return moduleRepository.save(module);
    }

    public void startModule(Boolean isStartUp){
        if(isStartUp){
            loadAllExternalModules(STATUS_STARTED, MODULE_TYPE);
        } else {
            loadAllExternalModules(STATUS_INSTALLED, MODULE_TYPE);
        }

        externalModules.forEach(module -> {
            if(module.getStatus() == STATUS_INSTALLED) {
                module.setStatus(STATUS_STARTED);
                module.setActive(ACTIVE);
                module.setInstalledBy(userService.getUserWithAuthorities().get().getUserName());
                moduleRepository.save(module);
            }
        });

        loadDependencies(externalModules);

        if(moduleClasses.size() > 0){
            moduleClasses.add(BaseApplication.class);
            Class [] classArray = new Class[moduleClasses.size()];
            moduleClasses.toArray(classArray);
            BaseApplication.restart(classArray);
        }
    }

    public List<Module> getAllModuleByModuleStatus(int moduleStatus) {
        return getAllModuleByStatusAndModuleType(moduleStatus, MODULE_TYPE);
    }

    public Boolean delete(Long id) {
        Optional<Module> moduleOptional = moduleRepository.findById(id);
        if(!moduleOptional.isPresent()){
            throw new EntityNotFoundException(Module.class, "Module ", "Not Found");
        }
        Module module = moduleOptional.get();
        if(module.getModuleType() == 0){
            throw new IllegalTypeException(Module.class, "Core module", "cannot delete core module");
        }
        module.getProgramsByModule().forEach(program -> {
            program.getFormsByProgram().forEach(form -> formRepository.delete(form));
            programRepository.delete(program);
        });

        moduleRepository.deleteById(id);
        return true;
    }

    public void loadDependencies(List<Module> modules){
        if(externalModules == null || externalModules.isEmpty()){
            if(modules == null || modules.isEmpty()){
                externalModules = getAllModuleByStatusAndModuleType(STATUS_STARTED, MODULE_TYPE);
            }
        }
            externalModules.forEach(module -> {
                final Path moduleDependencyRuntimePath = Paths.get(properties.getModulePath(), "runtime", module.getName(), "lib");
                    for (File file : moduleDependencyRuntimePath.toFile().listFiles()) {
                        System.out.println(file.getName());
                        //Load dependencies
                        System.out.println(file.exists());
                        module.getModuleDependencyByModule().forEach(moduleDependency -> {
                            if (file.getName().contains(moduleDependency.getArtifact_id())) {
                                try {
                                    ClassPathHacker.addFile(file.getAbsolutePath());
                                } catch (IOException e) {
                                    log.debug(e.getClass().getName()+": " + e.getMessage());
                                    e.printStackTrace();
                                }
                            }
                        });

                    }
            });
    }

    private void loadAllExternalModules(int status, int moduleType){
        externalModules = getAllModuleByStatusAndModuleType(status, moduleType);

        externalModules.forEach(module -> {
            installModule(module.getId());
        });
    }

    private void cleanUpExternalModuleFolder(Module externalModule) {
        Boolean foundFile = false;
        final Path moduleJarPath = Paths.get(properties.getModulePath(), externalModule.getName()+".jar");
        final Path moduleDependencyRuntimePath = Paths.get(properties.getModulePath(), "runtime", externalModule.getName(), "lib");
        File jarFile = new File(moduleJarPath.toString());
        if(jarFile != null){
            jarFile.delete();
            log.debug(jarFile.getName() + "deleted...");
        }
        if(externalModule.getModuleDependencyByModule().size() < moduleDependencyRuntimePath.toFile().list().length) {
            for (File file : moduleDependencyRuntimePath.toFile().listFiles()) {
                for (ModuleDependency moduleDependency : externalModule.getModuleDependencyByModule()) {
                    if (file.getName().contains(moduleDependency.getArtifact_id())) {
                        foundFile = true;
                        break;
                    }
                }
                if(!foundFile){
                    file.delete();
                    log.debug(file.getName() + "deleted...");
                } else {
                    foundFile = false;
                }
            }
        }
    }

    private List<URL> showFiles(File[] files, File rootFile) throws IOException {
        String absolutePath = rootFile.getAbsolutePath();

        List<URL> urlList = new ArrayList<>();
        if(files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    ClassPathHacker.addFile(file.getAbsolutePath());
                    urlList.add(file.toURI().toURL());
                    showFiles(file.listFiles(), rootFile); // Calls same method again.
                } else {
                    if (file.getAbsolutePath().endsWith(".class")) {
                        ClassPathHacker.addFile(file.getAbsolutePath());
                        String filePathName = file.getAbsolutePath().replace(absolutePath + fileSeparator, "");
                        String processedName = filePathName.replace(".class", "");
                        processedName = processedName.replace(fileSeparator, ".");
                        classNames.add(processedName);
                    }
                }
            }
        }
        return urlList;
    }

    private List<Module> getAllModuleByStatusAndModuleType(int moduleStatus, int moduleType) {
        Specification<Module> moduleSpecification = genericSpecification.findAllModules(moduleStatus, moduleType);
        List<Module> modules = this.moduleRepository.findAll(moduleSpecification);

        return modules;
    }

    private Class getBeanInContext(String clzName){
        Boolean containsBean = BaseApplication.getContext().containsBean(clzName);
        Class clz = null;
        if(containsBean){
            clz = BaseApplication.getContext().getBean(clzName).getClass();
        }

        return clz;
    }

    private List<Form> loadExternalModuleForms(File searchParam){
        String jsonFile = DataLoader.getJsonFile(searchParam.toPath()).toString();
        List<Form> forms = formDataLoader.readJsonFile(new Form(), jsonFile);

        return forms;
    }
}