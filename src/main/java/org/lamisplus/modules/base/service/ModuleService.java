package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import org.lamisplus.modules.base.repository.*;
import org.lamisplus.modules.base.bootstrap.ClassPathHacker;
import org.lamisplus.modules.base.util.DataLoader;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.bootstrap.ModuleUtil;
import org.lamisplus.modules.base.bootstrap.StorageUtil;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@org.springframework.stereotype.Service
@Slf4j
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
    private final ProgramRepository programRepository;
    private final DataLoader<Form> formDataLoader;
    private final EncounterRepository encounterRepository;
    private static final int MODULE_TYPE = 1;
    private static final int STATUS_UPLOADED = 1;
    private static final int STATUS_INSTALLED = 2;
    private static final int STATUS_STARTED = 3;
    private static final int DEACTIVATED = 5;
    private static final int ARCHIVED = 1;
    private static final int UN_ARCHIVED = 0;
    private static final String OLD_MODULE_SUFFIX = "_old";
    private static final int STATUS_EXIST = 4;
    private static final String ORG_LAMISPLUS_MODULES_PATH = "/org/lamisplus/modules/";
    private List<Module> externalModules;
    private static final boolean ACTIVE = true;
    private static final String FORM = "Form";
    private static final boolean INACTIVE = false;
    private static final String TEMP = "_temp";
    private static final String DOT_JAR = ".jar";
    private Boolean startUp = false;
    private final ConfigurableApplicationContext context;
    //private static final boolean IS_EXIST = true;
    //private static final String CONTENT_TYPE = "application/java-archive";
    //private static final int MODULE_EXIST = 4;



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

    public List<Module> uploadAndUnzip(MultipartFile[] files) {
        ModuleUtil.setModuleConfigs();

        Arrays.asList(files).stream().forEach(file ->{
            if(!file.getOriginalFilename().contains(DOT_JAR)){
                log.info("File is not a jar file");
                log.info(file.getContentType());
                throw new IllegalTypeException(Module.class, file.getOriginalFilename(), "not a jar file");
            }
        });

        Arrays.asList(files).stream().forEach(file ->{
            File jarFile = new File(file.getOriginalFilename());
            String jarName = jarFile.getName().toLowerCase();
            Boolean isExist;

            String fileName = jarFile.getName().toLowerCase().replace(DOT_JAR,"");
            log.info("name of jar file: " + fileName);
            Optional<Module> optionalModule =  moduleRepository.findByName(fileName);


            final Path modulePath = Paths.get(properties.getModulePath());
            storageService.setRootLocation(modulePath);
            if(optionalModule.isPresent() && !optionalModule.get().getName().contains(TEMP)){
                    storageService.store(fileName, file, fileName + TEMP + DOT_JAR);
                    fileName = fileName + TEMP;
                    isExist = true;
                    jarName = jarName.replace(DOT_JAR, "") + TEMP + DOT_JAR;
                    log.debug(fileName + " Uploaded...");
            } else {
                //Copy files
                storageService.store(fileName, file, null);
                log.debug(fileName + " Uploaded...");
                isExist = false;
            }

            final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", fileName);

            try {
                ModuleUtil.copyPathFromJar(storageService.getURL(jarName),
                        fileSeparator, moduleRuntimePath, isExist);
                log.debug(fileName + " Unzipped...");

            } catch (Exception e) {
                log.debug(e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Server error module not loaded: " + e.getMessage());
            }
        });

        return saveExternalModuleWithItsProperties(ModuleUtil.getModuleConfigs(), false, false);
    }

    private List<Module> saveExternalModuleWithItsProperties(List<Module> moduleConfigs, Boolean replace,
                                                             Boolean notArchived) {
        List<Module> modules = new ArrayList<Module>();
        //Saving a module, program, form to db
        moduleConfigs.forEach(externalModule -> {
            if(replace){
                externalModule.setStatus(STATUS_UPLOADED);
                externalModule.setName(externalModule.getName().replace(TEMP, ""));
            }
            if(externalModule.getId() == null) {
                externalModule.setActive(INACTIVE);
                externalModule.setUuid(UUID.randomUUID().toString());
                externalModule.setModuleType(MODULE_TYPE);
                externalModule.setArchived(ARCHIVED);
            }
            if(notArchived){
                externalModule.setArchived(UN_ARCHIVED);
                externalModule.setActive(ACTIVE);
                externalModule.setStatus(STATUS_STARTED);
            }
            Optional<Module> moduleOptional = moduleRepository.findByName(externalModule.getName().toLowerCase());

            //Saving module...
            final Module module = moduleOptional.isPresent()? moduleOptional.get(): moduleRepository.save(externalModule);
            log.debug(module.getName() + " saved...");
            modules.add(module);

            //Getting all dependencies
            externalModule.getModuleDependencyByModule().forEach(moduleDependency -> {
                if(moduleDependency.getId() == null) {
                    moduleDependency.setModuleId(module.getId());
                    moduleDependency.setArchived(ARCHIVED);
                }
                if(notArchived){
                    moduleDependency.setArchived(UN_ARCHIVED);
                }
                //save dependencies
                final Optional<ModuleDependency> OptionalDependency = moduleDependencyRepository.findByModuleIdAndArtifactId(
                        module.getId(), moduleDependency.getArtifactId());
                final ModuleDependency dependency =  OptionalDependency.isPresent()? OptionalDependency.get(): moduleDependencyRepository.save(moduleDependency);
                log.debug(dependency.getArtifactId() + " saved...");

            });

            //Get program
            externalModule.getProgramsByModule().forEach(program -> {
                if(programRepository.findByModuleId(module.getId()).size() < 1){
                    if(program.getId() == null) {
                        program.setModuleId(module.getId());
                        program.setCode(UUID.randomUUID().toString());
                        program.setArchived(ARCHIVED);
                    }
                    if(notArchived){
                        program.setArchived(UN_ARCHIVED);
                    }
                    //Saving program...
                    final Program program1 = programRepository.save(program);
                    program.setId(program1.getId());
                    log.debug(program1.getName() + " saved...");
                }

                //Get forms
                if(program.getFormsByProgram() == null && program.getId() != null) {
                    ModuleUtil.getJsonFile().forEach(jsonFile -> {
                        if (jsonFile.getName().contains(FORM)) {
                            loadExternalModuleForms(jsonFile).forEach(form -> {
                                form.setArchived(ARCHIVED);
                                form.setProgramCode(program.getCode());
                                form.setCode(UUID.randomUUID().toString());
                                //Saving form...
                                final Form form1 = formRepository.save(form);
                                log.debug(form1.getName() + " saved...");

                            });
                        }
                    });
                } else {
                    if(notArchived){
                        program.getFormsByProgram().forEach(form -> {
                            form.setArchived(UN_ARCHIVED);
                            final Form form1 = formRepository.save(form);
                            log.debug(form1.getName() + " saved...");
                        });
                    }
                }
            });
            if(!replace) {
                cleanUpExternalModuleFolder(externalModule);
            }
        });
        return modules;
    }

    public Module installModule(Long moduleId, Boolean isInitialized){
        classNames.clear();
        Optional<Module> moduleOptional = moduleRepository.findById(moduleId);
        List<Module> moduleList = new ArrayList<>();

        if(!moduleOptional.isPresent()) {
            throw new EntityNotFoundException(Module.class, "Module Id", moduleId + "");
        }
        Module module = moduleOptional.get();
        moduleList.add(module);

        if(moduleOptional.get().getName().contains(TEMP) && isInitialized == null) {
            module = overridingOldModuleWithNewModule(moduleOptional.get());
        }

        final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", module.getName());
        File rootFile = new File(moduleRuntimePath.toAbsolutePath().toString());
        File filePath = new File(moduleRuntimePath.toAbsolutePath().toString() +
                ORG_LAMISPLUS_MODULES_PATH + module.getName().replace(TEMP, ""));

        log.debug("moduleRuntimePath is " + moduleRuntimePath.toString());

        if(rootFile != null && rootFile.exists()) {
            try {
               ClassPathHacker.addFile(rootFile.getAbsolutePath());
                List<URL> classURL = showFiles(filePath.listFiles(), rootFile, module.getMain());
                ClassLoader loader = new URLClassLoader(classURL.toArray(
                        new URL[classURL.size()]), ClassLoader.getSystemClassLoader());

                for (String className : classNames) {
                    try {
                        if (className.contains(module.getMain())) {
                            moduleClasses.add(loader.loadClass(className));
                        }
                    } catch (ClassNotFoundException e) {
                        e.printStackTrace();
                    }
                }

            } catch (IOException e) {
                log.debug(e.getClass().getName()+": " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Server error module not loaded: " + e.getMessage());
            }

            //changing module status
            if(isInitialized == null) {
                switch (module.getStatus()) {
                    case STATUS_EXIST:
                        module.setStatus(STATUS_INSTALLED);
                    case STATUS_UPLOADED:
                        module.setStatus(STATUS_INSTALLED);
                        moduleRepository.save(module);
                        break;
                }
            }
        } else {
            log.debug("Cannot find File" + module.getName());
            //TODO: remove module from externalModules list
        }
        return module;
    }

    public void changeFileNames(String tempName, String name) {
        final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", name);
        //final Path oldModulePath = Paths.get(properties.getModulePath(), "runtime", name+OLD_MODULE_SUFFIX);
        final Path moduleTempPath = Paths.get(properties.getModulePath(), "runtime", tempName);
        String oldModulePathRenamed = "";
        String moduleTempPathRenamed = "";

        try {
                // rename a file in the same directory
                oldModulePathRenamed = Files.move(moduleRuntimePath, moduleRuntimePath.resolveSibling(name+OLD_MODULE_SUFFIX)).toString();
                moduleTempPathRenamed = Files.move(moduleTempPath, moduleTempPath.resolveSibling(name)).toString();

            }catch (IOException ioe){
                log.debug(ioe.getMessage());
                ioe.printStackTrace();
            }
        //rootFile.delete();
        System.out.println("changed rootFile- " + oldModulePathRenamed);
        System.out.println("changed tempFile- " + moduleTempPathRenamed);

    }

    private Module overridingOldModuleWithNewModule(Module newModule) {
        List<Module> modules = new ArrayList<>();
        String moduleName = newModule.getName();
        Long moduleId = newModule.getId();
        modules.add(newModule);
        String changedName = UUID.randomUUID().toString().replace("-", "");
        System.out.println(changedName);
        String oldName = moduleName.replace(TEMP,"");
        Optional<Module> optionalOldModule = moduleRepository.findByName(oldName);
        if(optionalOldModule.isPresent() && optionalOldModule.get() != null) {
            final Module oldModule = optionalOldModule.get();
            oldModule.getProgramsByModule().forEach(program -> {
                program.getFormsByProgram().forEach(form -> {
                    form.getEncountersByForm().forEach(encounter -> {
                        encounter.setArchived(DEACTIVATED);
                        encounterRepository.save(encounter);
                        // TODO: DEACTIVATED encounter.getFormDataByEncounter();
                    });
                    form.setArchived(DEACTIVATED);
                    formRepository.save(form);
                });
                program.setArchived(DEACTIVATED);
                programRepository.save(program);
            });
            oldModule.setName(oldName + OLD_MODULE_SUFFIX+"_"+changedName);
            oldModule.setStatus(DEACTIVATED);
            //delete(oldModule.getId());
            moduleRepository.save(oldModule);
            newModule.setStatus(STATUS_UPLOADED);
            moduleRepository.save(newModule);
        }

            //saveExternalModuleWithItsProperties(modules, true, false);

        return moduleRepository.findById(moduleId).get();
    }

    public void startModule(Boolean isStartUp){
        if(isStartUp){
            startUp = isStartUp;
            loadAllExternalModules(STATUS_STARTED, MODULE_TYPE);
        } else {
            loadAllExternalModules(STATUS_INSTALLED, MODULE_TYPE);
        }
        startUp = false;

        externalModules.forEach(module -> {
            if(!isStartUp){
                if(module.getStatus() == STATUS_INSTALLED) {
                    module.setStatus(STATUS_STARTED);
                    module.setActive(ACTIVE);
                    module.setArchived(UN_ARCHIVED);
                    module.setInstalledBy(userService.getUserWithAuthorities().get().getUserName());
                    moduleRepository.save(module);
                }
            }
        });


        if(moduleClasses.size() > 0){
            moduleClasses.add(BaseApplication.class);
            Class [] classArray = new Class[moduleClasses.size()];
            moduleClasses.toArray(classArray);
            BaseApplication.restart(classArray, context);
        }
    }

    public List<Module> getAllModuleByModuleStatus(int moduleType) {
        return getAllModuleByStatusAndModuleType(0, moduleType);
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
        module.getModuleDependencyByModule().forEach(moduleDependency -> {
            moduleDependencyRepository.delete(moduleDependency);
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
                System.out.println(module.getName()+" : "+file.exists());
                module.getModuleDependencyByModule().forEach(moduleDependency -> {
                    if (file.getName().contains(moduleDependency.getArtifactId())) {
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
            installModule(module.getId(), true);
        });
    }

    private void cleanUpExternalModuleFolder(Module externalModule) {
        Boolean foundFile = false;
        final Path moduleJarPath = Paths.get(properties.getModulePath(), externalModule.getName()+".jar");
        final Path moduleDependencyRuntimePath = Paths.get(properties.getModulePath(), "runtime", externalModule.getName(), "lib");
        File jarFile = new File(moduleJarPath.toString());
        if(jarFile != null && jarFile.exists()){
            jarFile.delete();
            log.debug(jarFile.getName() + " deleted...");
        }
        if(externalModule.getModuleDependencyByModule().size() < moduleDependencyRuntimePath.toFile().list().length) {
            for (File file : moduleDependencyRuntimePath.toFile().listFiles()) {
                for (ModuleDependency moduleDependency : externalModule.getModuleDependencyByModule()) {
                    if (file.getName().contains(moduleDependency.getArtifactId())) {
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

    private List<URL> showFiles(File[] files, File rootFile, String mainClass) throws IOException {
        String absolutePath = rootFile.getAbsolutePath();

        List<URL> urlList = new ArrayList<>();
        if(files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    ClassPathHacker.addFile(file.getAbsolutePath());
                    urlList.add(file.toURI().toURL());
                    showFiles(file.listFiles(), rootFile, mainClass); // Calls same method again.
                } else {
                    if (file.getAbsolutePath().endsWith(".class")) {
                        ClassPathHacker.addFile(file.getAbsolutePath());
                        String filePathName = file.getAbsolutePath().replace(absolutePath + fileSeparator, "");
                        String processedName = filePathName.replace(".class", "");
                        processedName = processedName.replace(fileSeparator, ".");
                        if(processedName.contains(mainClass)){
                            classNames.add(processedName);
                        }
                    }
                }
            }
        }
        return urlList;
    }

    public List<Module> getAllModuleByStatusAndModuleType(int moduleStatus, int moduleType) {
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

    public List<Module> getAllModuleByModuleStatusAndBatchNo(int moduleStatus, String batchNo) {
        if(moduleStatus > 0 && batchNo != null){
            return moduleRepository.findAllByStatusAndBatchNo(moduleStatus, batchNo);
        }else if(batchNo != null){
            return moduleRepository.findAllByBatchNo(batchNo);
        } else {
            return moduleRepository.findAllByStatus(moduleStatus);
        }
    }
}