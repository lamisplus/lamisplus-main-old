package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.config.ApplicationProperties;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ModuleDTO;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.domain.entity.Program;
import org.lamisplus.modules.base.domain.mapper.ModuleMapper;
import org.lamisplus.modules.base.repository.FormRepository;
import org.lamisplus.modules.base.repository.ModuleRepository;
import org.lamisplus.modules.base.bootstrap.ClassPathHacker;
import org.lamisplus.modules.base.repository.ProgramRepository;
import org.lamisplus.modules.base.util.DataLoader;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.bootstrap.ModuleUtil;
import org.lamisplus.modules.base.bootstrap.StorageUtil;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
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
@Slf4j
@RequiredArgsConstructor
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final FormRepository formRepository;
    private final ModuleMapper moduleMapper;
    private final StorageUtil storageService;
    private final ApplicationProperties properties;
    private final List<String> classNames;
    private final String fileSeparator = File.separator;
    private final ModuleUtil moduleUtil;
    private final Set<Class> moduleClasses;
    private final GenericSpecification<Module> genericSpecification;
    private final UserService userService;
    private static final int MODULE_TYPE = 1;
    private static final int STATUS_INSTALLED = 2;
    private static final int STATUS_UPLOADED = 1;
    private static final String ORG_LAMISPLUS_MODULES_PATH = "/org/lamisplus/modules/";
    private List<Module> externalModules;
    private final ProgramRepository programRepository;
    private final DataLoader<Form> formDataLoader;


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
             File jarFile = new File(file.getOriginalFilename());
             String fileName = jarFile.getName().toLowerCase().replace(".jar","");

             //Copy files
             storageService.store(fileName, file, overrideExistFile);

             final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", fileName);

             try {
                 ModuleUtil.copyPathFromJar(storageService.getURL(jarFile.getName().toLowerCase()),
                         fileSeparator, moduleRuntimePath);
                 storageService.deleteFile(file.getOriginalFilename());

             } catch (Exception e) {
                 throw new RuntimeException("Server error module not loaded: " + e.getMessage());
             }
         });

        //Saving a module, program, form to db
        ModuleUtil.getModuleConfigs().forEach(externalModule -> {
            externalModule.setStatus(STATUS_UPLOADED);
            externalModule.setActive(false);
            externalModule.setModuleType(MODULE_TYPE);
            //Saving module...
            Optional<Module> moduleOptional = moduleRepository.findByName(externalModule.getName().toLowerCase());

            final Module module = moduleOptional.isPresent()? moduleOptional.get(): moduleRepository.save(externalModule);
            modules.add(module);

            externalModule.getProgramsByModule().forEach(program -> {
                if(programRepository.findByModuleId(module.getId()).size() < 1){
                    program.setModuleId(module.getId());
                    //Saving program...
                    final Program program1 =  programRepository.save(program);
                    program1.getUuid();
                }

                ModuleUtil.getJsonFile().forEach(jsonFile ->{
                    if(jsonFile.getName().contains("Form")){
                        loadExternalModuleForms(module.getName(), jsonFile).forEach(form ->{
                            if(!formRepository.findByCode(form.getCode()).isPresent()){
                                form.setProgramCode(program.getUuid());
                                //Saving form...
                                formRepository.save(form);
                            }
                        });
                    }
                });
            });
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

        log.info("moduleRuntimePath is " + moduleRuntimePath.toString());

        try {
            ClassPathHacker.addFile(rootFile.getAbsolutePath());
            List<URL> classURL = showFiles(filePath.listFiles(), rootFile);
            ClassLoader loader = new URLClassLoader(classURL.toArray(
                    new URL[classURL.size()]), ClassLoader.getSystemClassLoader());
            log.debug("rootFile is: " + rootFile.getAbsolutePath());

            classNames.forEach(className ->{
                try {
                    moduleClasses.add(loader.loadClass(className));
                } catch (ClassNotFoundException e) {
                    e.printStackTrace();
                }
            });

        } catch (IOException e) {
            //TODO: Log error and Set modules active to false
            //module.setActive(false);
            throw new RuntimeException("Server error module not loaded: " + e.getMessage());
        }
        for(File file: moduleRuntimePath.toFile().listFiles()){
            System.out.println(file.getName());
            //Load dependencies
            if(file.getName().contains("lib")){
                System.out.println(file.exists());
                for(File jarfile: file.listFiles()) {
                    try {
                        ClassPathHacker.addFile(jarfile.getAbsolutePath());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        module.setStatus(STATUS_INSTALLED);
        module.setActive(true);
        return moduleRepository.save(module);
    }

    public void startModule(){
        loadAllExternalModules(STATUS_INSTALLED, MODULE_TYPE);

        //TODO: Set module status to 3 which is started
        if(moduleClasses.size() > 0){
            moduleClasses.add(BaseApplication.class);
            Class [] classArray = new Class[moduleClasses.size()];
            moduleClasses.toArray(classArray);
            BaseApplication.restart(classArray);
        }
    }

    /*public void loadDependenciesOfModules(int status, int moduleType){
        List<Module> modules = getAllModuleByStatusAndModuleType(status, moduleType);
        modules.forEach(module -> {
            getDependency(module.getName());
        });
    }*/

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
            throw new IllegalStateException("Cannot not delete Core module");
        }
        module.getProgramsByModule().forEach(program -> {
            program.getFormsByProgram().forEach(form -> formRepository.delete(form));
            programRepository.delete(program);
        });

        moduleRepository.deleteById(id);
        return true;
    }


    private void loadAllExternalModules(int status, int moduleType){
        externalModules = getAllModuleByStatusAndModuleType(status, moduleType);

        externalModules.forEach(module -> {
            installModule(module.getId());
        });
    }

    private List<URL> showFiles(File[] files, File rootFile) throws IOException {
        String absolutePath = rootFile.getAbsolutePath();

        List<URL> urlList = new ArrayList<>();
        for (File file : files) {
                if (file.isDirectory()) {
                    ClassPathHacker.addFile(file.getAbsolutePath());
                    urlList.add(file.toURI().toURL());
                    showFiles(file.listFiles(),rootFile); // Calls same method again.
                } else {
                    if(file.getAbsolutePath().endsWith(".class")) {
                        ClassPathHacker.addFile(file.getAbsolutePath());
                        String filePathName = file.getAbsolutePath().replace(absolutePath + fileSeparator, "");
                        String processedName = filePathName.replace(".class", "");
                        processedName = processedName.replace(fileSeparator, ".");
                        classNames.add(processedName);
                    }
                }
        }
        return urlList;
    }

    /*private void getDependency(String moduleName){
        final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", moduleName);
        File dependencies = new File(moduleRuntimePath.toAbsolutePath().toString() + fileSeparator + "lib");
        List <String> dependencyClasses = new ArrayList<String>();
        List <URL> dependencyURLs = new ArrayList<URL>();

        for (File jar : dependencies.listFiles()) {
            try {
                InputStream targetStream = new FileInputStream(jar);
                ClassPathHacker.addFile(dependencies.getAbsolutePath()+fileSeparator + jar.getName().toLowerCase());
                dependencyClasses = moduleUtil.readZipFileRecursive(targetStream, jar.getName().toLowerCase(), false);
                dependencyURLs.add(jar.toURI().toURL());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        URL [] urlArray = new URL[dependencyURLs.size()];
        dependencyURLs.toArray(urlArray);

        ClassLoader loader = new URLClassLoader(urlArray, ClassLoader.getSystemClassLoader());

        dependencyClasses.forEach(dependencyClass ->{
            try {
                loader.loadClass(dependencyClass);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        });
    }*/

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

    private List<Form> loadExternalModuleForms(String moduleName, File searchParam){

        String jsonFile = DataLoader.getJsonFile(searchParam.toPath()).toString();
        List<Form> forms = formDataLoader.readJsonFile(new Form(), jsonFile);

        return forms;
    }
}